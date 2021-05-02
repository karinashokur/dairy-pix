import { CloudAuthenticationError } from '../types/errors';
import SupportedClouds from '../types/supported-clouds';
import CloudStorage from './cloud';
export default abstract class CloudGoogleDrive extends CloudStorage {
  static readonly variant = SupportedClouds.GoogleDrive;
  static readonly api = {
    id: process.env.REACT_APP_CLOUD_GOOGLE_DRIVE,
    scopes: ['https:
    readUrl: 'https:
    writeUrl: 'https:
  };
  static init(): void {
    super.init(`https:      client_id=${this.api.id}&\
      response_type=token&\
      scope=${encodeURI(this.api.scopes.join(' '))}&\
      redirect_uri=${this.appUrl.replace(/\/$/, '')}` 
      .replace(/ /gm, '')); 
  }
  static async save(filename: string, value: string): Promise<void> {
    if (!this.token) this.init();
    const content = new FormData();
    content.append('meta', new Blob([JSON.stringify({
      name: filename,
      parents: ['appDataFolder'],
    })], { type: 'application/json' }));
    content.append('file', new Blob([value], { type: 'text/plain' }));
    const fileId = await this.exists(filename);
    const response = await fetch(`${this.api.writeUrl}${fileId ? `/${fileId}` : ''}?uploadType=multipart`, {
      method: fileId ? 'PUT' : 'POST',
      headers: [['Authorization', `Bearer ${this.token}`]],
      body: content,
    });
    if (response.status === 401) throw new CloudAuthenticationError();
    if (!response.ok) throw new Error(JSON.parse(await response.text()));
  }
  static async load(filename: string): Promise<string | null> {
    if (!this.token) this.init();
    const fileId = await this.exists(filename);
    if (!fileId) return null;
    const file = await fetch(`${this.api.readUrl}/${fileId}?alt=media`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    if (file.status === 401) throw new CloudAuthenticationError();
    if (!file.ok) throw new Error(JSON.parse(await file.text()));
    return file.text();
  }
  static async list(): Promise<string[]> {
    if (!this.token) this.init();
    const keys: string[] = [];
    (await this.files('*')).forEach((v: {name: string}) => keys.push(v.name));
    return keys;
  }
  private static async files(filename: string): Promise<{name: string, id: string}[]> {
    if (!this.token) this.init();
    const query = filename !== '*' ? `&q=${encodeURI(`name='${filename}'`)}` : '';
    const response = await fetch(`${this.api.readUrl}?spaces=AppDataFolder&pageSize=1000${query}`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    const body = JSON.parse(await response.text());
    if (response.status === 401) throw new CloudAuthenticationError();
    if (!response.ok) throw new Error(body);
    return body.files;
  }
  private static async exists(filename: string): Promise<false | string> {
    const files = await this.files(filename);
    if (files.length === 0) return false;
    return files[0].id;
  }
  static disconnect() { super.disconnect(); }
}
