"use client";
import { useState, useContext, useEffect } from "react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import { postData, getData } from "@/services/resources";
import { Price, Product } from "@/services/products";
import { getConfigStatus, numberToMoney } from "@/utils/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RadioButton, Option} from "../radio-button/radio-button";
import { style } from "../../../theme";
import { ConfigContext } from "../../../contexts/config-context";
import { Alert } from "../alert/alert";


export interface UploadImageProps {
  product?: Product | any;
}

export function UploadImage(props: UploadImageProps) {
  const { product } = props;


  return (
        <div className="mx-4">
        </div>
  );
}
