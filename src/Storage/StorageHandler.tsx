class StorageHandler {
  cloud: boolean | any; 
  constructor() {
    this.cloud = false; 
  }
  save(key: any, value: any) {
    if(this.cloud) {
      return this.cloud.save(key, value);
    }
    localStorage.setItem(key, value); 
  }
  load(key: any) {
    if(this.cloud) {
      return this.cloud.load(key);
    }
    return localStorage.getItem(key);
  }
}
export default StorageHandler;
