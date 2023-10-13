export type DateType='date'|'datetime'
export type DateInfo={
    year:number
    month:number
    date:number
    day:number
    hour:number
    minute:number
    second:number
    millisecond:number
}
export type MayBeArr<T>=T|T[]
export type Formatter=(date:DateInfo)=>string
