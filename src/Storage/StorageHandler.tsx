import Cloud from './Cloud';
import CloudDropbox from './CloudDropbox';
export enum SupportedClouds {
  Dropbox
}
export class LocalStorageError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, LocalStorageError.prototype);
  }
}
export default abstract class StorageHandler {
  static initialized = false;
  static cloud: Cloud | false = false;
  static init(): void {
    if (this.initialized) return;
    const variant = localStorage.getItem('storage');
    if (variant) {
      this.connectCloud(parseInt(variant, 10));
    }
  }
  static async save(key: string, value: string): Promise<void> {
    if (!this.initialized) this.init();
    if (this.cloud) {
      await this.cloud.save(key, value); return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      throw new LocalStorageError();
    }
  }
  static async load(key: string): Promise<string | null> {
    if (!this.initialized) this.init();
    if (this.cloud) {
      return this.cloud.load(key);
    }
    return localStorage.getItem(key);
  }
  static connectCloud(variant: SupportedClouds): void {
    if (this.cloud) return;
    switch (variant) {
      case SupportedClouds.Dropbox: this.cloud = CloudDropbox; break;
      default: break;
    }
    if (this.cloud) {
      this.cloud.init();
      localStorage.setItem('storage', variant.toString());
    }
  }
  static disconnectCloud(): void {
    if (!this.cloud) return;
    this.cloud.disconnect();
    this.cloud = false;
    localStorage.removeItem('storage');
  }
}
