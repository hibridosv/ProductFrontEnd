'use client'
import { useContext, useEffect, useState } from 'react';
import { dateToNumberValidate, permissionExists } from '@/utils/functions';
import { ConfigContext } from '@/contexts/config-context';
import { md5 } from 'js-md5';

export function useCodeRequest(permmission: string) {
    const [codeRequestPice, setCodeRequestPice] = useState({ requestPrice: false, required: false})
    const { systemInformation } = useContext(ConfigContext);
    const [isRequestCodeModal, setIsRequestCodeModal] = useState(false);
    const [isShowError, setIsShowError] = useState(false);

    useEffect(() => {
        setCodeRequestPice(prevState => ({ ...prevState, 
          requestPrice: permissionExists(systemInformation?.permission, permmission), 
          required: permissionExists(systemInformation?.permission, permmission)  }
        ));
        // eslint-disable-next-line
      }, [systemInformation]);

      const verifiedCode  = (code: string, ) => {
        if (code.toUpperCase() == md5(dateToNumberValidate()).substring(0, 4).toUpperCase()) {
            setCodeRequestPice(prevState => ({ ...prevState, 
                requestPrice: permissionExists(systemInformation?.permission, permmission), 
                required: false  }
              ));
            setIsRequestCodeModal(false)
            return
        }
        setIsShowError(true)
      }
  
    
  return { codeRequestPice, verifiedCode, isRequestCodeModal, setIsRequestCodeModal, isShowError, setIsShowError };
}