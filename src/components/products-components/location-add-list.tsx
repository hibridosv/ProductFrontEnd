"use client";
import { useState, useEffect } from "react";
import { getData, postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';

import { Loading } from "../loading/loading";
import { Button, Preset } from "../button/button";
import { ListLocations } from "./list-locations";
import { AddLocationsModal } from "../modals/add-locations-modal";
import { DeleteModal } from "../modals/delete-modal";
import { ViewTitle } from "../view-title/view-title";

export interface LocationAddListProps {
  option: number;
  name: string;
}

export function LocationAddList(props: LocationAddListProps) {
  const { option, name } = props;
  const [ locations, setLocations ] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [showModalLocations, setShowModalLocations] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [locationSelect, setlocationSelect] = useState("");

  const loadlocations = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`locations`);
      setLocations(response.data);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
};

useEffect(() => {
    if (option === 4 && showModalLocations === false) {
        (async () => { await loadlocations() })();
    }
    // eslint-disable-next-line
}, [option, showModalLocations]);

const handleDelete = (iden: string) => {
  setlocationSelect(iden);
  setShowDeleteModal(true);
}

const deleteLocation = async (iden: any) => {
  try {
    const response = await postData(`locations/${locationSelect}`, 'DELETE');
    if (response.type === "successful") {
      toast.success( "Ubicación eliminada correctamente");
      await loadlocations()
    } else {
      toast.error("Ha Ocurrido un Error!");
    }
    setlocationSelect("");
    setShowDeleteModal(false);
  } catch (error) {
    console.error(error);
    toast.error("Ha Ocurrido un Error!");
  } 
}


if (option != 4) return null

return (<>
  <div className="flex justify-between">
    <ViewTitle text={name} />
    <span className=" m-4 text-2xl "><Button preset={Preset.add} text="AGREGAR" onClick={()=>setShowModalLocations(true)} /></span>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
      <div className="col-span-3">
        { isLoading ? <Loading /> : <ListLocations locations={locations} onDelete={handleDelete} /> }
      </div>
       <AddLocationsModal isShow={showModalLocations} onClose={() => setShowModalLocations(false)} />

        <DeleteModal isShow={showDeleteModal}
        text="¿Está seguro de eliminar esta categoría?"
        onDelete={deleteLocation} 
        onClose={()=>setShowDeleteModal(false)} />
  <Toaster position="top-right" reverseOrder={false} />
  </div>
</>);
}
