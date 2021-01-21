import { Dropbox } from 'dropbox';
import queryString from 'query-string';
import Cloud from './Cloud';
export default class CloudDropbox implements Cloud {
  private dbx = new Dropbox({ clientId: 'h27trbgu4io3fg8' });
  private token: string | null = null;
  private appUrl = window.location.origin + window.location.pathname;
  constructor() {
    if (localStorage.getItem('storageToken')) {
      this.token = localStorage.getItem('storageToken');
    }
    if (!this.token && this.getTokenFromUrl()) {
      this.token = this.getTokenFromUrl();
      window.history.replaceState(null, 'Cloud Connected', this.appUrl);
    }
    if (!this.token) {
      window.location.href = this.dbx.getAuthenticationUrl(this.appUrl);
    } else {
      console.log('token', this.token); 
      this.dbx.setAccessToken(this.token);
      localStorage.setItem('storageToken', this.token);
    }
  }
  async save(key: string, value: string): Promise<void> {
    await this.dbx.filesUpload({
      path: `/${key}`,
      contents: value,
      mode: { '.tag': 'overwrite' },
    });
  }
  async load(key: string): Promise<string | null> {
    const response = await this.dbx.filesDownload({ path: `/${key}` });
    const reader = new FileReader();
    return new Promise(resolve => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText((response as any).fileBlob);
    });
  }
  private getTokenFromUrl(): string | null { 
    const query = queryString.parse(window.location.hash);
    return query.access_token ? query.access_token as string : null;
  }
}
