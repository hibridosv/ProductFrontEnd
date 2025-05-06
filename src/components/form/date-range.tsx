'use client'
import { style } from '@/theme';
import React, { useState } from 'react';
import { Button, Preset } from '../button/button';
import { DateTime } from 'luxon';
import { formatDate } from '@/utils/date-formats';

export type DateRangeValues = {
  option?: string;
  initialDate?: string | any;
  finalDate?: string | any;
  product_id?: string | any;
  invoiceId?: string | any;
};

type DateRangeProps = {
  onSubmit: (values: DateRangeValues) => void;
};

export const DateRange: React.FC<DateRangeProps> = ({ onSubmit }) => {
  const [option, setOption] = useState('1');
  const [invoiceId, setinvoiceId] = useState('');
  const [initialDate, setInitialDate] = useState('');
  const [finalDate, setFinalDate] = useState('');
  const [dateValues, setDateValues] = useState<DateRangeValues>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const actualDate = DateTime.now();
    const formatedDate = actualDate.toFormat('yyyy-MM-dd');
    const startOfMonth = actualDate.startOf('month');
    const endOfMonth = actualDate.endOf('month');

    const values: DateRangeValues = {
      option: option,
      invoiceId: invoiceId,
      initialDate: option == '1' ? initialDate ? `${initialDate} 00:00:00` : `${formatedDate} 00:00:00` : initialDate ? `${initialDate} 00:00:00` : `${startOfMonth.toISODate()} 00:00:00`,
      finalDate: option == '2' ? finalDate ? `${finalDate} 23:59:59` : `${endOfMonth.toISODate()} 23:59:59` : "",
    };

    setDateValues(values)
    onSubmit(values)
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

      <div className="mt-3 text-red-600 flex items-center justify-center h-full font-semibold">
          {
            Object.keys(dateValues).length != 0 ? dateValues.option == '1' ? `Fecha establecida ${formatDate(dateValues.initialDate)}` : `Fechas de ${formatDate(dateValues.initialDate)} a ${formatDate(dateValues.finalDate)}` : ""
          }
      </div>
    </form>
    </div>);
};