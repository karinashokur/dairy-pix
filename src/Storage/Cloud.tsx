export default abstract class Cloud {
  abstract init: () => void;
  abstract save: (filename: string, value: string) => Promise<void>;
  abstract load: (filename: string) => Promise<string | null>;
  abstract disconnect: () => Promise<void>;
}
