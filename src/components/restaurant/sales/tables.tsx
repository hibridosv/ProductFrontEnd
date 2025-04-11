"use client";
import { useContext, useEffect, useState } from "react";
import { getData } from "@/services/resources";
import Image from "next/image";
import { getConfigStatus } from "@/utils/functions";
import { getTenant } from "@/services/oauth";
import { ConfigContext } from "@/contexts/config-context";
import useReverb from "@/hooks/useReverb";
import { OrderTime } from "./tables-time";


export interface TablesProps {
  isShow?: boolean;
  setSelectedTable: (table: string)=> void
  order: any
  handleChangeOrder: (order: string)=>void  
}

export function Tables(props: TablesProps) {
  const { isShow, setSelectedTable, order, handleChangeOrder} = props;
  const [ tables, setTables ] = useState([] as any)
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);
  const { config } = useContext(ConfigContext);
  const tenant = getTenant();
  let pusherEvent = useReverb(`${tenant}-channel-orders`, 'PusherOrderEvent', getConfigStatus("realtime-orders", config)).random;


  const handleClickSelectTable = (option: any) => {
    if (option.status == 1) {
        handleChangeOrder(option.ticket_order_id)
    }
    setSelectedTable(option.id);
  };


  // Función que maneja el click y actualiza el estado con las tablas
  const handleLocationClick = (tables: any) => {
    setSelectedTables(tables);
  };

  const loadTables = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`restaurant/tables?included=tables`);
      setTables(response);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      
      useEffect(() => {
        if (isShow) {
            (async () => { await loadTables() })();
        }
        // eslint-disable-next-line
      }, [isShow, pusherEvent]);

      useEffect(() => {
        const principalLocation = tables?.data && tables?.data?.find((location: any) => location.is_principal === 1);
        setSelectedTables(principalLocation ? principalLocation.tables : [])
        // eslint-disable-next-line
      }, [tables]);

      if (!isShow || order?.invoiceproducts) return <></>

        const listItems = selectedTables && selectedTables.map((record: any) => {
            return (
                <div key={record?.id} className="m-2 clickeable" onClick={()=>handleClickSelectTable(record)}>
                    <div className="rounded-md drop-shadow-lg relative">
                        <Image src="/img/table.jpg" alt="Mesa" width={146} height={146} className="rounded-t-md" />
                        <p className={`w-full content-center text-center rounded-b-md overflow-hidden uppercase text-xs text-black font-medium p-1 h-9 ${record.status == 0 ? 'bg-lime-300' : 'bg-red-300'}`} 
                           style={{ maxWidth: '146px',  wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                            {record?.name }
                        </p>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white text-gray-500">
                          <OrderTime record={record} isShow={record.status == 1} rowSearch="updated_at" />
                        </div>
                    </div>
                </div>
            )
        });
        
        
        const listZones = tables?.data && tables.data.map((record: any) => {
            return (<div key={record.id} className="w-full font-medium clickeable bg-slate-200 items-center text-center" onClick={() => handleLocationClick(record.tables)}>{record.name}</div>)
        });


          
      
      return (
        <div>
            <div>
                <div className="flex justify-around w-full h-7 shadow-md">
                  {listZones}
                </div>
            </div>
            <div>
                <div className="flex flex-wrap justify-center">
                  {listItems }
                </div>
            </div>
        </div>
  );

}
