export default interface Cloud {
  save: (key: string, value: string) => Promise<void>;
  load: (key: string) => Promise<string | null>;
  disconnect?: () => Promise<void>;
}
