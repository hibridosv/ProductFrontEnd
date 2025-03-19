'use client'
import { Pagination, ViewTitle } from "@/components";
import { Button, Preset } from "@/components/button/button";
import { CreditsShowTotal } from "@/components/credits-components/credits-show-total";
import { CreditAddPayableModal } from "@/components/credits-components/credits-add-payable-modal";
import { CreditAddPaymentModal, Type } from "@/components/credits-components/credits-add-payment-modal";
import { CredistPayableTable } from "@/components/credits-components/credits-payable-table";
import { usePagination } from "@/hooks/usePagination";
import { getRandomInt, getTotalOfItem, loadData } from "@/utils/functions";
import { useEffect, useState } from "react";
import { SearchInput } from "@/components/form/search";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { getData } from "@/services/resources";
import { Option, RadioButton } from "@/components/radio-button/radio-button";


export default function CreditPayablePage() {
  const [isAddPayableModal, setIsAddPayableModal] = useState(false);
  const [isAddPaymentModal, setIsAddPaymentModal] = useState(false);
  const [isCreditSelect, setIsCreditSelect] = useState([]);
  const [credits, setCredits] = useState([] as any);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const [creditsTotal, setCreditsTotal] = useState(0);
  const [creditsQuantity, setCreditsQuantity] = useState(0);

  const [ randNumber, setrandNumber] = useState(0) as any;
  const { searchTerm, handleSearchTerm } = useSearchTerm(["name", "id_number", "code", "phone"], 500);
  const [contacts, setContacts] = useState([]) as any;
  const [contactSelected, setContactSelected] = useState(null) as any;

  let optionsRadioButton: Option[] = [
    { id: 2, name: "Todos" },
    { id: 0, name: "Pagadas" },
    { id: 1, name: "Pendientes" },
  ];
  const [selectedOption, setSelectedOption] = useState<Option>({ id: 2, name: "Todos" });
  
  const setOption = (option: Option) => {
    setSelectedOption(option)
    handlePageNumber("&page=1")
  }

  useEffect(() => {
    if (!isAddPayableModal && !isAddPaymentModal) {
      (async () => setCredits(await loadData(`credits/payable?${selectedOption?.id != 2 ? `filterWhere[status]==${selectedOption?.id}&`:``}${contactSelected?.id ? `filterWhere[provider_id]==${contactSelected.id}&` : ``}sort=-created_at&perPage=10${currentPage}`)))();
    }
  }, [isAddPayableModal, isAddPaymentModal, currentPage, contactSelected, selectedOption]);

  useEffect(() => {
      if (credits.data && credits?.data.length > 0) {
        let dataFiltered = credits?.data.filter((element:any) => element.status === 1)
        setCreditsQuantity(dataFiltered.length)
        setCreditsTotal(getTotalOfItem(credits?.data, "balance"))
      }
  }, [setCreditsQuantity, setCreditsTotal, credits]);


  const handleCancelContact = () => {
      setContactSelected(null)
      setrandNumber(getRandomInt(100));
      setContacts([])
  }
  const handleSelectContact = (contact: any) => {
      setContactSelected(contact)
      handlePageNumber("&page=1")
      setrandNumber(getRandomInt(100));
      setContacts([])
  }

  const loadDataContacts = async () => {
      try {
      const response = await getData(`contacts?filterWhere[is_provider]==1&filterWhere[status]==1&sort=-created_at&perPage=10${searchTerm}`);
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

  const listItems = contacts?.map((contact: any):any => (
    <div key={contact.id} onClick={()=>handleSelectContact(contact)}>
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
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
            <div className="flex justify-between">
              <ViewTitle text="CUENTAS POR PAGAR" />
              <span className=" m-4 text-2xl "><Button preset={Preset.add} text="AGREGAR" onClick={()=>setIsAddPayableModal(true)} /></span>
            </div>
            <CredistPayableTable records={credits} onClick={()=>setIsAddPaymentModal(true)} creditSelect={setIsCreditSelect} />
            <Pagination  records={credits} handlePageNumber={handlePageNumber } />
        </div>
        <div className="col-span-3">
            <ViewTitle text="RESUMEN" />
            <CreditsShowTotal quantity={creditsQuantity} text="Creditos Pendientes" number />
            <CreditsShowTotal quantity={creditsTotal} text="Total Pendiente" />

            <div className="mx-2">
              <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar por proveedor" randNumber={randNumber} />
              <div className="w-full bg-white rounded-lg shadow-lg mt-4">
                  <ul className="divide-y-2 divide-gray-400">
                  { listItems }
                  { contacts && contacts.length > 0 && 
                          <li className="flex justify-between p-3 hover:bg-red-200 hover:text-red-800 cursor-pointer" onClick={handleCancelContact}>
                              CANCELAR
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                          </li> }
                  </ul>
              </div>
              { contactSelected &&
              <div className="flex justify-between px-2 mb-3 uppercase text-lg font-semibold shadow-md rounded-md">
                  <span>{ contactSelected?.name }</span> 
                  <span className="text-right"><Button noText preset={Preset.smallClose} onClick={handleCancelContact} /></span>
              </div> }

            <RadioButton options={optionsRadioButton} onSelectionChange={setOption} />


          </div>
          
        </div>
        <CreditAddPayableModal isShow={isAddPayableModal} onClose={()=>setIsAddPayableModal(false)} />
        <CreditAddPaymentModal isShow={isAddPaymentModal} onClose={()=>setIsAddPaymentModal(false)} accountType={Type.payable} creditSelected={isCreditSelect} />
    </div>
      );
}
