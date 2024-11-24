module.exports = {
  E0001: {
    errorDescription: "Invalid Input",
    statusCode: 400,
    message: "The provided input is invalid.",
    errorCode: "E0001",
  },
  E0002: {
    errorDescription: "Authentication Failed",
    statusCode: 401,
    message: "Invalid username or password.",
    errorCode: "E0002",
  },
  E0003: {
    errorDescription: "Resource Not Found",
    statusCode: 404,
    message: "The requested resource does not exist.",
    errorCode: "E0003",
  },
  E0004: {
    errorDescription: "Internal Server Error",
    statusCode: 500,
    message: "An unexpected error occurred. Please try again later.",
    errorCode: "E0004",
  },
  E0005: {
    errorDescription: "Missing User Type",
    statusCode: 400,
    message: "User Type is required for this operation.",
    errorCode: "E0005",
  },
  E0006: {
    errorDescription: "Operation Failure",
    statusCode: 400,
    message: "Sign up operation has failed.",
    errorCode: "E0006",
  },
  E0007: {
    errorDescription: "Missing Data",
    statusCode: 400,
    message: "Username or Userpassword is missing.",
    errorCode: "E0007",
  },
  E0008: {
    errorDescription: "Operation Failure",
    statusCode: 400,
    message: "Sign in operation has failed.",
    errorCode: "E0008",
  },
  DEFAULT_ERROR: {
    errorDescription: "Unknown Error",
    statusCode: 500,
    message: "An unknown error occurred.",
    errorCode: "9999",
  },
};
