import queryString from 'query-string';
import CloudStorage from '../types/cloud-storage';
export default abstract class CloudOneDrive extends CloudStorage {
  static api = {
    id: '3705eba3-4eba-4e77-9d94-2ec3e747c9f7',
    scopes: ['Files.ReadWrite.AppFolder'],
    url: 'https:
  };
  static token: string | null = null;
  static appUrl = window.location.origin + window.location.pathname;
  static init(): void {
    if (this.token) return;
    if (localStorage.getItem('storageToken')) {
      this.token = localStorage.getItem('storageToken');
    }
    if (!this.token && this.getTokenFromUrl()) {
      this.token = this.getTokenFromUrl();
      window.history.replaceState(null, 'Cloud Connected', this.appUrl); 
    }
    if (!this.token) {
      window.location.href = `https:        client_id=${this.api.id}&\
        response_type=token&\
        scope=${this.api.scopes.join(' ')}&\
        redirect_uri=${this.appUrl}`;
    } else {
      localStorage.setItem('storageToken', this.token);
    }
  }
  static async save(filename: string, value: string): Promise<void> {
    if (!this.token) this.init();
    await fetch(`${this.api.url}:/${filename}:/content`, {
      method: 'PUT',
      headers: [['Authorization', `Bearer ${this.token}`]],
      body: value,
    });
  }
  static async load(filename: string): Promise<string | null> {
    if (!this.token) this.init();
    const response = await fetch(`${this.api.url}:/${filename}:/content`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    return response.text();
  }
  static async isPopulated(): Promise<boolean> {
    if (!this.token) this.init();
    const response = await fetch(`${this.api.url}/children`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    const folder = JSON.parse(await response.text());
    if (folder.value.length > 0) return true;
    return false;
  }
  static async disconnect(): Promise<void> {
    if (!this.token) return;
    localStorage.removeItem('storageToken');
    this.token = null;
  }
  static getTokenFromUrl(): string | null {
    const query = queryString.parse(window.location.hash);
    return query.access_token ? query.access_token as string : null;
  }
}
