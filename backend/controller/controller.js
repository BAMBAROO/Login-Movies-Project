import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/config.js";

export const getMovie = async (req, res) => {
  const { movie } = req.body;
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=9c7663ba&s=${movie}`
    );
    const result = await response.json();
    const id = result.Search;

    let movies = Promise.all(
      id.map(async (data) => {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=9c7663ba&i=${data.imdbID}`
        );
        const result = await response.json();
        console.log(result);
        return result;
      })
    );
    movies.then((data) => {
      res.json(data);
    });
  } catch (err) {
    console.error(err);
  }
};

export const register = async (req, res) => {
  const client = await pool.connect();
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "password are doesn't match" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    client.query(
      `SELECT * FROM accounts WHERE username='${username}' OR email='${email}';`,
      (err, result) => {
        if (err) throw err;
        if (result.rowCount > 0) {
          return res
            .status(400)
            .json({ message: "username or email already exist" });
        }
      }
    );
    const result = await client.query(
      `INSERT INTO accounts(username,password,email,refreshtoken) VALUES('${username}','${hashedPassword}','${email}','');`
    );
    if (result.rowCount > 0) {
      console.log("insert successfully");
      return res.status(200).json({ message: "success register" });
    } else {
      console.log("failed insert");
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

export const login = async (req, res) => {
  const client = await pool.connect();
  const { email, password } = req.body;
  console.log(req.body);
  const response = await client.query(
    `SELECT * FROM accounts WHERE email='${email}'`
  );
  console.log(response.rowCount);

  if (response.rowCount == 0) {
    return res.status(404).json({ message: "no user with that email" });
  }

  const match = await bcrypt.compare(password, response.rows[0].password);
  if (!match) {
    return res.status(400).json({ message: "wrong password" });
  }

  try {
    const user = response.rows[0];
    const username = user.username;
    const password = user.password;
    const email = user.email;

    const accessToken = jwt.sign(
      { username, password, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "120s" }
    );
    const refreshToken = jwt.sign(
      { username, password, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    console.log({ refreshToken });
    console.log({ accessToken });
    await client.query(
      `UPDATE accounts SET refreshToken='${refreshToken}' WHERE username='${username}' RETURNING *;`
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    });
    res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

export const logout = async (req, res) => {
  const client = await pool.connect();
  try {
    const refreshToken = req.cookies["refreshToken"];
    const user = await client.query(
      `SELECT * FROM accounts WHERE refreshToken='${refreshToken}'`
    );
    if (user.rowCount > 0) {
      const { email } = user.rows[0];
      const response = await client.query(
        `UPDATE accounts SET refreshToken='' WHERE email='${email}' RETURNING *;`
      );
      if (response.rowCount > 0) {
        res.clearCookie("refreshToken");
        return res.sendStatus(200);
      }
      res.status(400).json({ message: "something went wrong" });
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};
