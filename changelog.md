1.1.0 - TBD
------------------
- **Issue** #14: A notification will be shown whenever a newer version is available, allowing to update immediately instead of on next session
- **Issue** #17: Added labels to the grid, that show the months and days. Additionally, the current day is now highlighted until a mood is selected
- The color of each mood is now displayed in the select list, to add some visual aid when selecting the mood on a day
1.0.2 - 13.11.2019
------------------
- The current version number is now displayed in the menu
- Added some manual breadcrumbs for error reports
- Slightly improved the identification of UI elements that are mentioned in auto generated breadcrumbs of error reports
- Error reports now include a user id that gets randomly generated on each new session. This is used to distinguish errors from different user sessions
1.0.1 - 07.11.2019
------------------
- Fixed an issue where saving changes to an existing year failed when being connected to Google Drive
- The correct environment name is now used during error reporting and for version logging
1.0.0 - 14.10.2019
------------------
Initial Release
- Serverless single page web application
- A fully responsive and modern design
- Select a mood out of 11 pre-defined combinations, for each day of the year
- Add a tweet sized comment (140 characters) to summarize your day
- Save your diary data on [Dropbox](https://dropbox.com), [OneDrive](https://onedrive.live.com), [Google Drive](https://drive.google.com), or simply in your browsers storage \*
- Optionally, you can enable AES-256-CBC encryption, to protect your privacy and lock your diary
<sup>* Browser storage is limited and may vary between browsers - [more about space usage](https://gitlab.com/eggerd/pixel-diary/wikis#space-usage)</sup>
