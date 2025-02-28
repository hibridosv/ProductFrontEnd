"use client";
import { BiCheckCircle } from "react-icons/bi";
import { style } from "../../theme";
import { formatDateAsDMY } from "@/utils/date-formats";
import { formatDuiWithAll, getConfigStatus, getCountryNameByCode, getDepartmentNameById, getMunicipioNameById, loadData } from "@/utils/functions";
import { useContext, useEffect, useState } from "react";
import { Loading } from "../loading/loading";
import { ConfigContext } from "@/contexts/config-context";

export interface ContactDetailsSVProps {
  record?: any;
}

export function ContactDetailsSV(props: ContactDetailsSVProps) {
  const { record } = props;
  const [locations, setLocaltions] = useState({} as any);
  const [countries, setCountries] = useState({} as any);
  const { config } = useContext(ConfigContext);

  useEffect(() => {
    if (record) {
        const fetchData = async () => {
            const data = await loadData(`electronic/getlocations`);
            setLocaltions(data);
          };
        
          fetchData();
    }
  }, [setLocaltions, record]);

  useEffect(() => {
      const fetchData = async () => {
          if (getConfigStatus("contact-country", config)) {
              const response = await loadData(`electronic/getcountries`);
              setCountries(response);
            }
          };
      fetchData();
  }, [setCountries, config]);

if (!locations || !record) {
    return <Loading />
}

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

                <div className="flex justify-between">
                    <span className="mt-1">{record?.is_employee ? <BiCheckCircle color="green" /> : null} </span>
                    <span className="ml-2 font-medium">Repartidor</span>
                </div>

                <div className="flex justify-between">
                    <span className="mt-1">{record?.is_referred ? <BiCheckCircle color="green" /> : null} </span>
                    <span className="ml-2 font-medium">Referido</span>
                </div>
            </div>

            <div className="w-full md:w-full px-3 mb-2 shadow-lg border-2">
                <div className={style.inputLabel}>Nombre completo *</div>
                <div> {record?.name} </div>
            </div>

            { record?.code && <div className="w-full md:w-full px-3 mb-2 shadow-lg border-2">
                <div className={style.inputLabel}>Código</div>
                <div> {record?.code} </div>
            </div>
            }


            <div className="w-full md:w-1/2 px-3 mb-2  shadow-lg border-2">
                <div  className={style.inputLabel}>Numero de documento</div>
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

                            
            {record?.birthday && <div className="w-full md:w-full px-3 mb-2  shadow-lg border-2">
                <div className={style.inputLabel}> Fecha de nacimiento </div>
                <div> {formatDateAsDMY(record?.birthday)} </div>
            </div> }


           </div>

            <div className="mt-2">
                <div className="flex flex-wrap -mx-3">

                    {record?.taxpayer && <div className="w-full md:w-full px-3 mb-2  shadow-lg border-2">
                        <div  className={style.inputLabel}>Nombre del contribuyente</div>
                        <div> {record?.taxpayer} </div>
                    </div> }
                
                    {record?.document && <div className="w-full md:w-1/2 px-3 mb-2  shadow-lg border-2">
                        <div className={style.inputLabel}>Documento</div>
                        <div> {formatDuiWithAll(record?.document)}  </div>
                    </div> }

                    {record?.register && <div className="w-full md:w-1/2 px-3 mb-2  shadow-lg border-2">
                        <div className={style.inputLabel}>Registro</div>
                        <div> {formatDuiWithAll(record?.register)}  </div>
                    </div> }

                    {record?.roar && <div className="w-full md:w-full px-3 mb-2  shadow-lg border-2">
                        <div className={style.inputLabel}>Giro</div>
                        <div> {record?.roar} </div>
                    </div> }

                    {record?.address_doc && <div className="w-full md:w-full px-3 mb-2  shadow-lg border-2">
                        <div className={style.inputLabel}>Dirección</div>
                        <div> {record?.address_doc} </div>
                    </div> }

                    {record?.departament_doc && <div className="w-full md:w-1/2 px-3 mb-2  shadow-lg border-2">
                        <div className={style.inputLabel}>Departamento</div>
                        <div> {getDepartmentNameById(record?.departament_doc, locations)} </div>
                    </div> }

                    {record?.town_doc && <div className="w-full md:w-1/2 px-3 mb-2  shadow-lg border-2">
                        <div className={style.inputLabel}>Municipio</div>
                        <div> {getMunicipioNameById(`${record?.departament_doc}${record?.town_doc}`, locations)} </div>
                    </div> }

                    {record?.taxpayer_type && <div className="w-full md:w-full px-3 mb-2  shadow-lg border-2">
                    <div className={style.inputLabel}>Tipo de contribuyente</div>
                        <div> {record?.taxpayer_type == 1 ? "CONTRIBUYENTE" : "GRAN CONTRIBUYENTE"} </div>
                    </div> }

                    { getConfigStatus("contact-country", config) && <div className="w-full md:w-1/2 px-3 mb-2  shadow-lg border-2">
                        <div className={style.inputLabel}>Pais</div>
                        <div> {getCountryNameByCode(`${record?.country}`, countries)} </div>
                    </div> }

                    {record?.is_credit_block == 1 && <div className="w-full md:w-full px-3 mb-2  shadow-lg border-2">
                    <div className={`${style.inputLabel} text-red-600`} >Cliente Bloqueado para creditos</div>
                    </div> }

                    {record?.excluded == 1 && <div className="w-full md:w-full px-3 mb-2  shadow-lg border-2">
                    <div className={`${style.inputLabel} text-red-600`} >Cliente Excuido de impuestos</div>
                    </div> }

                    {record?.employee_id && <div className="w-full px-3 mb-2  shadow-lg border-2">
                        <div className={style.inputLabel}>Vendedor Asignado</div>
                        <div> {record?.employee?.name} </div>
                    </div> }

                </div>
            </div>
        </div>
  );
}
