export default interface Cloud {
  save: (key: string, value: string) => void;
  load: (key: string) => string | null;
}
