"use client";
import { BiUser } from "react-icons/bi";


export interface ClientsTablesProps {
  isShow?: boolean;
  order: any
  setClientActive: (client: number)=>void;
  clientActive: number;
  isLoading?: boolean;

}

export function ClientsTables(props: ClientsTablesProps) {
  const { isShow, order, setClientActive, clientActive, isLoading } = props;

        if (!isShow) return <></>


        const listItems = order?.attributes && JSON.parse(order?.attributes.clients)?.map((record: any) => {
            return (
                <div key={record} className="m-2 clickeable" onClick={()=>setClientActive(record)}>
                    <div className="rounded-md drop-shadow-lg">
                        <div className="w-full flex justify-center">
                        <BiUser size={48} className={`${clientActive == record ? 'text-lime-900' : 'text-red-900'}`} />
                        </div>
                        <p className={`w-full content-center text-center rounded-b-md overflow-hidden uppercase text-xs text-black font-medium p-1 ${clientActive == record ? 'bg-lime-300' : 'bg-red-300'}`} 
                           style={{ maxWidth: '146px',  wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                            Cliente {record}
                        </p>
                    </div>
                </div>
            )
        });
        
        const clientMock = ()=>{
            return (
                <div  className="m-2 animate-pulse">
                    <div className="rounded-md drop-shadow-lg">
                        <div className="w-full flex justify-center">
                        <BiUser size={48} className='text-red-900' />
                        </div>
                        <p className="w-full content-center text-center rounded-b-md overflow-hidden uppercase text-xs text-black font-medium p-1 bg-red-300" 
                           style={{ maxWidth: '146px',  wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                            Cargando...
                        </p>
                    </div>
                </div>
            )
        }
  

        const clientAlone = ()=>{
            return (
                <div className="m-2" >
                    <div className="rounded-md drop-shadow-lg">
                        <div className="w-full flex justify-center">
                        <BiUser size={48} className='text-lime-900' />
                        </div>
                        <p className={`w-full content-center text-center rounded-b-md overflow-hidden uppercase text-xs text-black font-medium p-1 bg-lime-300`}
                           style={{ maxWidth: '146px',  wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                            Cliente 1
                        </p>
                    </div>
                </div>
            )
        }
      
      return (
        <div className="border-b-2 border-slate-500">
            <div>
                <div className="flex flex-wrap justify-center">
                { isLoading ? clientMock() : listItems ? listItems : clientAlone() }
                </div>
            </div>
        </div>
  );

}
