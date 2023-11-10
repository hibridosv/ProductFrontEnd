import { Spinner } from "flowbite-react";


export interface LoadingProps{
    text?: string;
    color?: string;
    size?: string;
}
export function Loading(props: LoadingProps) {
  const { text = "Cargando...", color = "info", size = "xl" } = props;

  const margin = (size: string):string =>{
    if (size == "xl") {
      return "text-center align-middle mt-10";
    }
    return "text-center align-middle";
  }

  return (
    <div className="h-full">
      <div className={margin(size)}>
        <Spinner
          size={size}
          color={color}
        />
        <div className="text-{color}">{text}</div>
      </div>
    </div>
  );
}