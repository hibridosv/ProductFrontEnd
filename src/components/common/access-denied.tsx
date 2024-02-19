import Image from "next/image";

export function AccessDeniedPage(){


  return (
        <div className="w-full">
                <div className="flex justify-center">
                <Image
                    src="/img/denied.gif"
                    alt="Logo"
                    width={500}
                    height={500}
                    priority={false}
                />
                </div>
                <div className="m-4 shadow-lg border-2 text-center">SIN ACCESO EN ESTE MOMENTO</div>
        </div>
        );

}
