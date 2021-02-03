import StorageHandler from './StorageHandler';
import IYear from '../types/year';
import IDay from '../types/day';
export default abstract class StorageHandlerYear {
  static data: {[key: number]: IYear} = [];
  static async loadYear(year: number): Promise<void> { 
    if (this.data[year]) return;
    const response = await StorageHandler.load(year.toString());
    if (response) {
      this.data[year] = JSON.parse(response);
    }
  }
  static async saveYear(year: number): Promise<void> {
    return StorageHandler.save(year.toString(), JSON.stringify(this.data[year]));
  }
  static getDay(date: Date): IDay | null {
    const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
    if (!this.data[year] || !this.data[year][month] || !this.data[year][month][day]) return null;
    return this.data[year][month][day];
  }
  static setDay(date: Date, values: IDay): void {
    const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
    if (!this.data[year]) this.data[year] = {};
    if (!this.data[year][month]) this.data[year][month] = {};
    this.data[year][month][day] = values;
  }
}
