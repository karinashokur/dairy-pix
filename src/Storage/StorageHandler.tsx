import Cloud from './Cloud';
import CloudDropbox from './CloudDropbox';
export enum SupportedClouds {
  Dropbox
}
export default class StorageHandler {
  private cloud: Cloud | false = false;
  constructor() {
    const variant = localStorage.getItem('storage');
    if (variant) {
      this.connectCloud(parseInt(variant, 10));
    }
  }
  async save(key: string, value: string): Promise<void> {
    if (this.cloud) {
      await this.cloud.save(key, value); return;
    }
    localStorage.setItem(key, value);
  }
  async load(key: string): Promise<string | null> {
    if (this.cloud) {
      return this.cloud.load(key);
    }
    return localStorage.getItem(key);
  }
  connectCloud(variant: SupportedClouds): void {
    switch (variant) {
      case SupportedClouds.Dropbox: this.cloud = new CloudDropbox(); break;
      default: break;
    }
    localStorage.setItem('storage', variant.toString());
  }
  connected(): boolean {
    return this.cloud !== false;
  }
}
