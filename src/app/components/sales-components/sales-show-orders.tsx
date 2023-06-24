'use client'
import { useState, useEffect } from "react";
import { getData } from "@/services/resources";
import { Loading } from "../loading/loading";
import { ListGroup } from "flowbite-react";

export interface SalesShowOrdersProps {
    onClick: (option: any) => void;
}

export function SalesShowOrders(props: SalesShowOrdersProps) {
  const { onClick } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]) as any;
  
  const loadAllOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`sales`);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    (async () => { await loadAllOrders() })();
  // eslint-disable-next-line
  }, []);

  if (isLoading) return <Loading />


  return (
    <div className='mx-3 sm:mt-3'>
    <ListGroup>
      <ListGroup.Item active >
        ORDENES PENDIENTES
      </ListGroup.Item>

      {orders.map((order: any, index: any) => (
                <ListGroup.Item key={index} onClick={()=>onClick(order.id)}>
                {order.employee.name}
                </ListGroup.Item>
            ))}      
    </ListGroup>
    </div>
    );
}
