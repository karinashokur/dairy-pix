import logoDropbox from '../assets/dropbox.svg';
import logoGoogleDrive from '../assets/google-drive.svg';
import logoOneDrive from '../assets/onedrive.svg';
enum SupportedClouds {
  Dropbox,
  OneDrive,
  GoogleDrive
}
export const CloudsMeta: {[key: number]: {name: string, logo: string}} = {
  [SupportedClouds.Dropbox]: { name: 'Dropbox', logo: logoDropbox },
  [SupportedClouds.OneDrive]: { name: 'OneDrive', logo: logoOneDrive },
  [SupportedClouds.GoogleDrive]: { name: 'Google Drive', logo: logoGoogleDrive },
};
export default SupportedClouds;
