import {DateInfo, DateType, Formatter} from "@/types";
import {DATE_FORMAT, HOLIDAYS, MENDINGS, TIME_FORMAT} from "@/constanse";
import {format} from "@/formatter";

export function normalizeFormatter(formatter: string | DateType | Formatter): Formatter {
    if (typeof formatter === 'function') return formatter
    if (formatter === 'date') formatter = DATE_FORMAT
    if (formatter === 'datetime') formatter = TIME_FORMAT
    return (dateInfo: DateInfo) => {
        const {
            year,
            month,
            date,
            day,
            hour,
            minute,
            second,
            millisecond
        } = dateInfo
        return (formatter as string).replace(/(Y+)/, (match: string) => {
            return year.toString().padStart(4, '0').substring(0, match.length)
        }).replace(/(M+)/, (match: string) => {
            return month.toString().padStart(2, '0').substring(0, match.length)
        }).replace(/(D+)/, (match: string) => {
            return date.toString().padStart(2, '0').substring(0, match.length)
        }).replace(/(d+)/, (match: string) => {
            return day.toString().substring(0, match.length)
        }).replace(/(H+)/, (match: string) => {
            return hour.toString().padStart(2, '0').substring(0, match.length)
        }).replace(/(m+)/, (match: string) => {
            return minute.toString().padStart(2, '0').substring(0, match.length)
        }).replace(/(s+)/, (match: string) => {
            return second.toString().padStart(2, '0').substring(0, match.length)
        }).replace(/(i+)/, (match: string) => {
            return millisecond.toString().padStart(3, '0').substring(0, match.length)
        })
    }
}

export function isDate(date: any): date is Date | string | number {
    return typeof date === 'string' || typeof date === 'number' || date instanceof Date
}

export function isValidDate(date: any) {
    return isDate(date) && new Date(date).toString() !== 'Invalid Date'
}

export function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function getDaysInMonth(year: number, month: number) {
    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
}

/**
 * 获取昨天
 * @param cur {Date|string|number} 当前日期
 * @returns {Date}
 */
export function getLastDay(cur: Date | number | string = Date.now()) {
    if (!isValidDate(cur)) throw new Error('invalid date')
    const d = new Date(cur)
    d.setDate(d.getDate() - 1)
    return d
}

/**
 * 获取前天
 * @param cur {Date|string|number} 当前日期
 * @returns {Date}
 */
export function getPreDay(cur: Date | number | string = Date.now()) {
    if (!isValidDate(cur)) throw new Error('invalid date')
    const d = new Date(cur)
    d.setDate(d.getDate() - 2)
    return d
}

/**
 * 获取本周第一天
 * @param cur {Date|string|number} 当前日期
 * @returns {Date}
 */
export function getFirstDayOfWeek(cur: Date | number | string = Date.now()) {
    if (!isValidDate(cur)) throw new Error('invalid date')
    const d = new Date(cur)
    d.setDate(d.getDate() - d.getDay())
    return d
}

/**
 * 判断是否是工作日
 * @param date {Date|string|number}
 */
export function isWorkday(date:Date|string|number){
    if(!isValidDate(date)) throw new Error('invalid date')
    date=new Date(date)
    return date.getDay() !== 6 && date.getDay() !== 0
}

/**
 * 判断是否是节假日 *
 * @param date {Date|string|number}
 */
export function isHoliday(date:Date|string|number){
    if(!isValidDate(date)) throw new Error('invalid date')
    date=new Date(date)
    return date.getDay() === 6 || date.getDay() === 0
}

/**
 * 判断是否是法定工作日 *
 * @param date {Date|string|number}
 */
export function isLegalWorkday(date:Date|string|number){
    if(!isValidDate(date)) throw new Error('invalid date')
    if(isWorkday(date)) return !Object.keys(HOLIDAYS).includes(format(date, 'YYYY-MM-DD'))
    return Object.keys(MENDINGS).includes(format(date, 'YYYY-MM-DD'))
}

/**
 * 判断是否是法定节假日
 * @param date {Date|string|number}
 */
export function isLegalHoliday(date:Date|string|number){
    return !isLegalWorkday(date)
}

/**
 * 获取下个工作日 *
 * @param date
 */
export function getNextLegalWorkday(date:Date|string|number){
    if(!isValidDate(date)) throw new Error('invalid date')
    const d = new Date(date)
    d.setDate(d.getDate() + 1)
    if(isLegalWorkday(d)) return d
    return getNextLegalWorkday(d)
}

