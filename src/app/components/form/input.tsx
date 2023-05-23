import React from "react";

export interface InputProps {
  type?: string;
  name?: string;
  id?: string;
}
export function Input(props: InputProps) {
  const { type, name, id } = props;

  return (
    <div>
      <label htmlFor={id} className="text-blue-900 mb-2">
        {name}:{" "}
      </label>
      <input
        type={type}
        id={id}
        className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      />
    </div>
  );
}
