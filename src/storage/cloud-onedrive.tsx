import CloudStorage from './cloud';
export default abstract class CloudOneDrive extends CloudStorage {
  static api = {
    id: '3705eba3-4eba-4e77-9d94-2ec3e747c9f7',
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
    if (!response.ok) throw JSON.parse(await response.text());
  }
  static async load(filename: string): Promise<string | null> {
    if (!this.token) this.init();
    const response = await fetch(`${this.api.url}:/${filename}:/content`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    if (!response.ok && response.status !== 404) throw JSON.parse(await response.text());
    return response.text();
  }
  static async isPopulated(): Promise<boolean> {
    if (!this.token) this.init();
    const response = await fetch(`${this.api.url}/children`, {
      headers: [['Authorization', `Bearer ${this.token}`]],
    });
    const body = JSON.parse(await response.text());
    if (!response.ok) throw body;
    if (body.value.length > 0) return true;
    return false;
  }
  static async disconnect() { super.disconnect(); }
}
