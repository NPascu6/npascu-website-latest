// DepthChart.tsx
import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title,
    Legend,
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

// Same trade interface you used in your code
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
    midPrice: number;       // midPrice (e.g. current price from quotes)
}

/**
 * Basic Depth Chart (approx) from trade data.
 * - We bin trades by price, separate them into buys (price < mid) & sells (price >= mid).
 * - Then we compute cumulative volume on each side to emulate "depth."
 * - Display two line areas (one for buys, one for sells).
 * - Shown in a popup overlay (similar to OrderBook).
 */
const DepthChart: React.FC<DepthChartProps> = ({
    selectedSymbolForDepthChart,
    isDarkTheme,
    closeDepthChartPopup,
    trades,
    midPrice,
}) => {
    // If no symbol is selected, hide the popup entirely
    if (!selectedSymbolForDepthChart) return null;

    // Adjust this bin size as desired
    const BIN_SIZE = 0.5;

    // Binning function — round price to nearest BIN_SIZE
    const binPrice = (price: number) =>
        Math.round(price / BIN_SIZE) * BIN_SIZE;

    // Separate trades into buy vs sell bins
    const sellBins: Record<number, number> = {};
    const buyBins: Record<number, number> = {};

    trades.forEach((trade) => {
        const binned = binPrice(trade.p);
        if (trade.p >= midPrice) {
            sellBins[binned] = (sellBins[binned] || 0) + trade.v;
        } else {
            buyBins[binned] = (buyBins[binned] || 0) + trade.v;
        }
    });

    // Convert bin objects into sorted arrays, then compute cumulative volumes
    const sellData = useMemo(() => {
        const entries = Object.entries(sellBins).map(([price, vol]) => [
            parseFloat(price),
            vol,
        ]);
        // Sort by ascending price
        entries.sort((a, b) => a[0] - b[0]);

        let cumulative = 0;
        return entries.map(([price, volume]) => {
            cumulative += volume;
            return { x: price, y: cumulative };
        });
    }, [trades, midPrice]);

    const buyData = useMemo(() => {
        const entries = Object.entries(buyBins).map(([price, vol]) => [
            parseFloat(price),
            vol,
        ]);
        // Sort by ascending price
        entries.sort((a, b) => a[0] - b[0]);

        let cumulative = 0;
        return entries.map(([price, volume]) => {
            cumulative += volume;
            return { x: price, y: cumulative };
        });
    }, [trades, midPrice]);

    // Final chart data
    const chartData = {
        datasets: [
            {
                label: "Buys",
                data: buyData,
                borderColor: "rgba(255, 0, 0, 1)",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                fill: true,
                tension: 0.1,
            },
            {
                label: "Sells",
                data: sellData,
                borderColor: "rgba(0, 255, 0, 1)",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                fill: true,
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows the chart to grow/shrink responsively
        scales: {
            x: {
                type: "linear" as const, // numeric axis
                title: {
                    display: true,
                    text: "Price",
                    color: isDarkTheme ? "#fff" : "#000",
                },
                grid: {
                    color: isDarkTheme ? "#444" : "#ccc",
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
                    color: isDarkTheme ? "#444" : "#ccc",
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
        },
    };

    return (
        <div
            onClick={closeDepthChartPopup}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative p-2 w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                    } rounded shadow-lg`}
            >
                <button
                    onClick={closeDepthChartPopup}
                    className={`absolute top-2 right-2 bg-transparent border-0 text-2xl cursor-pointer ${isDarkTheme ? "text-white" : "text-gray-900"
                        }`}
                >
                    ×
                </button>
                <h2 className="text-xl mb-4">
                    Depth Chart - {selectedSymbolForDepthChart} (Approx)
                </h2>
                {/* Chart container, ensures responsive resizing */}
                <div className="h-96 w-full">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default DepthChart;
