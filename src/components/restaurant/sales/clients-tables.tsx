"use client";
import { BiUser } from "react-icons/bi";


export interface ClientsTablesProps {
  isShow?: boolean;
  order: any
  setClientActive: (client: number)=>void;
  clientActive: number;
}

export function ClientsTables(props: ClientsTablesProps) {
  const { isShow, order, setClientActive, clientActive } = props;

        if (!isShow) return <></>

        const listItems = Array.from({ length: order?.attributes?.clients_quantity || 1 }).map((_, index) => {
            return (
                <div key={index} className="m-2 clickeable" onClick={()=>setClientActive(index + 1)}>
                    <div className="rounded-md drop-shadow-lg">
                        <div className="w-full flex justify-center">
                        <BiUser size={48} className={`${clientActive == index + 1 ? 'text-lime-900' : 'text-red-900'}`} />
                        </div>
                        <p className={`w-full content-center text-center rounded-b-md overflow-hidden uppercase text-xs text-black font-medium p-1 ${clientActive == index + 1 ? 'bg-lime-300' : 'bg-red-300'}`} 
                           style={{ maxWidth: '146px',  wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                            Cliente {index + 1}
                        </p>
                    </div>
                </div>
            )
        });
        
  
      
      return (
        <div className="border-b-2 border-slate-500">
            <div>
                <div className="flex flex-wrap justify-center">
                { listItems }
                </div>
            </div>
        </div>
  );

}
