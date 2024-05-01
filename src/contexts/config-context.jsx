'use client'
import { createContext, useEffect, useState } from 'react';
import { postData } from '../services/resources';
import { loadData } from '@/utils/functions';

export const ConfigContext = createContext();

export function ConfigContextProvider(props){

    const [config, setConfig] = useState({});
    const [systemInformation, setSystemInformation] = useState({});
    const [cashDrawer, setCashDrawer] = useState("");
    const [randomInit, setRandomInit] = useState(0);

   
    useEffect(() => {
        (async () => {
            setConfig(await loadData(`config`))
            setSystemInformation(await loadData(`configuration/information`))
            const cash = await loadData(`cashdrawers/active`)
            setCashDrawer(cash?.type == "error" ? "" : cash?.data?.id);
        })();
    }, [randomInit]);

    
    const updateConfig = async (key, value) => {
        try {
            const response = await postData(`config/${key}`, 'PUT', {"active": value});
            setConfig(response);
        } 
        catch (error) {
            console.error(error);
        }  
    }


    return (
        <ConfigContext.Provider value={{config, updateConfig, cashDrawer, setCashDrawer, setRandomInit, systemInformation }}>
            {props.children}
        </ConfigContext.Provider>
    )
}