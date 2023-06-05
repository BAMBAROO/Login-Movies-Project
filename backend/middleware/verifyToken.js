import jwt from "jsonwebtoken";

// MEMVERIFIKASI ACCESS TOKEN
const verifyToken = async (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (token === null) {
    res.status(404).json({ message: "no access token" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
    if (err) {
      res.status(403).json({ message: "token is not accessible" });
    }
    if (result) {
      req.name = result.name;
    }
    next();
  });
};

export default verifyToken;
