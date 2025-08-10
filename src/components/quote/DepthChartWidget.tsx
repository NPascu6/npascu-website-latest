import React, {useMemo} from 'react';
import {Line} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {useMarketStream} from '../../hooks/useMarketStream';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

interface Props {
  symbol: string;
  depth: number;
  isDarkTheme: boolean;
}

const DepthChartWidget: React.FC<Props> = ({symbol, depth, isDarkTheme}) => {
  const {book} = useMarketStream(symbol, depth);
  const {bids, asks} = book;

  const data = useMemo(() => {
    let sum = 0;
    const bidPoints = bids
      .slice()
      .sort((a, b) => b.price - a.price)
      .map(b => ({x: b.price, y: (sum += b.size)}))
      .reverse();
    sum = 0;
    const askPoints = asks
      .slice()
      .sort((a, b) => a.price - b.price)
      .map(a => ({x: a.price, y: (sum += a.size)}));
    return {bidPoints, askPoints};
  }, [bids, asks]);

  const chartData = {
    datasets: [
      {
        label: 'Bids',
        data: data.bidPoints,
        borderColor: 'rgba(0,200,5,0.8)',
        backgroundColor: 'rgba(0,200,5,0.2)',
        stepped: true,
        fill: true,
      },
      {
        label: 'Asks',
        data: data.askPoints,
        borderColor: 'rgba(200,0,0,0.8)',
        backgroundColor: 'rgba(200,0,0,0.2)',
        stepped: true,
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: {type: 'linear', ticks: {color: isDarkTheme ? '#fff' : '#000'}},
      y: {ticks: {color: isDarkTheme ? '#fff' : '#000'}},
    },
  } as const;

  return <Line data={chartData} options={options} />;
};

export default DepthChartWidget;
