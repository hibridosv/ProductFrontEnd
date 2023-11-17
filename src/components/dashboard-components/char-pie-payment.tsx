
'use client'
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getData } from '@/services/resources';
import { Loading } from '../loading/loading';

ChartJS.register(ArcElement, Tooltip, Legend);




interface PaymentTypes {
    label: string;
    value: number;
}



export function CharPiePayment(){

const [isLoading, setIsLoading] = useState(false);
const [dataOfBar, setDataOfBar] = useState<PaymentTypes[]>([]);


// const loadDataOFBar = async () => {
//     setIsLoading(true);
//     try {
//       const response = await getData(`dashboard/char-week`);
//       setDataOfBar(response.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };



//   useEffect(() => {
//         (async () => await loadDataOFBar() )()
//     // eslint-disable-next-line
//   }, []);

    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
        {
            label: 'Tipo de pago',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
        ],
    };


  if (isLoading) return <Loading />

  return (
            <Pie data={data} />
        );

}
