'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { loadData } from "@/utils/functions";
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { CommissionsListTable } from "@/components/tools-components/commissions-list-table";
import { Button, Preset } from "@/components/button/button";
import { CommissionAddModal } from "@/components/tools-components/commission-add-modal";

export default function Page() {
  const [commissions, setCommissions] = useState([]);
  const [users, setUsers] = useState([] as any);
  const [isAddCommissionModal, setIsAddCommissionModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { register, watch } = useForm();
  const [randomNumber, setRandomNumber] = useState(0);


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-6 border-r md:border-sky-600">
          <ViewTitle text="AJUSTE DE INVENTARIO" />

        </div>
        <div className="col-span-4">
        <ViewTitle text="ULTIMOS REGISTROS" />
          <div className="flex flex-wrap m-4 shadow-lg border-2 rounded-md mb-8">

          </div>

        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
