
'use client'
import {  DownArrow, UpArrow } from "@/theme/svg";
import { Loading } from "../loading/loading";
import { numberToMoney } from "@/utils/functions";


interface CardDashBoardInfoProps {
    records?: any;
    isLoading?: boolean;
  }


export function CardDashBoardInfo(props: CardDashBoardInfoProps){
  const { records, isLoading } = props;

  if (!records || isLoading) return <Loading />

  const selectTheme = (theme: number): string =>{
    switch (theme) {
      case 1: return "bg-cyan-100"
      case 2: return "bg-red-100"
      case 3: return "bg-green-100"
      case 4: return "bg-blue-100"
      default: return "bg-slate-200"
    }
  }

    return(
        <div className={`p-5 shadow-neutral-600 shadow-lg rounded-md ${selectTheme(records.theme)}`}>
        <div className="text-base text-gray-700 ">{records.title}</div>
        <div className="flex items-center pt-1">
        <div className="text-2xl font-bold text-gray-900 ">
         {records.isMoney ? `$ ${records.value}` : records.value}
        </div>
        {records.percent > 0 && (
        <span
            className={`flex items-center px-2 py-0.5 mx-2 text-sm rounded-full ${ records.upward ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100" }`}>
            {records.upward ? UpArrow : DownArrow} <span>{records.percent}</span>
        </span>) }
        </div>
        </div>
    );
}
