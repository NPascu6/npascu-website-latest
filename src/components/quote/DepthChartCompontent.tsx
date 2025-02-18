// DepthChartCompontent.tsx

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
 * Basic Depth Chart (approx) from trade data:
 *  - Bins trades by price (BIN_SIZE).
 *  - Splits into buy side (price < mid) & sell side (price >= mid).
 *  - Sort each side by ascending price, accumulate volumes, create a stair-step line.
 *  - One line for bids, one line for asks, meeting around the midPrice.
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

    // If midPrice is zero or trades is empty, we can't draw anything meaningful
    if (!midPrice || trades.length === 0) {
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
                        Depth Chart - {selectedSymbolForDepthChart}
                    </h2>
                    <p>No data available to draw chart.</p>
                </div>
            </div>
        );
    }

    // Binning
    const BIN_SIZE = 0.5;
    const binPrice = (price: number) => Math.round(price / BIN_SIZE) * BIN_SIZE;

    // Build bins for buys and sells
    const buyBins: Record<number, number> = {};
    const sellBins: Record<number, number> = {};

    trades.forEach((trade) => {
        const binnedPrice = binPrice(trade.p);
        if (trade.p < midPrice) {
            // buy side
            buyBins[binnedPrice] = (buyBins[binnedPrice] || 0) + trade.v;
        } else {
            // sell side
            sellBins[binnedPrice] = (sellBins[binnedPrice] || 0) + trade.v;
        }
    });

    // Convert bins to arrays & sort ascending by price
    const buyPoints = Object.entries(buyBins).map(([price, vol]) => ({
        price: parseFloat(price),
        volume: vol as number,
    }));
    const sellPoints = Object.entries(sellBins).map(([price, vol]) => ({
        price: parseFloat(price),
        volume: vol as number,
    }));

    buyPoints.sort((a, b) => a.price - b.price);
    sellPoints.sort((a, b) => a.price - b.price);

    // Compute cumulative volumes for each side
    // For buys, the typical approach is to accumulate from low price to high
    // so that at each point, we have total volume up to that price
    const cumulativeBuys = useMemo(() => {
        let sum = 0;
        return buyPoints.map((pt) => {
            sum += pt.volume;
            return { x: pt.price, y: sum };
        });
    }, [buyPoints]);

    // For sells, same approach: from low ask to higher ask
    const cumulativeSells = useMemo(() => {
        let sum = 0;
        return sellPoints.map((pt) => {
            sum += pt.volume;
            return { x: pt.price, y: sum };
        });
    }, [sellPoints]);

    // Chart.js data
    const chartData = {
        datasets: [
            {
                label: "Bids",
                data: cumulativeBuys,
                borderColor: "rgba(255,0,0,1)",     // red line
                backgroundColor: "rgba(255,0,0,0.2)",
                fill: true,
                stepped: true, // stair-step
            },
            {
                label: "Asks",
                data: cumulativeSells,
                borderColor: "rgba(0,255,0,1)",    // green line
                backgroundColor: "rgba(0,255,0,0.2)",
                fill: true,
                stepped: true, // stair-step
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "linear" as const,
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
                <div className="h-96 w-full">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default DepthChart;
