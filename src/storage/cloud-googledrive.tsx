import queryString from 'query-string';
import CloudStorage from '../types/cloud-storage';
export default abstract class CloudGoogleDrive extends CloudStorage {
  static api = {
    id: '986706832154-o4c8st4r22prsmi8g1j2gu05be3rgrga.apps.googleusercontent.com',
    scopes: ['https:
    readUrl: 'https:
    writeUrl: 'https:
  };
  static token: string | null = null;
  static appUrl = window.location.origin;
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
        scope=${encodeURI(this.api.scopes.join(' '))}&\
        redirect_uri=${this.appUrl}`.replace(/ /gm, ''); 
    } else {
      localStorage.setItem('storageToken', this.token);
    }
  }
  static async save(filename: string, value: string): Promise<void> {
    if (!this.token) this.init();
    const content = new FormData();
    content.append('meta', new Blob([JSON.stringify({ title: filename })], { type: 'application/json' }));
    content.append('file', new Blob([value], { type: 'text/plain' }));
    const fileId = await this.exists(filename);
    const response = await fetch(`${this.api.writeUrl}${fileId ? `/${fileId}` : ''}?uploadType=multipart`, {
      method: fileId ? 'PUT' : 'POST',
      headers: [['Authorization', `Bearer ${this.token}`]],
      body: content,
    });
    if (!response.ok) throw JSON.parse(await response.text());
  }
  static async load(filename: string): Promise<string | null> {
    if (!this.token) this.init();
    const fileId = await this.exists(filename);
    if (!fileId) return null;
    const file = await fetch(`${this.api.readUrl}/${fileId}?alt=media`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    if (!file.ok) throw JSON.parse(await file.text());
    return file.text();
  }
  static async exists(filename: string): Promise<string | false> {
    if (!this.token) this.init();
    const query = filename === '*' ? `?g=${filename}` : '';
    const response = await fetch(`${this.api.readUrl}${query}`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    const body = JSON.parse(await response.text());
    if (!response.ok) throw body;
    if (body.items.length === 0) return false;
    return body.items[0].id;
  }
  static async isPopulated(): Promise<boolean> {
    if (!this.token) this.init();
    return !!await this.exists('*');
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
