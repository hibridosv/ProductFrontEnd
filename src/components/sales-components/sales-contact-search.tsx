'use client'
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { SearchInput } from "../form/search";
import { Button, Preset } from "../button/button";
import { Contact } from "@/services/Contacts";
import { getData, postData } from "@/services/resources";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import toast, { Toaster } from "react-hot-toast";
import { Loading } from "../loading/loading";
import { ContactNameOfOrder, ContactTypeToGet } from "@/services/enums";
import { getRandomInt } from "@/utils/functions";
import { ContactAddModal } from "../contacts-components/contact-add-modal";

export interface SalesContactSearchModalProps {
    ContactTypeToGet?: ContactTypeToGet; // ayuda a saber en que endpoint buscar
    onClose: () => void;
    isShow?: boolean;
    order: any; // numero de orden
    clientToUpdate: ContactNameOfOrder;
}

export function SalesContactSearchModal(props: SalesContactSearchModalProps){
const { ContactTypeToGet, onClose, isShow, order, clientToUpdate } = props;
const [contacts, setContacts] = useState([]) as any;
const [ randNumber, setrandNumber] = useState(0) as any;
const [ randomAfterEdit, setRandomAfterEdit] = useState(0) as any;
const { searchTerm, handleSearchTerm } = useSearchTerm(["name", "id_number", "code", "phone"], 500);
const [isSending, setIsSending] = useState(false);
const [isContactModal, setIsContactModal] = useState(false);
const [isAddContactModal, setIsAddContactModal] = useState(false);
const [recordSelect, setRecordSelect] = useState<any>(null);


const loadDataContacts = async () => {
    try {
      const response = await getData(`${ContactTypeToGet}sort=-created_at&perPage=10${searchTerm}`);
      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
};

useEffect(() => {
  if (searchTerm) {
    (async () => { await loadDataContacts();})();   
  }
  if (searchTerm == "") {
    setContacts([]);
  }
  // eslint-disable-next-line
}, [searchTerm]);

useEffect(() => {
  if (randomAfterEdit != 0) {
    (async () => { await handleContactSelected(recordSelect, true)})();   
  }
  // eslint-disable-next-line
}, [randomAfterEdit]);

const cancelClick = ()=>{
  setContacts([]);
  setrandNumber(getRandomInt(100));
}

const close = ()=>{
  setContacts([]);
  setrandNumber(getRandomInt(100));
  onClose()
}


const handleContactSelected = async(contact: Contact, isAfterUpdate = false) => {

  const data = {
    order_id : order.id, // orden a actualiar
    col_id : clientToUpdate, // columna a actualizar
    contact_id : contact.id // id del contacto
  }

  try {
    setContacts([]);
    setIsSending(true)
    const response = await postData(`order/contact/update`, "POST", data);
    if (!response.message) {
      toast.error(response.message);
    } else {
      if (isAfterUpdate){
        setIsContactModal(false)
      } else {
        toast.success(response.message)
      }         
      onClose()
    }
  } catch (error) {
    console.error(error)
  } finally{
    setIsSending(false)
    setrandNumber(getRandomInt(100));
  }

}


const listItems = contacts?.map((contact: any):any => (
    <div key={contact.id} onClick={()=>handleContactSelected(contact)}>
        <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
              {contact.name} | {contact.id_number ? contact.id_number : ""}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </li>
    </div>
))


const contactName = (contact: ContactNameOfOrder) => {
  switch (contact) {
    case ContactNameOfOrder.employee: return "Vendedor";
    case ContactNameOfOrder.delivery: return "Repartidor";
    case ContactNameOfOrder.client: return "Cliente";
    case ContactNameOfOrder.referred: return "Referido";
    default: return "Contacto";
  }
}

const contactNameOfData = (contact: ContactNameOfOrder, order: any) => {
  switch (contact) {
    case ContactNameOfOrder.employee: return order?.employee?.name;
    case ContactNameOfOrder.delivery: return order?.delivery?.name;
    case ContactNameOfOrder.client: return order?.client?.name;
    case ContactNameOfOrder.referred: return order?.referred?.name;
    default: return "Contacto";
  }
}

const contactData = (contact: ContactNameOfOrder, order: any) => {
  switch (contact) {
    case ContactNameOfOrder.employee: return order?.employee;
    case ContactNameOfOrder.delivery: return order?.delivery;
    case ContactNameOfOrder.client: return order?.client;
    case ContactNameOfOrder.referred: return order?.referred;
    default: return "Contacto";
  }
}

const handleRecordSelect = (contact: ContactNameOfOrder, order: any) => {
  setRecordSelect(contactData(contact, order));
  setIsContactModal(true);
}

const handleAddContact = () => {
  setRecordSelect(null);
  setIsAddContactModal(true);
}


return (
<Modal show={isShow} position="center" onClose={onClose} size="lg">
<Modal.Header>Buscar { contactName(clientToUpdate)} </Modal.Header>
  <Modal.Body>

    <div className="mx-4">

        <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Contacto" randNumber={randNumber} />
        <div className="w-full bg-white rounded-lg shadow-lg mt-4">
            <ul className="divide-y-2 divide-gray-400">
            { listItems }
            { contacts && contacts.length > 0 && 
                    <li className="flex justify-between p-3 hover:bg-red-200 hover:text-red-800 cursor-pointer" onClick={cancelClick}>
                        CANCELAR
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </li> }
            </ul>
        </div>

      { isSending && <Loading text="Enviando..." /> }

    { clientToUpdate == ContactNameOfOrder.client && order?.client?.name ||
      clientToUpdate == ContactNameOfOrder.delivery && order?.delivery?.name ||
      clientToUpdate == ContactNameOfOrder.employee && order?.employee?.name ||
      clientToUpdate == ContactNameOfOrder.referred && order?.referred?.name ?
      <div>
        <div className="font-extralight ">{ contactName(clientToUpdate)}:</div>
        <div className="font-bold border-y-2 flex justify-between ">
          <span>{contactNameOfData(clientToUpdate, order)}</span>
          <span>
            {clientToUpdate == ContactNameOfOrder.employee ? <Button preset={Preset.smallCloseDisable} noText /> : 
            <span><Button style="mr-2" preset={Preset.smallEdit} noText onClick={()=>handleRecordSelect(clientToUpdate, order)} />
            <Button preset={Preset.smallClose} noText onClick={()=>handleContactSelected({id: "", name: ""})} /></span>
            }
            </span>
        </div>
      </div> : <></> }

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
  { clientToUpdate == ContactNameOfOrder.employee ? <></> :
    <Button onClick={handleAddContact} text="Agregar Cliente" preset={Preset.add} disabled={isSending} /> }
    <Button onClick={close} preset={Preset.close} disabled={isSending} /> 
  </Modal.Footer>
  <ContactAddModal isShow={isContactModal} onClose={()=>setIsContactModal(false)} record={recordSelect} random={setRandomAfterEdit} />
  <ContactAddModal isShow={isAddContactModal} onClose={()=>setIsAddContactModal(false)} />
</Modal>

    )

}