import logoDropbox from '../assets/dropbox.svg';
import logoGoogleDrive from '../assets/google-drive.svg';
import logoOneDrive from '../assets/onedrive.svg';
enum SupportedClouds {
  Dropbox,
  OneDrive,
  GoogleDrive
}
export const CloudsMeta: {[key: number]: {name: string, logo: string, configured: boolean}} = {
  [SupportedClouds.Dropbox]: {
    name: 'Dropbox',
    logo: logoDropbox,
    configured: !!process.env.REACT_APP_CLOUD_DROPBOX,
  },
  [SupportedClouds.OneDrive]: {
    name: 'OneDrive',
    logo: logoOneDrive,
    configured: !!process.env.REACT_APP_CLOUD_ONEDRIVE,
  },
  [SupportedClouds.GoogleDrive]: {
    name: 'Google Drive',
    logo: logoGoogleDrive,
    configured: !!process.env.REACT_APP_CLOUD_GOOGLE_DRIVE,
  },
};
export default SupportedClouds;
