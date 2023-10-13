import {isValidDate, normalizeFormatter} from "@/utils";
import {DateInfo, DateType, Formatter, MayBeArr} from "@/types";

type StrArr<T>=T extends [Date|string|number,...infer R]?[string,...StrArr<R>]:any
export function format<T extends MayBeArr<Date|string|number>>(date:T,template:string):T extends any[]?StrArr<T>:string
/**
 * 将传入的日期数组格式化为日期字符串或时间日期字符串，并返回
 * @param dates {Date|string|number[]} 需要格式化的日期
 * @param type {DateType} 格式化类型
 */
export function format<T>(dates:T,type:DateType):StrArr<T>
/**
 * 将传入的日期格式化为日期字符串或时间日期字符串
 * @param date {Date|string|number} 需要格式化的日期
 * @param type {DateType} 格式化类型
 */
export function format(date:Date|string|number,type:DateType):string
/**
 * 将传入的日期通过格式化函数处理
 * @param date {Date|string|number} 需要格式化的日期
 * @param formatter {Formatter} 格式化函数
 */
export function format<T extends MayBeArr<Date|string|number>>(date:T,formatter:Formatter):T extends any[]?StrArr<T>:string
/**
 * 格式化日期
 * @param date {Date|string|number} 需要格式化的日期
 * @param formatter {DateType|Formatter|string} 格式化类型
 */
export function format<T extends MayBeArr<Date|string|number>>(date:T,formatter:DateType|Formatter|string):T extends any[]?StrArr<T>:string{
    const dateArr:(Date|string|number)[]=Array.isArray(date)?date:[date]
    if(!dateArr.every(isValidDate)) throw new Error('invalid date(s)')
    const formatFn=normalizeFormatter(formatter)
    const results=dateArr.map(date=>{
        const d=new Date(date)
        const dateInfo:DateInfo={
            year:d.getFullYear(),
            month:d.getMonth()+1,
            date:d.getDate(),
            day:d.getDay(),
            hour:d.getHours(),
            minute:d.getMinutes(),
            second:d.getSeconds(),
            millisecond:d.getMilliseconds()
        }
        return formatFn(dateInfo)
    })
    return Array.isArray(date)?results:results[0] as any
}
