import React, { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface FinnhubTrade {
  p: number; // price
  s: string; // symbol
  t: number; // timestamp (ms)
  v: number; // volume
  c?: number | null;
}

interface DepthChartProps {
  selectedSymbolForDepthChart: string | null;
  isDarkTheme: boolean;
  closeDepthChartPopup: () => void;
  trades: FinnhubTrade[]; // trades for the selected symbol
  midPrice: number; // midPrice (e.g. current price from quotes)
}

const DepthChart: React.FC<DepthChartProps> = ({
  selectedSymbolForDepthChart,
  isDarkTheme,
  closeDepthChartPopup,
  trades,
  midPrice,
}) => {
  // 1) If no symbol is selected, render nothing.
  if (!selectedSymbolForDepthChart) return null;

  // 2) If no midPrice or trades, show a fallback message.
  if (!midPrice || trades.length === 0) {
    return (
      <div
        onClick={closeDepthChartPopup}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative p-2 w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto ${
            isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } rounded shadow-lg`}
        >
          <button
            onClick={closeDepthChartPopup}
            className={`absolute top-2 right-2 bg-transparent border-0 text-2xl cursor-pointer ${
              isDarkTheme ? "text-white" : "text-gray-900"
            }`}
          >
            ×
          </button>
          <h2 className="text-xl mb-4">
            Depth Chart - {selectedSymbolForDepthChart}
          </h2>
          <p>No data available to draw chart.</p>
        </div>
      </div>
    );
  }

  // 3) Process and memoize the chart data.
  const { cumulativeBuys, cumulativeSells, xMin, xMax, yMax } = useMemo(() => {
    const BIN_SIZE = 0.001;
    const binPrice = (price: number) => Math.round(price / BIN_SIZE) * BIN_SIZE;

    // Bin trades into buys and sells based on midPrice.
    const buyBins: Record<number, number> = {};
    const sellBins: Record<number, number> = {};

    trades.forEach((trade) => {
      const binned = binPrice(trade.p);
      if (trade.p < midPrice) {
        buyBins[binned] = (buyBins[binned] || 0) + trade.v;
      } else {
        sellBins[binned] = (sellBins[binned] || 0) + trade.v;
      }
    });

    // Convert bins to points.
    let buyPoints = Object.entries(buyBins).map(([price, vol]) => ({
      price: parseFloat(price),
      volume: vol as number,
    }));
    let sellPoints = Object.entries(sellBins).map(([price, vol]) => ({
      price: parseFloat(price),
      volume: vol as number,
    }));

    // Ensure at least two points per side for proper line rendering.
    if (buyPoints.length === 0) {
      buyPoints.push({ price: midPrice - BIN_SIZE, volume: 0 });
      buyPoints.push({ price: midPrice - 2 * BIN_SIZE, volume: 0 });
    } else if (buyPoints.length === 1) {
      buyPoints.push({
        price: buyPoints[0].price - BIN_SIZE,
        volume: buyPoints[0].volume,
      });
    }
    if (sellPoints.length === 0) {
      sellPoints.push({ price: midPrice + BIN_SIZE, volume: 0 });
      sellPoints.push({ price: midPrice + 2 * BIN_SIZE, volume: 0 });
    } else if (sellPoints.length === 1) {
      sellPoints.push({
        price: sellPoints[0].price + BIN_SIZE,
        volume: sellPoints[0].volume,
      });
    }

    // Sort: buys descending, sells ascending.
    buyPoints.sort((a, b) => b.price - a.price);
    sellPoints.sort((a, b) => a.price - b.price);

    // Compute cumulative volumes.
    let sum = 0;
    const cumulativeBuys = buyPoints.map((pt) => {
      sum += pt.volume;
      return { x: pt.price, y: sum };
    });
    sum = 0;
    const cumulativeSells = sellPoints.map((pt) => {
      sum += pt.volume;
      return { x: pt.price, y: sum };
    });

    // Determine maximum cumulative volume.
    const yMax = Math.max(
      ...cumulativeBuys.map((pt) => pt.y),
      ...cumulativeSells.map((pt) => pt.y)
    );

    // Set the x-axis domain to cover both sides.
    const buyMin = Math.min(...buyPoints.map((pt) => pt.price));
    const sellMax = Math.max(...sellPoints.map((pt) => pt.price));
    const xMin = Math.min(buyMin, midPrice);
    const xMax = Math.max(sellMax, midPrice);

    return { cumulativeBuys, cumulativeSells, xMin, xMax, yMax };
  }, [trades, midPrice]);

  // 4) Build the Chart.js data.
  const chartData = {
    datasets: [
      {
        label: "Bids",
        data: cumulativeBuys,
        borderColor: "rgba(255,0,0,1)",
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(255,0,0,0.2)";
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(255,0,0,0.2)");
          gradient.addColorStop(1, "rgba(255,0,0,0.4)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        order: 1,
      },
      {
        label: "Asks",
        data: cumulativeSells,
        borderColor: "rgba(0,255,0,1)",
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(0,255,0,0.2)";
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(0,255,0,0.2)");
          gradient.addColorStop(1, "rgba(0,255,0,0.4)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        order: 1,
      },
      {
        label: "Mid Price",
        data: [
          { x: midPrice, y: 0 },
          { x: midPrice, y: yMax },
        ],
        borderColor: "rgba(255,255,0,1)",
        borderWidth: 2,
        borderDash: [6, 6],
        fill: false,
        pointRadius: 0,
        order: 2,
      },
    ],
  };

  // 5) Chart.js options with explicit x-axis boundaries.
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    responsiveAnimationDuration: 0,
    scales: {
      x: {
        type: "linear" as const,
        min: xMin,
        max: xMax,
        title: {
          display: true,
          text: "Price",
          color: isDarkTheme ? "#fff" : "#000",
        },
        grid: {
          color: isDarkTheme ? "#555" : "#ccc",
        },
        ticks: {
          color: isDarkTheme ? "#fff" : "#000",
        },
      },
      y: {
        title: {
          display: true,
          text: "Cumulative Volume",
          color: isDarkTheme ? "#fff" : "#000",
        },
        grid: {
          color: isDarkTheme ? "#555" : "#ccc",
        },
        ticks: {
          color: isDarkTheme ? "#fff" : "#000",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkTheme ? "#fff" : "#000",
        },
      },
      title: {
        display: true,
        text: `Depth Chart (Approx)`,
        color: isDarkTheme ? "#fff" : "#000",
      },
    },
  };

  // 6) Render the popup & chart.
  return (
    <div
      style={{ zIndex: 1000 }}
      onClick={closeDepthChartPopup}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative p-2 w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto ${
          isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } rounded shadow-lg`}
      >
        <button
          onClick={closeDepthChartPopup}
          className={`absolute top-2 right-2 bg-transparent border-0 text-2xl cursor-pointer ${
            isDarkTheme ? "text-white" : "text-gray-900"
          }`}
        >
          ×
        </button>
        <div className="h-96 w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DepthChart;
