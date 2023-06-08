'use client'
import { style } from '@/theme';
import React, { useState } from 'react';
import { Button, Preset } from '../button/button';

export type DateRangeValues = {
  option: string;
  initialDate: string;
  finalDate?: string;
  product_id?: string | any;
};

type DateRangeProps = {
  onSubmit: (values: DateRangeValues) => void;
};

export const DateRange: React.FC<DateRangeProps> = ({ onSubmit }) => {
  const [option, setOption] = useState('1');
  const [initialDate, setInitialDate] = useState('');
  const [finalDate, setFinalDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const values: DateRangeValues = {
      option: option,
      initialDate: `${initialDate} 00:00:00`,
      finalDate: `${finalDate} 23:59:59`,
    };

    onSubmit(values);
  };

  return (<div>
    <form onSubmit={handleSubmit}>
    <div className="flex justify-center">
        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]" >
          <input
            className={style.radioButton}
            type="radio"
            value="1"
            checked={option == '1'}
            onChange={(e) => setOption(e.target.value)}
          />
          <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="inlineRadio1">Fechas </label>
        </div>
        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]" >
          <input
            className={style.radioButton}
            type="radio"
            value="2"
            checked={option == '2'}
            onChange={(e) => setOption(e.target.value)}
          />
          <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="inlineRadio1" >Rango de Fechas </label>
      </div>
    </div>



      <div className="w-full px-3 mb-2">
      <label htmlFor="initialDate" className={style.inputLabel}>{option == '1' ? "Seleccionar Fecha" : "Fecha Inicial"}</label>
          <input
            className={style.input}
            type="date"
            id="initialDate"
            name="initialDate"
            value={initialDate}
            onChange={(e) => setInitialDate(e.target.value)}
          />
      </div>

    {option == '2' && (
      <div className="w-full px-3 mb-2">
      <label htmlFor="finalDate" className={style.inputLabel}>Fecha Final</label>

          <input
            className={style.input}
            type="date"
            id="finalDate"
            name="finalDate"
            value={finalDate}
            onChange={(e) => setFinalDate(e.target.value)}
            disabled={option != '2'}
          />
      </div>)}

      <div className="flex justify-center">
       <Button text='Aplicar' type="submit" preset={Preset.save} />
      </div>
    </form>
    </div>);
};