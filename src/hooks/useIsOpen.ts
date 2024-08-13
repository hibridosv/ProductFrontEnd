'use client'
import {  useState } from 'react';

export function useIsOpen(status = false) {
    const [ isOpen, setIsOpen ] = useState(status);


  return { isOpen, setIsOpen };
} 
