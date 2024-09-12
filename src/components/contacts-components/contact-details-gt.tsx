"use client";
import { BiCheckCircle } from "react-icons/bi";
import { style } from "../../theme";
import { formatDuiWithAll } from "@/utils/functions";


export interface ContactDetailsGTProps {
  record?: any;
}

export function ContactDetailsGT(props: ContactDetailsGTProps) {
  const { record } = props;


  return (
        <div className="mx-4">
              <div className="flex flex-wrap -mx-3">
            <div className="w-full md:w-full px-3 mb-2 flex justify-between">
                <div className="flex justify-between">
                    <span className="mt-1">{record?.is_client ? <BiCheckCircle color="green" /> : null} </span>
                    <span className="ml-2 font-medium">Cliente</span>
                </div>

                <div className="flex justify-between">
                    <span className="mt-1">{record?.is_provider ? <BiCheckCircle color="green" /> : null} </span>
                    <span className="ml-2 font-medium">Proveedor</span>
                </div>
            </div>

            <div className="w-full md:w-full px-3 mb-2 shadow-lg border-2">
                <div className={style.inputLabel}>Nombre completo *</div>
                <div> {record?.name} </div>
            </div>

            <div className="w-full md:w-1/2 px-3 mb-2  shadow-lg border-2">
                <div  className={style.inputLabel}>Identificaón Fiscal</div>
                <div> {formatDuiWithAll(record?.id_number)} </div>
            </div> 

            {record?.phone && <div className="w-full md:w-1/2 px-3 mb-2  shadow-lg border-2">
                <div  className={style.inputLabel}>Tel&eacute;fono</div>
                <div> {record?.phone} </div>
            </div> }

            {record?.address && <div className="w-full md:w-full px-3 mb-2  shadow-lg border-2">
                <div className={style.inputLabel}>Dirección</div>
                <div> {record?.address} </div>
            </div> }

            {record?.email && <div className="w-full md:w-full px-3 mb-2  shadow-lg border-2">
                <div  className={style.inputLabel}>Email</div>
                <div> {record?.email} </div>
            </div> }


           </div>

            <div className="mt-2">
                <div className="flex flex-wrap -mx-3">

                    {record?.taxpayer && <div className="w-full md:w-full px-3 mb-2  shadow-lg border-2">
                        <div  className={style.inputLabel}>Nombre de contacto</div>
                        <div> {record?.taxpayer} </div>
                    </div> }
                
                    {record?.taxpayer_type && <div className="w-full md:w-full px-3 mb-2  shadow-lg border-2">
                    <div className={style.inputLabel}>Tipo de contribuyente</div>
                        <div> {record?.taxpayer_type == 1 ? "CONTRIBUYENTE" : "GRAN CONTRIBUYENTE"} </div>
                    </div> }

                </div>
            </div>
        </div>
  );
}
