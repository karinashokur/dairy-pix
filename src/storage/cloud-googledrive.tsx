import CloudAuthenticationError from '../errors/cloudAuthenticationError';
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
    if (!response.ok) throw JSON.parse(await response.text());
  }
  static async load(filename: string): Promise<string | null> {
    if (!this.token) this.init();
    const fileId = await this.exists(filename);
    if (!fileId) return null;
    const file = await fetch(`${this.api.readUrl}/${fileId}?alt=media`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    if (file.status === 401) throw new CloudAuthenticationError();
    if (!file.ok) throw JSON.parse(await file.text());
    return file.text();
  }
  static async exists(filename: string): Promise<string | false> {
    if (!this.token) this.init();
    const query = filename !== '*' ? `&q=${encodeURI(`name='${filename}'`)}` : '';
    const response = await fetch(`${this.api.readUrl}?spaces=AppDataFolder${query}`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    const body = JSON.parse(await response.text());
    if (response.status === 401) throw new CloudAuthenticationError();
    if (!response.ok) throw body;
    if (body.files.length === 0) return false;
    return body.files[0].id;
  }
  static async isPopulated(): Promise<boolean> {
    if (!this.token) this.init();
    return !!await this.exists('*');
  }
  static disconnect() { super.disconnect(); }
}
