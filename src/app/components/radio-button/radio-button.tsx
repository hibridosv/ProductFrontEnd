"use client";
import React, { useState } from 'react';

export interface Option {
  id: number;
  name: string;
}

interface RadioButtonProps {
  options: Option[];
  onSelectionChange: (option: Option) => void;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ options, onSelectionChange }) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(options[0] ? options[0] : null);

  const handleOptionChange = (option: Option) => {
    setSelectedOption(option);
    onSelectionChange(option);
  };

  return (
    <div className="flex justify-center">
      {options.map((option) => (
        <div
          className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]"
          key={option.id}
        >
          <input
            className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
            type="radio"
            value={option.id}
            checked={selectedOption?.id === option.id}
            onChange={() => handleOptionChange(option)}
            />
          <label
            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="inlineRadio1"
          >
            {option.name}
          </label>
        </div>
      ))}
    </div>
  );

};
