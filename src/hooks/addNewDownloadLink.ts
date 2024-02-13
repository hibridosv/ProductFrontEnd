'use client'
import { DateRangeValues } from '@/components/form/date-range';
import { LinkUrls } from '@/components/view-title/view-title';
import { useState } from 'react';
import { formatDate } from "@/utils/date-formats";
import { getUrlFromCookie } from "@/services/oauth";

export function AddNewDownloadLink() {
    const remoteUrl = getUrlFromCookie();
    const [links, setLinks] = useState<LinkUrls[]>([]);

    const addLink = (listLinks: LinkUrls[], data: DateRangeValues, url: string, userId?:any )=>{
        if (listLinks.length >= 3) listLinks.shift()
        
        var url = `${remoteUrl}/api/${url}?${data.option ? `option=${data.option}` : ``}${data.initialDate ? `&initialDate=${data.initialDate}` : ``}${data.finalDate ? `&finalDate=${data.finalDate}` : ``}${userId ? `&userId=${userId}` : ``}` 
        
        links.push({"name": `${data.option == '1' ? 
                            `Fecha establecida ${formatDate(data.initialDate)}` : 
                            `Del ${formatDate(data.initialDate)} al ${formatDate(data.finalDate)}`}`, 
                    "link": encodeURI(url), 
                    "isUrl": true})
        setLinks(links)
    }

  return { links, addLink };
}