'use client'

export const NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Sistema de Ventas';
export const URL = process.env.NEXT_PUBLIC_APP_URL || "https://api.latam-pos.com/"
export const API_URL = `${URL}api/`;

export const AUTH_CLIENT = process.env.NEXT_PUBLIC_CLIENT;
export const AUTH_SECRET = process.env.NEXT_PUBLIC_HASH;
