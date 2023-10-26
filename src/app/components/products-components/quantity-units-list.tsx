"use client";
import { useState, useEffect } from "react";
import { getData, postData } from "@/services/resources";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loading } from "../loading/loading";
import { ToggleSwitch } from "flowbite-react";


export interface QuantityUnitListProps {
  option: number;
}

export function QuantityUnitList(props: QuantityUnitListProps) {
  const { option } = props;
  const [ units, setUnits ] = useState([])
  const [isLoading, setIsLoading] = useState(false);


  const loadQuantityUnits = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`quantityunits`);
      setUnits(response.data);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
};

useEffect(() => {
    if (option === 2) {
        (async () => { await loadQuantityUnits() })();
    }
    // eslint-disable-next-line
}, [option]);


const updateStatus = async (key : string, status : number) => {
    try {
        const response = await postData(`quantityunits/${key}`, 'PUT', {"status": status});
        setUnits(response.data);
        toast.success("Actualizado correctamente", { autoClose: 2000 });
    } 
    catch (error) {
        console.error(error);
        toast.error("Error al actualizar!", { autoClose: 2000 });
        }  
}

if (option != 2) return null
if(isLoading) return <Loading />

  return (
        <div className="mx-4">
             {units.map((item: any, index: any) => (
                <div className='grid grid-cols-12 border-y-2' key={index}>
                  <div className='col-span-10 m-3 ml-10 font-semibold'>{item.name}</div>
                    <div className='col-span-2 m-3'>
                        <ToggleSwitch
                        disabled={isLoading}
                        checked={item.status}
                        label={item.status ? 'Activo' : 'Inactivo'}
                        onChange={() => updateStatus(item.id, item.status===1?0:1)}
                      />
                  </div>
                </div>
            ))}
          <ToastContainer />
        </div>
  );
}
