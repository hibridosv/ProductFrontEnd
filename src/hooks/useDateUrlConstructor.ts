'use client'

import { DateRangeValues } from "@/components/form/date-range";
import { useState } from "react";

export function useDateUrlConstructor() {
  const [url, setUrl] = useState("");

    const constructor = (data: DateRangeValues, url: string)=>{
        let dir = encodeURI(`${url}?option=${data.option}${data.initialDate ? `&initialDate=${data.initialDate}` : ``}${data.finalDate ? `&finalDate=${data.finalDate}` : ``}${data.product_id ? `&product_id=${data.product_id}` : ``}`)
        setUrl(dir)
    }

  return { url, constructor };
}