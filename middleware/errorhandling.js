const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlingMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong, please try again later",
  };

  if (err.name === "CastError") {
    customError.message = `Invalid id : ${err.value._id}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code === 11000) {
    customError.message = `${Object.keys(
      err.keyValue
    )} already exists, please provide unique url`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // if (err.message.startsWith("E11000 duplicate key error collection"))
  // res.status(404).json({ err });
  res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlingMiddleware;
