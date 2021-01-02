import Cloud from './Cloud';
export default class StorageHandler {
  cloud: false | Cloud;
  constructor() {
    this.cloud = false; 
  }
  save(key: string, value: string): void {
    if (this.cloud) {
      this.cloud.save(key, value); return;
    }
    localStorage.setItem(key, value);
  }
  load(key: string): string | null {
    if (this.cloud) {
      return this.cloud.load(key);
    }
    return localStorage.getItem(key);
  }
}
