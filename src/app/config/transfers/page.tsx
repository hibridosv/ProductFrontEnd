"use client"
import { useState, useEffect, useContext } from 'react'

import { Loading, ViewTitle } from "@/components";
import { ListGroup } from "flowbite-react";
import { AiFillCalculator, AiOutlineArrowRight } from "react-icons/ai";
import { ConfigContext } from "@/contexts/config-context";
import { loadData, permissionExists } from "@/utils/functions";
import toast, { Toaster } from 'react-hot-toast';
import { postData } from '@/services/resources';
import { ConfigChangeTenantModal } from '@/components/config-components/config-change-tenant-modal';
import { getUrlFromCookie } from '@/services/oauth';
import { GrInstallOption, GrView } from 'react-icons/gr';

export default function Config() {
  const [tenants, setTenants] = useState<any>([]);
  const [tenantsRemoteUrl, setTenantsRemoteUrl] = useState<any>([]);
  const [invoiceTypes, setInvoiceTypes] = useState<any>([]);

  const [newRegister, setNewRegister] = useState<boolean>(false);
  const { systemInformation } = useContext(ConfigContext);
  const [isSending, setIsSending] = useState(false);
  const [isChangeTenantModal, setIsChangeTenantModal] = useState(false);
  const [isTenantSelected, setIsTenantSelected] = useState(0);
  const remoteUrl = getUrlFromCookie();

  useEffect(() => {
    if (systemInformation && systemInformation?.user?.email) { 
      (async () => setTenantsRemoteUrl(await loadData(`remoteurl/${systemInformation?.user?.email}`)) )();
      (async () => setTenants(await loadData(`tenants`)) )();
      (async () => setInvoiceTypes(await loadData(`invoice/type`)) )();
      setNewRegister( permissionExists(systemInformation?.permission, 'config-transfers-add-transfer'));
    }
    // eslint-disable-next-line
  }, [systemInformation]);

  const sendTenant = async(tenant: number)=>{
    try {
        setIsSending(true)
        const response = await postData(`linkedsystems/create`, "POST", {to_tenant_id : tenant});
        if (response.type == "successful") {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false)
      }
  }

  const selectTenant = (tenant: any)=>{
    setIsTenantSelected(tenant);
    setIsChangeTenantModal(true);
  }

    const listItemsRemote =  tenantsRemoteUrl?.data?.map((record: any, key: any) => (
        <ListGroup.Item key={key} icon={AiOutlineArrowRight} onClick={record.url == remoteUrl ? ()=>{} : ()=>selectTenant(record)} className={`${record.url == remoteUrl && "text-red-700 bg-red-200"}`}>
            <span className="text-lg font-semibold uppercase">{record.tenant}</span>
        </ListGroup.Item>
      ))

      const listItems = tenants?.data?.map((record: any, key: any) => (
        <ListGroup.Item key={key} icon={AiOutlineArrowRight} onClick={()=>sendTenant(record.id)}>
            <span className='text-lg font-semibold uppercase'>{record.name}</span>
        </ListGroup.Item>
      ))


      const listItemsinvoiceTypes = invoiceTypes?.data?.map((record: any, key: any) => (
          <div className=' flex justify-between p-2 border border-spacing-y-1' key={key}>
            <span className='text-lg font-semibold uppercase'>{record.name}</span>
            <span className='clickeable justify-end'><GrView color='green' size={24} /></span>
          </div>
      ))

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 pb-10">
       <div className="col-span-2">
        <ViewTitle text="CAMBIAR SISTEMA" />
        <div className='mr-3 sm:mt-3'>
            <ListGroup>
                { listItemsRemote }
            </ListGroup>
            {
            newRegister &&
            <>
                <ViewTitle text="VINCULAR SISTEMA" />
                <span className='ml-4 text-xs text-slate-600 text-center font-thin'>* Opción disponible solo para usuario root</span>
                <ListGroup>
                    { isSending ? <Loading text='Agregando Dirección' /> : listItems }
                </ListGroup>
             </> 
             }
        </div>
      </div>
      <div className="col-span-2">
        <ViewTitle text="DOCUMENTOS ACTIVOS" />
        <div className='mx-3 sm:mt-3'>
              <div className='rounded-md border border-zinc-600'>
                  { listItemsinvoiceTypes }
              </div>
        </div>
      </div>
      <div className="col-span-2">
        <ViewTitle text="OPCIONES" />
        <div className='mr-3 sm:mt-3'>

        </div>
      </div>
      <ConfigChangeTenantModal isShow={isChangeTenantModal} tenantSelect={isTenantSelected} onClose={()=>setIsChangeTenantModal(false)} />
      <Toaster position="top-right" reverseOrder={false} />
   </div>
  )
}
