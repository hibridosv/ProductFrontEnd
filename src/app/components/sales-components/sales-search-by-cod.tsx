'use client'
import { NameIcon, SearchIcon } from '@/theme/svg';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SalesSearchByCodeProps {
    onFormSubmit: (data: FormData) => void;
    isLoading: boolean;
    typeOfSearch?: boolean; // tipo de busqueda
    setTypeOfSearch: (type: boolean)=>void;
  }
  
  interface FormData {
    cod: string;
  }

  

export function SalesSearchByCode(props: SalesSearchByCodeProps){
const { setTypeOfSearch, typeOfSearch, onFormSubmit, isLoading } = props;

const { register, handleSubmit, reset } = useForm<FormData>();

const onSubmit = (data: FormData) => {
    onFormSubmit(data);
    reset(); 
  };

return (
    <div className="m-2 flex justify-between">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              { SearchIcon} 
            </div>
            <input
              type="text"
              id="cod"
              readOnly={isLoading}
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={isLoading ? "Cargando Datos" : "Ingrese el código del Producto"}
              required
              {...register("cod")}
            />
          </div>
        </div>
      </form>
      <div className="mx-2 grid content-center cursor-pointer" onClick={()=>setTypeOfSearch(!typeOfSearch)}>{  typeOfSearch ? NameIcon : SearchIcon  }</div>
    </div>
  );
};