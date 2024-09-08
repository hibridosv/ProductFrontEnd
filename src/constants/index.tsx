'use client'

export const NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Sistema de Ventas';
export const URL = process.env.NEXT_PUBLIC_APP_URL || "http://connect.test/"
export const API_URL = `${URL}api/`;

export const AUTH_CLIENT = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID;
export const AUTH_SECRET = process.env.NEXT_PUBLIC_AUTH_SECRET_ID;
