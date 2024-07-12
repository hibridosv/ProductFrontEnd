'use client'

const env = (enviroment: any): string => {
    switch (enviroment) {
        case 0: return "http://billing.test/"
        case 1: return "https://api.latam-pos.com/"
        case 2: return "https://apitest.latam-pos.com/"
        default: return "https://api.latam-pos.com/"
    }
}
export const NAME = process.env.REACT_APP_NAME || 'Sistema de Facturación';
export const URL = env(process.env.ENV_TYPE)
export const API_URL = `${URL}api/`;
