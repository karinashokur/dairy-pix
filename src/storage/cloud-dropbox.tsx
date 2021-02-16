import { Dropbox } from 'dropbox';
import { isString } from 'util';
import CloudStorage from './cloud';
export default abstract class CloudDropbox extends CloudStorage {
  static api = new Dropbox({ clientId: 'h27trbgu4io3fg8', fetch });
  static init(): void {
    super.init(this.api.getAuthenticationUrl(this.appUrl));
    if (this.token) this.api.setAccessToken(this.token);
  }
  static async save(filename: string, value: string): Promise<void> {
    if (!this.token) this.init();
    await CloudDropbox.api.filesUpload({
      path: `/${filename}`,
      contents: value,
      mode: { '.tag': 'overwrite' },
    });
  }
  static async load(filename: string): Promise<string | null> {
    if (!this.token) this.init();
    try {
      const response = await CloudDropbox.api.filesDownload({ path: `/${filename}` });
      const reader = new FileReader();
      return new Promise(resolve => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsText((response as any).fileBlob);
      });
    } catch (e) {
      if (isString(e.error) && e.error.includes('path/not_found')) return null;
      throw e;
    }
  }
  static async isPopulated(): Promise<boolean> {
    if (!this.token) this.init();
    const folder = await CloudDropbox.api.filesListFolder({ path: '' });
    if (folder.entries.length > 0) return true;
    return false;
  }
  static async disconnect(): Promise<void> {
    if (!this.token) return;
    await this.api.authTokenRevoke();
    super.disconnect();
  }
}
