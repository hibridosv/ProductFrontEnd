'use client'
import { createContext, useEffect, useState } from 'react';
import { getData, postData } from '../services/resources';

export const ConfigContext = createContext();

export function ConfigContextProvider(props){

    const [config, setConfig] = useState({});

   
    useEffect(() => {
        const getConfig = async () => {
        try {
            const response = await getData("config");
            setConfig(response);
            } 
        catch (error) {
            console.error(error);
            }
        }
        getConfig();
    }, []);

    
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
        <ConfigContext.Provider value={{config, updateConfig}}>
            {props.children}
        </ConfigContext.Provider>
    )
}