'use client'
import {  DownArrow, UpArrow } from "@/theme/svg";
import { Loading } from "../loading/loading";
import { numberToMoney } from "@/utils/functions";


interface CardDashBoardProps {
    records?: any;
    isLoading?: boolean;
  }


export function CardDashBoard(props: CardDashBoardProps){
  const { records, isLoading } = props;

  if (!records || isLoading) return <Loading />

  const selectTheme = (theme: number): string =>{
    switch (theme) {
      case 1: return "shadow-cyan-500"
      case 2: return "shadow-red-500"
      case 3: return "shadow-green-500"
      case 4: return "shadow-blue-500"
      default: return "shadow-slate-500"
    }
  }

    return(
        <div className={`mx-4 border-2 border-slate-600 shadow-md ${selectTheme(records.theme)} rounded-md w-full`}>
            <div className="w-full text-center">{records.title}</div>
            <div className="w-full text-center text-2xl my-2 font-bold">{records.isMoney ? `$ ${records.value}` : records.value}</div>
        </div>
    );
}
