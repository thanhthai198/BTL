import moment from 'moment';
import { DATE_FORMAT, DATE_FORMAT_API } from 'variables';

export const timeAgo = (datetime: string | Date) => moment(datetime).fromNow();

export const currentTimestamp = (milisecond = true) =>
  milisecond ? moment().valueOf() : moment().unix();

export const getDate = (date: string | Date) => date && moment(date).format(DATE_FORMAT.vi);
export const getDateTime = (date: string | Date) => date && moment(date).format(DATE_FORMAT.vi);
export const getDateForApi = (date: string | Date) => moment(date).format(DATE_FORMAT_API);

export const getCurrentDate = () => moment().format('YYYY-MM-DD');
export const getCurrentMonth = () => moment().format('MM-YYYY');

export default moment;
