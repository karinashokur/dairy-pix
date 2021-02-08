import { isArray } from 'util';
import CloudStorage from '../types/cloud-storage';
import CloudDropbox from './cloud-dropbox';
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
  static cloud: CloudStorage | false = false;
  static index: string[] = [];
  static init(): void {
    if (this.initialized) return;
    const serializedIndex = localStorage.getItem('storageIndex');
    if (serializedIndex) {
      const parsedIndex = JSON.parse(serializedIndex);
      this.index = isArray(parsedIndex) ? parsedIndex : [];
    }
    const variant = localStorage.getItem('storage');
    if (variant) {
      this.connectCloud(parseInt(variant, 10));
    }
    this.initialized = true;
  }
  static async save(key: string, value: string): Promise<void> {
    if (!this.initialized) this.init();
    this.updateIndex(key);
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
  static updateIndex(key: string): void {
    if (this.cloud || this.index.includes(key)) return;
    this.index.push(key);
    this.save('storageIndex', JSON.stringify(this.index));
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
  static async transferToCloud(): Promise<void> {
    if (!this.cloud || !this.index.length) return;
    if (await this.cloud.isPopulated()) {
      console.warn('ABORTED TRANSFER: Cloud storage already contains diary data!');
      return;
    }
    const requests: Promise<void>[] = [];
    for (const key of this.index) { 
      const value = localStorage.getItem(key);
      if (value) {
        requests.push(this.save(key, value));
      }
    }
    await Promise.all(requests);
    for (const key of this.index) { 
      localStorage.removeItem(key);
    }
    localStorage.removeItem('storageIndex');
    this.index = [];
  }
  static disconnectCloud(): void {
    if (!this.cloud) return;
    this.cloud.disconnect();
    this.cloud = false;
    localStorage.removeItem('storage');
  }
}
