
'use client'

import { useEffect, useState } from "react";
import { CardDashBoardInfo } from "./card-dashboard-info";
import { getData } from "@/services/resources";
import { Loading } from "../loading/loading";

interface PrincipalInfoProps {
    records?: any;
  }


export function PrincipalInfo(props: PrincipalInfoProps){
//   const { records } = props;
const [isLoading, setIsLoading] = useState(false);
const [dataOfCards, setDataOfCards] = useState([]) as any;


const loadDataOFCards = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`dashboard`);
      setDataOfCards(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
        (async () => await loadDataOFCards() )()
    // eslint-disable-next-line
  }, []);

  if (!dataOfCards) return <Loading />


    return(
        <div className="flex justify-center bg-white dark:bg-gray-900">
            <div className="container  px-5 mx-auto my-4">
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                {dataOfCards.map((record: any, index: any) => (
                    <div key={index}>
                        <CardDashBoardInfo records={record} isLoading={isLoading} />
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}
