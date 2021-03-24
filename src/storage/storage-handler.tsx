import { isArray } from 'util';
import CryptoService from '../services/crypto-service';
import { CloudInitError, CloudTransferError, LocalStorageError } from '../types/errors';
import SupportedClouds from '../types/supported-clouds';
import CloudStorage from './cloud';
import CloudDropbox from './cloud-dropbox';
import CloudGoogleDrive from './cloud-googledrive';
import CloudOneDrive from './cloud-onedrive';
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
    const cryptoValue = key === 'encryption' ? value : CryptoService.encrypt(value);
    if (this.cloud) {
      await this.cloud.save(key, cryptoValue); return;
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
    const value = this.cloud ? await this.cloud.load(key) : localStorage.getItem(key);
    return value ? CryptoService.decrypt(value) : null;
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
      } catch (e) {
        if (!(e instanceof CloudInitError)) throw e;
        this.cloud = false;
        localStorage.removeItem('storage'); 
      }
    }
  }
  static async transferToCloud(): Promise<void> {
    if (!this.cloud || !this.index.length) return;
    if ((await this.cloud.list()).length > 0) throw new CloudTransferError();
    const requests: Promise<void>[] = [];
    this.index.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        requests.push(this.save(key, value));
      }
    });
    await Promise.all(requests); 
    this.index.forEach(key => localStorage.removeItem(key)); 
    localStorage.removeItem('storageIndex');
    this.index = [];
  }
  static async rewriteAll(): Promise<void> {
    const keys = await this.list();
    const loadRequests: Promise<string | null>[] = [];
    const saveRequests: Promise<void>[] = [];
    keys.forEach(key => {
      if (key === 'encryption') return; 
      const req = StorageHandler.load(key);
      loadRequests.push(req);
      req.then(value => { if (value) saveRequests.push(StorageHandler.save(key, value)); });
    });
    await Promise.all(loadRequests);
    await Promise.all(saveRequests);
  }
  static disconnectCloud(): void {
    if (!this.cloud) return;
    this.cloud.disconnect();
    this.cloud = false;
    localStorage.removeItem('storage');
  }
}
