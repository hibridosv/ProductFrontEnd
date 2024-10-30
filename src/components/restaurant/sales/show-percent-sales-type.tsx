import { useEffect, useState } from "react";
import { getData } from "@/services/resources";

export interface ShowPercentSalesTypeProps {
  order?: any;
  config: string[];
}

export function ShowPercentSalesType(props: ShowPercentSalesTypeProps) {
  const { order, config } = props;
  const [percentajes, setPercentajes] = useState<{ data: any[] } | null>(null);

  useEffect(() => {
    const loadPercentajes = async () => {
      try {
        const response = await getData(`dashboard/percentaje?restricted=true`);
        if (response?.data && Array.isArray(response.data)) {
          setPercentajes(response);
        } else {
          setPercentajes({ data: [] }); // Prevenir errores
        }
      } catch (error) {
        console.error("Error al cargar los porcentajes:", error);
        setPercentajes({ data: [] }); // Evitar fallos en caso de error
      }
    };
    if (!order?.invoiceproducts && config.includes("restaurant-sales-percent")) {
      loadPercentajes();
    }
  }, [order, config]);
    console.log(config)
  if (!percentajes || percentajes.data.length === 0) {
    return <div></div>;
  }

  // Paleta de colores para las barras (cambia según el índice)
  const colors = [
    "bg-lime-500",
    "bg-red-500",
    "bg-cyan-500",
    "bg-gray-500",
    "bg-purple-500",
  ];

  return (
    <div className="w-full mt-2 h-5 flex rounded-md overflow-hidden shadow-md">
      {percentajes.data.map((item: any, index: number) => {
        if (item.quantity > 0) {
            return (
                <div key={index} className={`h-full flex items-center justify-center text-white text-sm font-semibold ${colors[index % colors.length]} transition-all duration-300 ease-in-out`}  style={{ width: `${item.quantity}%` }}>
                  {item.quantity}%
                </div>
              )
        }
        return 
      })}
    </div>
  );
}
