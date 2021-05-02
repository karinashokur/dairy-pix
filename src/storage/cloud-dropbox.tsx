import { Dropbox } from 'dropbox';
import { isString } from 'util';
import { CloudAuthenticationError } from '../types/errors';
import SupportedClouds from '../types/supported-clouds';
import CloudStorage from './cloud';
export default abstract class CloudDropbox extends CloudStorage {
  static readonly variant = SupportedClouds.Dropbox;
  static readonly api = new Dropbox({ clientId: process.env.REACT_APP_CLOUD_DROPBOX, fetch });
  static init(): void {
    super.init(this.api.getAuthenticationUrl(this.appUrl));
    if (this.token) this.api.setAccessToken(this.token);
  }
  static async save(filename: string, value: string): Promise<void> {
    if (!this.token) this.init();
    try {
      await this.api.filesUpload({
        path: `/${filename}`,
        contents: value,
        mode: { '.tag': 'overwrite' },
      });
    } catch (e) {
      if (e.status && e.status === 401) throw new CloudAuthenticationError();
      if (e.error) throw new Error(e.error);
      throw e;
    }
  }
  static async load(filename: string): Promise<string | null> {
    if (!this.token) this.init();
    try {
      const response = await this.api.filesDownload({ path: `/${filename}` });
      const reader = new FileReader();
      return new Promise(resolve => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsText((response as any).fileBlob);
      });
    } catch (e) {
      if (e.status && e.status === 401) throw new CloudAuthenticationError();
      if (isString(e.error) && e.error.includes('path/not_found')) return null; 
      if (e.error) throw new Error(e.error);
      throw e;
    }
  }
  static async list(): Promise<string[]> {
    if (!this.token) this.init();
    const keys: string[] = [];
    (await this.api.filesListFolder({ path: '', limit: 2000 })).entries.forEach(e => keys.push(e.name));
    return keys;
  }
  static disconnect(): void {
    if (!this.token) return;
    this.api.authTokenRevoke().catch(() => {}); 
    super.disconnect();
  }
}
