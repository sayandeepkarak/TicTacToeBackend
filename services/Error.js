class OwnError {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }

  static invalidDataError(message = "Invalid data") {
    return new OwnError(422, message);
  }

  static unAuthorizedError(message = "authorization failed") {
    return new OwnError(401, message);
  }

  static notFoundError(message = "Not found") {
    return new OwnError(404, message);
  }
}

export default OwnError;
