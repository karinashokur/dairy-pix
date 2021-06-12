import { isArray } from 'util';
import { bugsnagClient } from '../helper/bugsnag';
import CryptoService from '../services/crypto-service';
import { CloudAuthenticationError, CloudInitError, CloudRateLimitError, CloudTransferError, LocalStorageError } from '../types/errors';
import SupportedClouds from '../types/supported-clouds';
import CloudStorage from './cloud';
import CloudDropbox from './cloud-dropbox';
import CloudGoogleDrive from './cloud-googledrive';
import CloudOneDrive from './cloud-onedrive';
export default abstract class StorageHandler {
  static initialized = false;
  static cloud: CloudStorage | false = false;
  static index: string[] = [];
  static onForcedDisconnect: Function;
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
    bugsnagClient.leaveBreadcrumb('Saving to storage', key);
    const cryptoValue = key === 'encryption' ? value : CryptoService.encrypt(value);
    if (this.cloud) {
      try {
        const { cloud } = this;
        await this.retry(() => cloud.save(key, cryptoValue)); return;
      } catch (e) {
        if (!this.catchDisconnect(e)) throw e;
      }
    }
    try {
      localStorage.setItem(key, cryptoValue);
      this.updateIndex(key);
    } catch (e) {
      throw new LocalStorageError();
    }
  }
  static async load(key: string): Promise<string | null> {
    if (!this.initialized) this.init();
    bugsnagClient.leaveBreadcrumb('Loading from storage', key);
    try {
      let value: string | null = localStorage.getItem(key);
      if (this.cloud) {
        const { cloud } = this;
        value = await this.retry(() => cloud.load(key));
      }
      return value ? CryptoService.decrypt(value) : null;
    } catch (e) {
      if (!this.catchDisconnect(e)) throw e;
      return null;
    }
  }
  static async list(): Promise<string[]> {
    if (!this.initialized) this.init();
    if (this.cloud) return this.cloud.list();
    return this.index;
  }
  static updateIndex(key: string): void {
    if (this.cloud || this.index.includes(key)) return;
    this.index.push(key);
    localStorage.setItem('storageIndex', JSON.stringify(this.index));
  }
  static connectCloud(variant: SupportedClouds): void {
    if (this.cloud) return;
    switch (variant) {
      case SupportedClouds.Dropbox: this.cloud = CloudDropbox; break;
      case SupportedClouds.OneDrive: this.cloud = CloudOneDrive; break;
      case SupportedClouds.GoogleDrive: this.cloud = CloudGoogleDrive; break;
      default: break;
    }
    if (this.cloud) {
      try {
        this.cloud.init();
        localStorage.setItem('storage', variant.toString());
        bugsnagClient.leaveBreadcrumb('Cloud storage connected');
      } catch (e) {
        if (!(e instanceof CloudInitError)) throw e;
        this.cloud = false;
        localStorage.removeItem('storage'); 
      }
    }
  }
  static async transferToCloud(progress?: (value: number) => void): Promise<void> {
    if (!this.cloud || !this.index.length) return;
    if ((await this.cloud.list()).length > 0) throw new CloudTransferError();
    bugsnagClient.leaveBreadcrumb('Transferring local data to cloud storage');
    let done = 0;
    const requests: Promise<void>[] = [];
    this.index.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        requests.push(this.save(key, value)
          .then(() => { if (progress) progress((done += 1) / this.index.length); }));
      }
    });
    await Promise.all(requests); 
    this.index.forEach(key => localStorage.removeItem(key)); 
    localStorage.removeItem('storageIndex');
    this.index = [];
  }
  static async rewriteAll(progress?: (value: number) => void): Promise<void> {
    bugsnagClient.leaveBreadcrumb('Rewriting storage data');
    const keys = await this.list();
    const loadRequests: Promise<void>[] = [];
    const saveRequests: Promise<void>[] = [];
    let done = 0;
    const upProgress = () => { if (progress) progress((done += 1) / (keys.length * 2)); };
    keys.forEach(key => {
      if (key === 'encryption') return; 
      loadRequests.push(StorageHandler.load(key).then(value => {
        upProgress();
        if (value) saveRequests.push(StorageHandler.save(key, value).then(upProgress));
      }));
    });
    await Promise.all(loadRequests);
    await Promise.all(saveRequests);
  }
  static disconnectCloud(): void {
    if (!this.cloud) return;
    this.cloud.disconnect();
    this.cloud = false;
    localStorage.removeItem('storage');
    bugsnagClient.leaveBreadcrumb('Cloud storage disconnected');
  }
  private static catchDisconnect(error: any): boolean {
    if (error instanceof CloudAuthenticationError) {
      if (this.onForcedDisconnect instanceof Function) this.disconnectCloud();
      this.onForcedDisconnect();
      return true;
    }
    return false;
  }
  private static async retry<T>(request: () => Promise<T>, waitSeconds = 0, count = 0): Promise<T> {
    try {
      await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
      return await request();
    } catch (e) {
      if (!(e instanceof CloudRateLimitError) || count >= 5) throw e;
      return this.retry(request, e.retryAfter, count + 1); 
    }
  }
}
