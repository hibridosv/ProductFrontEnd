
'use client'
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getData } from '@/services/resources';
import { Loading } from '../loading/loading';

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};


interface DaysOfWeek {
    label: string;
    value: number;
}



export function CharBarWeek(){

const [isLoading, setIsLoading] = useState(false);
const [dataOfBar, setDataOfBar] = useState<DaysOfWeek[]>([]);


const loadDataOFBar = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`dashboard/char-week`);
      setDataOfBar(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
        (async () => await loadDataOFBar() )()
    // eslint-disable-next-line
  }, []);
  
  if (isLoading) return <Loading />
  if (!dataOfBar) return null;
  
  const data = {
    labels: dataOfBar.map(item => item.label),
    datasets: [
      {
        label: 'Dias de la semana',
        data: dataOfBar.map(item => item.value),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ],
  };

  return (
            <Bar options={options} data={data}  />
        );

}
