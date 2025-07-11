import { useContext, useEffect, useState } from 'react';
import { dateToNumberValidate, permissionExists } from '@/utils/functions';
import { ConfigContext } from '@/contexts/config-context';
import { md5 } from 'js-md5';

/**
 * 
 * @param permmission // nombre del permiso a validar si existe y esta activo
 * @param reverseRequired // si es true // valida que el permiso sea true
 * @returns 
 */

export function useCodeRequest(permmission: string, reverseRequired: boolean = true, reload: any = "") {
  const [codeRequest, setCodeRequest] = useState({ requestCode: false, required: false });
  const { systemInformation } = useContext(ConfigContext);
  const [isRequestCodeModal, setIsRequestCodeModal] = useState(false);
  const [isShowError, setIsShowError] = useState(false);

  useEffect(() => {
    if (systemInformation?.permission) {
      const permissionExistsFlag = permissionExists(systemInformation?.permission, permmission);
      // Modificar el valor de `required` basado en `reverseRequired`
      setCodeRequest(prevState => ({
        ...prevState,
        requestCode: reverseRequired ? permissionExistsFlag : !permissionExistsFlag,
        required: reverseRequired ? permissionExistsFlag : !permissionExistsFlag
      }));
    }

    // eslint-disable-next-line
  }, [systemInformation, reverseRequired, reload]);

  const verifiedCode = (code: string) => {
    const permissionExistsFlag = permissionExists(systemInformation?.permission, permmission);
    if (code.toUpperCase() === md5(dateToNumberValidate()).substring(0, 4).toUpperCase()) {
      setCodeRequest(prevState => ({
        ...prevState,
        requestCode: reverseRequired ? permissionExistsFlag : !permissionExistsFlag,
        required: false
      }));
      setIsRequestCodeModal(false);
      return;
    }
    setIsShowError(true);
  };

  return {
    codeRequest,
    verifiedCode,
    isRequestCodeModal,
    setIsRequestCodeModal,
    isShowError,
    setIsShowError
  };
}
