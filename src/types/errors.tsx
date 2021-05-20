export class CloudAuthenticationError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, CloudAuthenticationError.prototype);
  }
}
export class CloudRateLimitError extends Error {
  public readonly retryAfter = 1 + Math.random();
  constructor() {
    super();
    Object.setPrototypeOf(this, CloudRateLimitError.prototype);
  }
}
export class CloudInitError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, CloudInitError.prototype);
  }
}
export class CloudTransferError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, CloudTransferError.prototype);
  }
}
export class CryptoError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, CryptoError.prototype);
  }
}
export class LocalStorageError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, LocalStorageError.prototype);
  }
}
