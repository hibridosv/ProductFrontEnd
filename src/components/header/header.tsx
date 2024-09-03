"use client";
import { useProSidebar } from "react-pro-sidebar";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai"
import { useContext, useState } from "react";
import { ProductSearchModal } from "../modals/product-search-modal";
import { ConfigContext } from "@/contexts/config-context";
import { HeaderSkeleton } from "./header-skeleton";
import { NotificationsPush } from "../pusher/nofications-push";
import { getConfigStatus } from "@/utils/functions";

export function Header() {
  const { toggleSidebar } = useProSidebar();
  const [showProductSearchModal, setShowProductSearchModal] = useState(false);
  const { config, systemInformation } = useContext(ConfigContext);
  const sys = systemInformation?.system?.tenant?.system;

  if (!systemInformation?.system?.theme) { return <HeaderSkeleton />}
  console.log("System: ", systemInformation);

  return (
    <header className="bg-white">
    <nav className={`w-full mx-auto flex items-center justify-between p-2  ${systemInformation ? systemInformation?.system?.theme === 1 ? "bg-mdb" : "bg-lime-600" : "bg-mdb"}`} aria-label="Global">
      <div className="flex">
      <GiHamburgerMenu className='clickeable' color="white" onClick={() => toggleSidebar()} size={40} />
      </div>
      <div className="text-white text-sm md:text-sm uppercase font-thin md:font-normal">
      {systemInformation?.user?.name} | {systemInformation?.system?.name}
      </div>

      <div className="justify-end">
        <div className="flex justify-between">

          {
            systemInformation.invoiceExist &&
              <div className="mr-2">
                <Link href="/config/invoices">
                  <span className="relative clickeable text-white flex justify-center align-middle" title="Click para ver sus facturas">
                    <span className="absolute flex h-3 w-3 mt-2 mr-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                  </span>
                </Link>
              </div>
          }

        {(sys == 1 || sys == 3) &&
          <div className="mr-2">
            <span className="clickeable text-white" onClick={()=>setShowProductSearchModal(true)}><span><AiOutlineSearch size={24} /></span></span>
          </div> }

          <div className="ml-2">
            <Link href={(sys == 1 || sys == 3) ? "/sales/quick" : "/sales/orders"}><span className="clickeable text-white"><span><AiFillHome size={24} /></span></span></Link>
          </div>
          
        </div>
      </div>
    </nav>
    <ProductSearchModal onClose={()=>setShowProductSearchModal(false)} isShow={showProductSearchModal}  />
    <NotificationsPush config={config} />
  </header>
  );
}
