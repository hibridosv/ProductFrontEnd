'use client'
import { DateRangeValues } from '@/components/form/date-range';
import { LinkUrls } from '@/components/view-title/view-title';
import { useState } from 'react';
import { formatDate } from "@/utils/date-formats";
import { getUrlFromCookie } from "@/services/oauth";

export function AddNewDownloadLink() {
    const remoteUrl = getUrlFromCookie();
    const [links, setLinks] = useState<LinkUrls[]>([]);

    const addLink = (listLinks: LinkUrls[], data: DateRangeValues, url: string, params?:any )=>{
        if (listLinks.length >= 3) listLinks.shift()
        let getParams = params && params?.map((param: any) => `&${param.name}=${param.value}`).join('');
        const newUrl = `${remoteUrl}/download/${url}?${data.option ? `option=${data.option}` : ``}${data.initialDate ? `&initialDate=${data.initialDate}` : ``}${data.finalDate ? `&finalDate=${data.finalDate}` : ``}${params ? `${getParams}` : ``}` 
        
        links.push({"name": `${!data.option ? "Descargar Documento" : data.option == '1' ?
                            `Fecha establecida ${formatDate(data.initialDate)}` : 
                            `Del ${formatDate(data.initialDate)} al ${formatDate(data.finalDate)}`}`, 
                    "link": encodeURI(newUrl), 
                    "isUrl": true})
        setLinks(links)
    }

  return { links, addLink };
}