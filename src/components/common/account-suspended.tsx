import Image from "next/image";

export function AccountSuspendedPage() {
  return (
    <div className="w-full mt-8 flex flex-col items-center space-y-6">
      <div className="w-full md:w-2/3 lg:w-1/2 p-6 bg-white rounded-xl shadow-lg text-center">
        <div className="flex items-center justify-center space-x-2 text-4xl text-red-600 font-bold">
          <span>⚠️</span>
          <span>CUENTA SUSPENDIDA</span>
        </div>
        
        <p className="mt-4 text-lg text-slate-500 font-semibold">
          SU CUENTA HA SIDO SUSPENDIDA POR <span className="text-red-600">FALTA DE PAGO</span>
        </p>
        
        <div className="flex justify-center my-6">
          <Image
            src="/img/suspended.png"
            alt="Suspended"
            width={250}
            height={250}
            priority={false}
          />
        </div>
        
        <p className="text-slate-400 text-sm">
          Sus datos e información estarán disponibles durante <span className="font-bold text-slate-700">30 días</span> a partir de la suspensión.
        </p>
        
        <p className="mt-4 text-lg text-slate-500 font-semibold uppercase">
          Para más información, por favor <span className="text-sky-700">Contáctenos</span>
        </p>
        
        <div className="mt-6">
          <a target="_blank" href="https://wa.me/50368275365" className="bg-sky-700 text-white px-4 py-2 rounded-full hover:bg-sky-600 focus:outline-none transition">
            Contactar con ventas
          </a>
        </div>
      </div>
      <a href="/logout" className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-400 focus:outline-none transition">
            Cerrar Sesión
          </a>
    </div>
  );
}
