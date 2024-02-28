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
      case 1: return "cyan"
      case 2: return "red"
      case 3: return "green"
      case 4: return "blue"
      default: return "slate"
    }
  }

    return(
        <div className={`mx-4 border-2 border-slate-600 shadow-md shadow-${selectTheme(records.theme)}-500 rounded-md w-full`}>
            <div className="w-full text-center">{records.title}</div>
            <div className="w-full text-center text-2xl my-2 font-bold">{records.isMoney ? `$ ${records.value}` : records.value}</div>
        </div>
    );
}
