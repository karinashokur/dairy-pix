export default abstract class CloudStorage {
  abstract init: () => void;
  abstract save: (filename: string, value: string) => Promise<void>;
  abstract load: (filename: string) => Promise<string | null>;
  abstract isPopulated: () => Promise<boolean>;
  abstract disconnect: () => Promise<void>;
}
