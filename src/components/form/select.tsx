import React from "react";


export interface SelectProps{
    name?: string;
    iden: string;
    value?: string;
    onChange?: ()=> void | any;
}
export function Select(props: SelectProps) {
    const { name, iden, value, onChange } = props

  return (
    <div>
      <label htmlFor={iden} className="text-blue-900 mb-2">
        {name}:{" "}
      </label>
    <select
      name={name}
      id={iden}
      value={ value }
      onChange={onChange}
      className="border border-blue-300 rounded-md p-2"
    ></select>
    </div>
  );
}
