import { Dropbox } from 'dropbox';
import queryString from 'query-string';
import Cloud from './Cloud';
export default abstract class CloudDropbox extends Cloud {
  static api = new Dropbox({ clientId: 'h27trbgu4io3fg8', fetch });
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
      window.location.href = this.api.getAuthenticationUrl(this.appUrl);
    } else {
      this.api.setAccessToken(this.token);
      localStorage.setItem('storageToken', this.token);
    }
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
    const response = await CloudDropbox.api.filesDownload({ path: `/${filename}` });
    const reader = new FileReader();
    return new Promise(resolve => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText((response as any).fileBlob);
    });
  }
  static async disconnect(): Promise<void> {
    if (!this.token) return;
    await this.api.authTokenRevoke();
    localStorage.removeItem('storageToken');
    this.token = null;
  }
  static getTokenFromUrl(): string | null {
    const query = queryString.parse(window.location.hash);
    return query.access_token ? query.access_token as string : null;
  }
}
