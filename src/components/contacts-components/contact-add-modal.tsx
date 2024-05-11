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
import { formatDocument, getConfigStatus, getDepartmentNameById, getMunicipioNameById, loadData } from "@/utils/functions";
import { ContactDepartamentModal } from "./contact-departament-modal";
import { ContactTownModal } from "./contact-town-modal";
import { ConfigContext } from "@/contexts/config-context";

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
  const [isChangedRecord, setIsChangedRecord] = useState(false);
  const [locations, setLocaltions] = useState({} as any);
  const [departament, setDepartament] = useState("06");
  const [town, setTown] = useState("14");
  const [isContactDepartamentModal, setIsContactDepartamentModal] = useState(false);
  const [isContactTowModal, setIsContactTowModal] = useState(false);
  const { config } = useContext(ConfigContext);
  const [isShowCode, setIsShowCode] = useState(false);

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
        setValue("code", record.code);
        setValue("birthday", record.birthday);

        setValue("taxpayer", record.taxpayer);
        setValue("document", record.document);
        setValue("register", record.register);
        setValue("roar", record.roar);
        setValue("address_doc", record.address_doc);
        setValue("taxpayer_type", record.taxpayer_type);
        setDepartament(record.departament_doc)
        setTown(record.town_doc)
    }
    setIsShowCode(getConfigStatus("contact-code", config));
    setIsChangedRecord(false);
  }, [record, setValue, setIsChangedRecord, config]);


  const onSubmit = async (data: any) => {
      if (!data.is_client && !data.is_provider && !data.is_employee && !data.is_referred) {
          toast.error("Debe elegir el tipo de contacto");
          return false; }
    if (record) { data.id = record.id; }
    data.departament_doc = departament
    data.town_doc = town
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
  
  useEffect(() => {
    if (isShow) {
      const fetchData = async () => {
        const data = await loadData(`electronic/getlocations`);
        setLocaltions(data);
      };
    
      fetchData();
    }

  }, [setLocaltions, isShow]);


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
                <input type="text" id="name" {...register("name")} 
                onBlur={(e) => setValue('taxpayer', e.target.value)} className={style.input} />
            </div>

            {
              isShowCode && 
              <div className="w-full md:w-full px-3 mb-2">
                  <label htmlFor="code" className={style.inputLabel}>Código</label>
                  <input type="text" id="code" {...register("code", {required: true})} className={`${style.input}`} />
              </div> 
            }
            <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="id_number" className={style.inputLabel}>Numero de documento</label>
                <input type="text" id="id_number" {...register("id_number", {required: true})} 
                 onBlur={(e) => setValue('document', e.target.value)} className={`${style.input}`} />
            </div> 

            <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="phone" className={style.inputLabel}>Tel&eacute;fono</label>
                <input type="text" id="phone" {...register("phone")} className={`${style.input}`} />
            </div> 

            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="address" className={style.inputLabel}>Dirección</label>
                <input type="text" id="address" {...register("address")} 
                onBlur={(e) => setValue('address_doc', e.target.value)} className={style.input} />
            </div>

            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="email" className={style.inputLabel}>Email</label>
                <input type="text" id="email" {...register("email")} className={style.input} />
            </div>

                            
            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="birthday" className={style.inputLabel}> Fecha de nacimiento </label>
                <input type="date" id="birthday" {...register("birthday")} className={style.input} />
            </div>

           </div>

            <div className="w-full uppercase px-2 border-2 rounded-lg text-base font-bold text-center">Datos de contribuyente</div>
    
            <div className="mt-2">
                <div className="flex flex-wrap -mx-3">

                    <div className="w-full md:w-full px-3 mb-2">
                        <label htmlFor="taxpayer" className={style.inputLabel}>Nombre del contribuyente</label>
                        <input type="text" id="taxpayer" {...register("taxpayer")} className={style.input} />
                    </div>
                
                    <div className="w-full md:w-1/2 px-3 mb-2">
                        <label htmlFor="document" className={style.inputLabel}>Documento</label>
                        <input type="text" id="document" {...register("document")} className={style.input} />
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-2">
                        <label htmlFor="register" className={style.inputLabel}>Registro</label>
                        <input type="text" id="register" {...register("register")} className={style.input} />
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
                    <div className={style.input} onClick={()=>setIsContactDepartamentModal(true)}>
                    {getDepartmentNameById(departament, locations)}
                    </div>
                    </div>

                    <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="town_doc" className={style.inputLabel}> Municipio </label>
                    <div className={style.input} onClick={()=>setIsContactTowModal(true)}>
                        {getMunicipioNameById(`${departament}${town}`, locations)}
                    </div>
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
        <ContactDepartamentModal setDepartament={setDepartament} setTown={setTown} isShow={isContactDepartamentModal} onClose={()=>setIsContactDepartamentModal(false)} record={locations} />
        <ContactTownModal setTown={setTown} departament={departament} isShow={isContactTowModal} onClose={()=>setIsContactTowModal(false)} record={locations} />
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );
}
