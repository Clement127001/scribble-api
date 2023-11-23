const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

const authenticationMiddleware = (req, res, next) => {
  const authenticationHeader = req.headers.authorization;

  if (!authenticationHeader || !authenticationHeader.startsWith("Bearer")) {
    // console.log("No authorization header available");
    throw new UnauthorizedError("Unauthorized user");
  }

  const token = authenticationHeader.split(" ")[1];

  if (!token) {
    // console.log("No token is found");
    throw new UnauthorizedError("Not authorised to access this resource");
  }

  try {
    const isAuthroized = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("user is authorised");
    const { userId, name } = isAuthroized;
    req.user = { userId, name };

    next();
  } catch (err) {
    // console.log("user is not authorised");
    throw new UnauthorizedError("Unauthorised user");
  }
};

module.exports = authenticationMiddleware;
