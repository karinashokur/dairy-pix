export default class CloudAuthenticationError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, CloudAuthenticationError.prototype);
  }
}
