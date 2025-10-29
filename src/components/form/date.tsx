'use client'
import { style } from '@/theme';
import React, { useState } from 'react';
import { Button, Preset } from '../button/button';
import { DateTime } from 'luxon';
import { formatDate } from '@/utils/date-formats';

export type DateValue = {
  option?: string;
  initialDate?: string | any;
};

type DateProps = {
  onSubmit: (value: DateValue) => void;
};

export const Date: React.FC<DateProps> = ({ onSubmit }) => {
  const [option, setOption] = useState('1');
  const [initialDate, setInitialDate] = useState('');
  const [dateValues, setDateValues] = useState<DateValue>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = DateTime.now();
    const selectedDate = initialDate || now.toFormat('yyyy-MM-dd');
    const fullDate = `${selectedDate} 23:59:59`;

    const value = { 
      initialDate: fullDate,
      option: option, 
    };

    setDateValues(value);
    onSubmit(value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="w-full px-3 mb-2">
          <input
            className={style.input}
            type="date"
            id="date"
            name="date"
            value={initialDate}
            onChange={(e) => setInitialDate(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <Button text="Aplicar" type="submit" preset={Preset.save} />
        </div>

        <div className="mt-3 text-red-600 flex items-center justify-center h-full font-semibold">
          {dateValues.initialDate
            ? `Fecha establecida: ${formatDate(dateValues.initialDate)}`
            : ''}
        </div>
      </form>
    </div>
  );
};