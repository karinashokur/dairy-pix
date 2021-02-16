import queryString from 'query-string';
export default abstract class CloudStorage {
  abstract init: () => void;
  abstract save: (filename: string, value: string) => Promise<void>;
  abstract load: (filename: string) => Promise<string | null>;
  abstract isPopulated: () => Promise<boolean>;
  abstract disconnect: () => Promise<void>;
  static token: string | null = null;
  static appUrl = window.location.origin + window.location.pathname;
  static init(oauth2Url: string): void {
    if (this.token) return;
    if (localStorage.getItem('storageToken')) {
      this.token = localStorage.getItem('storageToken');
    }
    if (!this.token && this.getTokenFromUrl()) {
      this.token = this.getTokenFromUrl();
      window.history.replaceState(null, 'Cloud Connected', this.appUrl); 
    }
    if (!this.token) {
      window.location.href = oauth2Url;
    } else {
      localStorage.setItem('storageToken', this.token);
    }
  }
  static getTokenFromUrl(): string | null {
    const query = queryString.parse(window.location.hash);
    return query.access_token ? query.access_token as string : null;
  }
  static disconnect(): void {
    if (!this.token) return;
    localStorage.removeItem('storageToken');
    this.token = null;
  }
}
