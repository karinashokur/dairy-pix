import { CloudAuthenticationError } from '../types/errors';
import SupportedClouds from '../types/supported-clouds';
import CloudStorage from './cloud';
export default abstract class CloudOneDrive extends CloudStorage {
  static readonly variant = SupportedClouds.OneDrive;
  static readonly api = {
    id: process.env.REACT_APP_CLOUD_ONEDRIVE,
    scopes: ['Files.ReadWrite.AppFolder'],
    url: 'https:
  };
  static init(): void {
    super.init(`https:      client_id=${this.api.id}&\
      response_type=token&\
      scope=${this.api.scopes.join(' ')}&\
      redirect_uri=${this.appUrl}`);
  }
  static async save(filename: string, value: string): Promise<void> {
    if (!this.token) this.init();
    const response = await fetch(`${this.api.url}:/${filename}:/content`, {
      method: 'PUT',
      headers: [['Authorization', `Bearer ${this.token}`]],
      body: value,
    });
    if (response.status === 401) throw new CloudAuthenticationError();
    if (!response.ok) throw new Error(JSON.parse(await response.text()));
  }
  static async load(filename: string): Promise<string | null> {
    if (!this.token) this.init();
    const response = await fetch(`${this.api.url}:/${filename}:/content`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    if (response.status === 401) throw new CloudAuthenticationError();
    if (!response.ok && response.status === 404) return null; 
    if (!response.ok) throw new Error(JSON.parse(await response.text()));
    return response.text();
  }
  static async list(): Promise<string[]> {
    if (!this.token) this.init();
    const response = await fetch(`${this.api.url}/children?$top=2000`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    const body = JSON.parse(await response.text());
    if (response.status === 401) throw new CloudAuthenticationError();
    if (!response.ok) throw new Error(body);
    const keys: string[] = [];
    body.value.forEach((v: {name: string}) => keys.push(v.name));
    return keys;
  }
  static disconnect() { super.disconnect(); }
}
