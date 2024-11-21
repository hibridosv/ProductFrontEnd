export interface ButtonLinkProps {
    text?: string;
}

export function ButtonLink({  text = "DESCARGAR" }: ButtonLinkProps) {

  return (
    <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
        {text}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    </li>
  );
}
