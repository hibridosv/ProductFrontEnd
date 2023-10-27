"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button, Preset } from "../button/button";


export interface BrandAddListProps {
  option: number;
}

export function BrandAddList(props: BrandAddListProps) {
  const { option } = props;
  const [showModalBrands, setShowModalBrands] = useState(false);


if (option != 3) return null

  return (
        <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
            <div className="col-span-3">
              <Button isFull text="Agregar nueva categoría" preset={Preset.accept} onClick={() => setShowModalBrands(true)} />
              <ToastContainer />
            </div>
        </div>
  );
}
