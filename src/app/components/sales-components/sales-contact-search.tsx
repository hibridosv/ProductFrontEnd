'use client'
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { ViewTitle } from "../view-title/view-title";
import { SearchInput } from "../form/search";
import { Button, Preset } from "../button/button";
import { Contact } from "@/services/Contacts";
import { getData, postData } from "@/services/resources";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import toast, { Toaster } from "react-hot-toast";
import { Loading } from "../loading/loading";
import { ContactNameOfOrder, ContactTypeToGet } from "@/services/enums";

export interface SalesContactSearchModalProps {
  ContactTypeToGet?: ContactTypeToGet; // ayuda a saber en que endpoint buscar
    onClose: () => void;
    isShow?: boolean;
    order: any; // numero de orden
    clientToUpdate?: ContactNameOfOrder;
}

export function SalesContactSearchModal(props: SalesContactSearchModalProps){
const { ContactTypeToGet, onClose, isShow, order, clientToUpdate } = props;
const [contacts, setContacts] = useState([]) as any;

const { searchTerm, handleSearchTerm } = useSearchTerm()
const [isSending, setIsSending] = useState(false);


const loadDataContacts = async () => {
    try {
      const response = await getData(`${ContactTypeToGet}?sort=-created_at&perPage=10${searchTerm}`);
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

const handleContactSelected = async(contact: Contact) => {

  const data = {
    order_id : order,
    col_id : clientToUpdate,
    contact_id : contact.id
  }

  try {
    setContacts([]);
    setIsSending(true)
    const response = await postData(`sales/order/contact`, "POST", data);
    if (!response.message) {
      toast.error(response.message);
    } else {
      onClose()
    }
    console.log(response)
  } catch (error) {
    console.error(error)
  } finally{
    setIsSending(false)
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



return (

<Modal show={isShow} position="center" onClose={onClose} size="md">
<Modal.Header>Buscar contacto</Modal.Header>
  <Modal.Body>

    <div className="mx-4">

        <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Contacto" />
        <div className="w-full bg-white rounded-lg shadow-lg lg:w-2/3 mt-4">
            <ul className="divide-y-2 divide-gray-400">
            { listItems }
            </ul>
        </div>

      { isSending && <Loading text="Enviando..." /> }
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    <Button onClick={onClose} preset={Preset.close} isFull /> 
  </Modal.Footer>
</Modal>

    )

}