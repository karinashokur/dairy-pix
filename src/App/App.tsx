import { AppBar, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography, CircularProgress } from '@material-ui/core';
import { BarChart, CloudUpload, MoreVert, Security, ZoomIn, CloudDone } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import gitlabLogo from '../assets/gitlab.svg';
import { IDay } from '../Day/Day';
import DayDetails from '../Day/Details/Details';
import generateRandomData from '../helper';
import StorageHandler, { SupportedClouds } from '../Storage/StorageHandler';
import Year, { IYear } from '../Year/Year';
import './App.scss';
interface AppProps {
  name: string;
  repositoryUrl: string
}
const App: React.FC<AppProps> = ({ name, repositoryUrl }) => {
  const storage: StorageHandler = new StorageHandler();
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<{[key: number]: IYear}>({ 2019: generateRandomData() });
  const [details, setDetails] = useState<{date: Date, values: IDay}>();
  const [dotMenuAnchor, setDotMenuAnchor] = useState<HTMLElement | null>(null);
  const [cloudLoading, setCloudLoading] = useState<boolean>(false);
  const saveYear = async (year: number) => {
    if (years[year]) {
      setCloudLoading(true);
      await storage.save(year.toString(), JSON.stringify(years[year])); 
      setCloudLoading(false);
    }
  };
  const loadYear = async (year: number) => {
    const updatedYears = { ...years };
    try {
      setCloudLoading(true);
      const data = await storage.load(year.toString());
      if (data) {
        updatedYears[year] = JSON.parse(data); 
        setYears(updatedYears);
      }
      setCloudLoading(false);
    } catch (e) {
    }
  };
  const handleDayDetails = (values?: IDay): void => {
    if (!details) { return; }
    if (values) {
      const year = details.date.getFullYear();
      const month = details.date.getMonth();
      const day = details.date.getDate();
      const newYears = { ...years };
      if (!newYears[year]) { newYears[year] = {}; }
      if (!newYears[year][month]) { newYears[year][month] = {}; }
      newYears[year][month][day] = values;
      setYears(newYears);
      saveYear(year);
    }
    setDetails(undefined);
  };
  useEffect(() => {
    loadYear(new Date().getFullYear());
  }, []); 
  return (
    <div className="diary">
      <AppBar className="appbar" position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" className="appbar-title">{name}</Typography>
          {cloudLoading && <CircularProgress className="cloud-loading" color="secondary" size={24} />}
          {!cloudLoading && !storage.connected() && (
            <Tooltip title="Save in Cloud">
              <IconButton color="inherit" onClick={() => storage.connectCloud(SupportedClouds.Dropbox)}><CloudUpload /></IconButton>
            </Tooltip>
          )}
          {!cloudLoading && storage.connected() && (
            <IconButton color="inherit"><CloudDone /></IconButton>
          )}
          <IconButton
            color="inherit"
            onClick={
              (event: React.MouseEvent<HTMLButtonElement>) => setDotMenuAnchor(event.currentTarget)
            }
          >
            <MoreVert />
          </IconButton>
          <Menu
            className="dot-menu"
            anchorEl={dotMenuAnchor}
            keepMounted
            open={Boolean(dotMenuAnchor)}
            onClose={() => setDotMenuAnchor(null)}
          >
            <MenuItem>
              <ZoomIn />
              <span>Zoom</span>
            </MenuItem>
            <MenuItem>
              <BarChart />
              <span>Statistics</span>
            </MenuItem>
            <MenuItem>
              <Security />
              <span>Privacy</span>
            </MenuItem>
            <MenuItem onClick={() => window.open(repositoryUrl, '_blank')}>
              <div className="gitlab-icon">
                <img src={gitlabLogo} alt="Tanuki" />
              </div>
              <span>View on GitLab</span>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Year
        key={currentYear}
        year={currentYear}
        months={years[currentYear] ? years[currentYear] : {}}
        onClickDay={(year, month, day) => setDetails({
          date: new Date(year, month, day),
          values: years[year][month] && years[year][month][day] ? years[year][month][day] : {},
        })}
      />
      {details
        && <DayDetails date={details.date} values={details.values} onClose={handleDayDetails} />
      }
    </div>
  );
};
export default App;
