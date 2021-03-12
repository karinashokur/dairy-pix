export default class LocalStorageError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, LocalStorageError.prototype);
  }
}
