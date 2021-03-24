import queryString from 'query-string';
import { CloudInitError } from '../types/errors';
import SupportedClouds from '../types/supported-clouds';
export default abstract class CloudStorage {
  abstract readonly variant: SupportedClouds;
  abstract init: () => void;
  abstract save: (filename: string, value: string) => Promise<void>;
  abstract load: (filename: string) => Promise<string | null>;
  abstract list: () => Promise<string[]>;
  abstract disconnect: () => void;
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
      if (localStorage.getItem('storagePending')) {
        console.warn('Failed to init cloud adapter: ', queryString.parse(window.location.hash));
        window.history.replaceState(null, '', this.appUrl); 
        localStorage.removeItem('storagePending');
        throw new CloudInitError();
      }
      localStorage.setItem('storagePending', 'true');
      window.location.href = oauth2Url; 
    } else {
      localStorage.setItem('storageToken', this.token);
      localStorage.removeItem('storagePending');
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
