'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { DateRange } from "@/components/form/date-range"
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from 'luxon';
import { HistoriesByUserTable } from "@/components/histories-components/histories-by-user-table";
import { loadData } from "@/utils/functions";
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { LinksList } from "@/components/common/links-list";
import { useDateUrlConstructor } from "@/hooks/useDateUrlConstructor";


export default function Page() {
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([] as any);
  const [isSending, setIsSending] = useState(false);
  const { register, watch } = useForm();
  const { links, addLink} = AddNewDownloadLink()
  const { url, constructor } = useDateUrlConstructor()


  useEffect(() => {
      (async () => setUsers(await loadData(`register`)))();
  }, []);



    const handlegetSales = async (data: any) => {
      data.userId = watch("userId")
        try {
          setIsSending(true);
          constructor(data, 'histories/by-user')
          const response = await loadData(url);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setSales(response);
            if(response.data.length > 0) addLink(links, data, 'excel/by-user/', [{name: "userId", value: data.userId}]);
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
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="LISTADO DE VENTAS POR USUARIO" />

        <HistoriesByUserTable records={sales} isLoading={isSending} />

        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR FECHA" />
          <div className="flex flex-wrap m-4 shadow-lg border-2 rounded-md mb-8">
              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="userId" className={style.inputLabel}> Seleccione el usuario </label>
                    <select defaultValue={1} id="userId" {...register("userId")} className={style.input}
                        >
                        {users?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.name}</option>
                          );
                        })}
                    </select>
                </div>
            </div>

        <DateRange onSubmit={handlegetSales} />
        <LinksList links={links} />
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
