'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { DateRange } from "@/components/form/date-range"
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from 'luxon';
import { loadData } from "@/utils/functions";
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { LinksList } from "@/components/common/links-list";
import { TransfersReceiveTable } from "@/components/transfers-components/transfers-receive-table";
import { Option, RadioButton } from "@/components/radio-button/radio-button";
import { TransferShowModal } from "@/components/transfers-components/transfer-show-modal";


export default function Page() {
  const [transfers, setTransfers] = useState([]);
  const [tenants, setTenants] = useState([] as any);
  const [isSending, setIsSending] = useState(false);
  const { register, watch } = useForm();
  const { links, addLink} = AddNewDownloadLink()
  const [isShowTransferModal, setIsShowTransferModal] = useState(false);
  const [isSelectTransfer, setIsSelectTransfer] = useState(false);
  const [isMessage, setIsMessage] = useState("");
  let optionsRadioButton: Option[] = [
    { id: 0, name: "Todos" },
    { id: 1, name: "Enviadas" },
    { id: 2, name: "Recibidas" },
  ];
  const [selectedOption, setSelectedOption] = useState<Option | null>(optionsRadioButton[0] ? optionsRadioButton[0] : null);


  useEffect(() => {
      (async () => setTenants(await loadData(`linkedsystems`)))();
  }, []);


    const handlegetSales = async (data: any) => {
      data.tenantId = selectedOption?.id == 0 ? 0 : watch("tenantId")
      data.show = selectedOption?.id
        try {
          setIsSending(true);
          const response = await postData(`histories/transfers`, "POST", data);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setTransfers(response);
            setIsMessage(`Mostrando: ${selectedOption?.name}`)
            if(response.data.length > 0) addLink(links, data, 'excel/transfers/', 
            [{name: "tenantId", value: data.tenantId}, {name: "show", value: selectedOption?.id}]);
          } else {
            toast.error("Faltan algunos datos importantes!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } finally {
          setIsSending(false);
        }
      };

      useEffect(() => {
        (async () => { 
          const actualDate = DateTime.now();
          const formatedDate = actualDate.toFormat('yyyy-MM-dd');
          await handlegetSales({option: "1", initialDate: `${formatedDate} 00:00:00`})
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    const showTransfer = (transfer: any)=>{
        setIsShowTransferModal(true)
        setIsSelectTransfer(transfer)
      }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="LISTADO DE TRANSFERENCIAS" />

        <TransfersReceiveTable records={transfers} showTransfer={showTransfer} />

        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR FECHA" />
        <RadioButton options={optionsRadioButton} onSelectionChange={setSelectedOption} />
        { selectedOption?.id != 0 ?
          <div className="flex flex-wrap m-4 shadow-lg border-2 rounded-md mb-8">
              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="tenantId" className={style.inputLabel}> Seleccione { selectedOption?.id == 2 ? "Origen" : "Destino"}</label>
                    <select defaultValue={0} id="tenantId" {...register("tenantId")} className={style.input} >
                    <option value={0}> Todos</option>
                        {tenants?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.to.id}> {value.to.name}</option>
                          );
                        })}
                    </select>
                </div>
            </div> :
            <div className="border my-5 border-spacing-3 border-spacing-x-2 border-teal-500 border-spacing-y-2"></div>
            }

        <DateRange onSubmit={handlegetSales} />
        { isMessage &&
          <div className="text-red-600 flex justify-center w-full font-semibold">{isMessage}</div>            
        }
        <LinksList links={links} />
        </div>
        <TransferShowModal isShow={isShowTransferModal} onClose={()=>setIsShowTransferModal(false)} transfer={isSelectTransfer} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
