"use client";
import {  useContext, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

import { postData } from "@/services/resources";
import { style } from "../../theme";
import { Alert } from "../alert/alert";
import { PresetTheme } from "@/services/enums";
import { ContactDetails } from "./contact-details.";
import { formatDocument, formatDuiWithAll, formatNumberPhone, getConfigStatus, getCountryNameByCode, getDepartmentNameById, getMunicipioNameById, loadData } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";

export interface ContactAddGTModalProps {
  onClose: () => void;
  isShow: boolean;
  record?: any;
  random?: (value: number) => void;
}

export function ContactAddGTModal(props: ContactAddGTModalProps) {
  const { onClose, isShow, record, random } = props;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});
  const [newRecord, setNewRecord] = useState<any>({});
  const [isChangedRecord, setIsChangedRecord] = useState(false);
  const { config } = useContext(ConfigContext);


  useEffect(() => {
    if (record) {
        setValue("is_client", record.is_client);
        setValue("is_provider", record.is_provider);
        setValue("is_employee", record.is_employee);
        setValue("is_referred", record.is_referred);

        setValue("name", record.name);
        setValue("id_number", formatDuiWithAll(record.id_number));
        setValue("phone", record.phone);
        setValue("address", record.address);
        setValue("email", record.email);

        setValue("taxpayer", record.taxpayer); // contacto
        setValue("taxpayer_type", record.taxpayer_type);
    }
    setIsChangedRecord(false);
  }, [record, setValue, setIsChangedRecord, config]);


  const onSubmit = async (data: any) => {
      if (!data.is_client && !data.is_provider && !data.is_employee && !data.is_referred) {
          toast.error("Debe elegir el tipo de contacto");
          return false; }
    if (record) { data.id = record.id; }
    data.id_number = formatDocument(data.id_number) // se registr sin guiones
    data.document = formatDocument(data.document) // se registr sin guiones
    data.register = formatDocument(data.register) // se registr sin guiones
    try {
      setIsSending(true)
      const response = await postData(`contacts`, "POST", data);
      if (response.type == "successful") {
        toast.success(`Contacto ${record ? "actualizado" : "creado"} correctamente`);
        setMessage({});
        random && random(Math.random());
        if (record){
            setIsChangedRecord(true);
            setNewRecord(data);
        } else {
            reset()
        };
      } else {
          setMessage(response);
          toast.error("Faltan algunos datos importantes!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };

  
  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>{record ? "EDITAR CONTACTO" : "AGREGAR NUEVO CONTACTO"}</Modal.Header>
      <Modal.Body>
        {!isChangedRecord ? (
        <div className="mx-4">

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3">

              <div className="w-full md:w-full px-3 mb-2 flex justify-between">
                <div><input className="bg-lime-600 rounded-full" type="checkbox" {...register("is_client", {})} /> 
                <span className="ml-2 font-medium">Cliente</span></div>
                <div><input className="bg-lime-600 rounded-full" type="checkbox" {...register("is_provider", {})} /> 
                <span className="ml-2 font-medium">Proveedor</span></div>
                <div><input className="bg-lime-600 rounded-full" type="checkbox" {...register("is_employee", {})} /> 
                <span className="ml-2 font-medium">Repartidor</span></div>
                <div><input className="bg-lime-600 rounded-full" type="checkbox" {...register("is_referred", {})} /> 
                <span className="ml-2 font-medium">Referido</span></div>
            </div>

            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="name" className={style.inputLabel}>Nombre completo *</label>
                <input type="text" id="name" {...register("name")} 
                onBlur={(e) => setValue('taxpayer', e.target.value)} className={style.input} />
            </div>

            <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="id_number" className={style.inputLabel}>Indenficación Fiscal</label>
                <input type="text" id="id_number" {...register("id_number")} 
                 onBlur={(e) => setValue('document', e.target.value)} placeholder="0207-210690-102-9" pattern="^([0-9]{8}-[0-9]{1}|[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1})?$" className={`${style.input}`} />
            </div> 

            <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="phone" className={style.inputLabel}>Tel&eacute;fono</label>
                <input type="text" id="phone" {...register("phone")} placeholder="2250-9885" pattern="^[a-zA-Z0-9+()]{8,30}?$" className={`${style.input}`} />
            </div> 

            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="address" className={style.inputLabel}>Dirección</label>
                <input type="text" id="address" {...register("address")} className={style.input} />
            </div>

            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="email" className={style.inputLabel}>Email</label>
                <input type="email" id="email" {...register("email")} className={style.input} />
            </div>

           </div>

            <div className="w-full uppercase px-2 border-2 rounded-lg text-base font-bold text-center">CONTACTO</div>
    
            <div className="mt-2">
                <div className="flex flex-wrap -mx-3">

                    <div className="w-full md:w-full px-3 mb-2">
                        <label htmlFor="taxpayer" className={style.inputLabel}>Nombre del contacto</label>
                        <input type="text" id="taxpayer" {...register("taxpayer")} className={style.input} />
                    </div>
                
                    <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="taxpayer_type" className={style.inputLabel}> Tipo de contribuyente </label>
                    <select defaultValue={1} id="taxpayer_type" {...register("taxpayer_type")} className={style.input}>
                        <option value="1">Contribuyente</option>
                        <option value="2">Pequeño contribuyente</option>
                    </select>
                    </div>


                </div>
            </div>

              {message.errors && (
                <div className="">
                  <Alert
                    theme={PresetTheme.danger}
                    info="Error"
                    text={JSON.stringify(message.message)}
                    isDismisible={false}
                  />
                </div>
              )}

              <div className="flex justify-center mt-4">
              <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
              </div>

            </form>

        </div>) : (<ContactDetails record={newRecord} /> )}
        <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );
}
