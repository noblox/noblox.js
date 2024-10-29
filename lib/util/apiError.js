// The data should be a response object

class RobloxAPIError extends Error {
  constructor(data) {
    this.httpStatusCode = data.statusCode
    this.responseBody = (function () {
      if (typeof data.body === "string") return data.body;

      try {
        return JSON.stringify(data.body)
      } catch {
        throw Error("The passed response body is not a valid object")
      }
    })
  }
}
