import Moods from '../types/moods';
import IYear from '../types/year';
const generateRandomData = () => {
  const data: IYear = {};
  if (localStorage.getItem('randomData')) { 
    for (let m = 0; m < 12; m++) {
      data[m] = {};
      for (let d = 1; d < 32; d++) {
        data[m][d] = { mood: Math.floor(Math.random() * Moods.length) };
      }
    }
  }
  return data;
};
export default generateRandomData;
