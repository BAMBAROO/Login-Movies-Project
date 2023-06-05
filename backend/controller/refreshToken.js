import jwt from "jsonwebtoken";
import pool from "../config/config.js";

const refreshToken = async (req, res) => {
  const client = await pool.connect();
  try {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken)
      return res.status(401).json({ message: "something went wrong" });
    const user = await client.query(
      `SELECT * FROM accounts WHERE refreshToken='${refreshToken}';`
    );
    const { username, password, email } = user.rows[0];
    const accessToken = jwt.sign(
      { username, password, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "60s",
      }
    );
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
  }
};

export default refreshToken;
