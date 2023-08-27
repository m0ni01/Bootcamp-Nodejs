class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.statuscode = status;
  }
}

module.exports = ErrorResponse;
