"use client";
import {  useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

import { postData } from "@/services/resources";
import { style } from "../../theme";
import { Alert } from "../alert/alert";
import { PresetTheme } from "@/services/enums";
import { ContactDetails } from "./contact-details.";
import { loadData } from "@/utils/functions";

export interface ContactAddModalProps {
  onClose: () => void;
  isShow: boolean;
  record?: any;
  random?: (value: number) => void;
}

export function ContactAddModal(props: ContactAddModalProps) {
  const { onClose, isShow, record, random } = props;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});
  const [newRecord, setNewRecord] = useState<any>({});
  const [isOtherRegisters, setIsOtherRegisters] = useState(false);
  const [isChangedRecord, setIsChangedRecord] = useState(false);
  const [locations, setLocaltions] = useState({} as any);
  const [town, setTown] = useState({} as any);


  useEffect(() => {
    if (record) {
        setValue("is_client", record.is_client);
        setValue("is_provider", record.is_provider);
        setValue("is_employee", record.is_employee);
        setValue("is_referred", record.is_referred);

        setValue("name", record.name);
        setValue("id_number", record.id_number);
        setValue("phone", record.phone);
        setValue("address", record.address);
        setValue("email", record.email);
        setValue("birthday", record.birthday);

        setValue("taxpayer", record.taxpayer);
        setValue("document", record.document);
        setValue("register", record.register);
        setValue("roar", record.roar);
        setValue("address_doc", record.address_doc);
        setValue("departament_doc", record.departament_doc);
        setValue("town_doc", record.town_doc);
        setValue("taxpayer_type", record.taxpayer_type);
    }
    setIsChangedRecord(false);
  }, [record, setValue, setIsChangedRecord]);


  const onSubmit = async (data: any) => {
      if (!data.is_client && !data.is_provider && !data.is_employee && !data.is_referred) {
          toast.error("Debe elegir el tipo de contacto");
          return false; }
    if (record) { data.id = record.id; }
    data.town_doc = data.town_doc.substring(data.town_doc.length - 2)
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
  
  useEffect(() => {
    (async () => setLocaltions(await loadData(`electronic/getlocations`)))();
  }, []);

  useEffect(() => {
    setTown(locations?.departamentos?.find((element:any) => element?.id === watch("departament_doc")));
  }, [watch("departament_doc")]);

  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>AGREGAR NUEVO CONTACTO</Modal.Header>
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
                <input type="text" id="name" {...register("name")} className={style.input} />
            </div>


            <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="id_number" className={style.inputLabel}>Numero de documento</label>
                <input type="number" id="id_number" {...register("id_number", {required: true, pattern: /^([0-9]{14}|[0-9]{9})$/i})} className={`${style.input}`} />
            </div> 

            <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="phone" className={style.inputLabel}>Tel&eacute;fono</label>
                <input type="text" id="phone" {...register("phone")} className={`${style.input}`} />
            </div> 

            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="address" className={style.inputLabel}>Dirección</label>
                <input type="text" id="address" {...register("address")} className={style.input} />
            </div>

            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="email" className={style.inputLabel}>Email</label>
                <input type="text" id="email" {...register("email")} className={style.input} />
            </div>

                            
            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="birthday" className={style.inputLabel}> Fecha de nacimiento </label>
                <input type="date" id="birthday" {...register("birthday")} className={style.input} />
            </div>


            {/* <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="description" className={style.inputLabel}> Comentarios{" "} </label>
                <textarea {...register("description")} rows={2} className={`${style.input} w-full`} />
            </div> */}

           </div>

            <div onClick={()=>setIsOtherRegisters(!isOtherRegisters)} className="w-full uppercase px-2 border-2 rounded-lg text-base font-bold text-center clickeable">Datos de contribuyente</div>
            {isOtherRegisters && (
            <div className="mt-2">
                <div className="flex flex-wrap -mx-3">

                    <div className="w-full md:w-full px-3 mb-2">
                        <label htmlFor="taxpayer" className={style.inputLabel}>Nombre del contribuyente</label>
                        <input type="text" id="taxpayer" {...register("taxpayer")} className={style.input} />
                    </div>
                
                    <div className="w-full md:w-1/2 px-3 mb-2">
                        <label htmlFor="document" className={style.inputLabel}>Documento</label>
                        <input type="number" id="document" {...register("document", {pattern: /^([0-9]{14}|[0-9]{9})$/i})} className={style.input} />
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-2">
                        <label htmlFor="register" className={style.inputLabel}>Registro</label>
                        <input type="number" id="register" {...register("register", {pattern: /^[0-9]{1,8}$/i})} className={style.input} />
                    </div>

                    <div className="w-full md:w-full px-3 mb-2">
                        <label htmlFor="roar" className={style.inputLabel}>Giro</label>
                        <input type="text" id="roar" {...register("roar")} className={style.input} />
                    </div>

                    <div className="w-full md:w-full px-3 mb-2">
                        <label htmlFor="address_doc" className={style.inputLabel}>Dirección</label>
                        <input type="text" id="address_doc" {...register("address_doc")} className={style.input} />
                    </div>

                    <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="departament_doc" className={style.inputLabel}> Departamento </label>
                    <select defaultValue="06" id="departament_doc" {...register("departament_doc")} className={style.input}>
                      {  locations?.departamentos?.map((departament: any)=>{
                          return (<option key={departament.id} value={departament.id}>{departament.nombre}</option>)
                      })}
                    </select>
                    </div>

                    <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="town_doc" className={style.inputLabel}> Municipio </label>
                    <select defaultValue={watch("departament_doc") ? watch("departament_doc")+'01' : "0614"} id="town_doc" {...register("town_doc")} className={style.input}>
                    {  town?.municipios?.map((minucipio: any)=>{
                          return (<option key={minucipio.id_mun} value={minucipio.id_mun}>{minucipio.nombre}</option>)
                      })}
                    </select>
                    </div>

                    <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="taxpayer_type" className={style.inputLabel}> Tipo de contribuyente </label>
                    <select defaultValue={1} id="taxpayer_type" {...register("taxpayer_type")} className={style.input}>
                        <option value="1">CONTRIBUYENTE</option>
                        <option value="2">GRAN CONTRIBUYENTE</option>
                    </select>
                    </div>


                </div>
            </div>
            )}
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
