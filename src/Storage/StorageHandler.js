class StorageHandler {
  constructor() {
    this.cloud = false; 
  }
  save(key, value) {
    if(this.cloud) {
      return this.cloud.save(key, value);
    }
    localStorage.setItem(key, value); 
  }
  load(key) {
    if(this.cloud) {
      return this.cloud.load(key);
    }
    return localStorage.getItem(key);
  }
}
export default StorageHandler;
