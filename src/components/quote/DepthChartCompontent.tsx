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
 *  - Sort BUY side ascending (lowest→highest price),
 *    but SELL side descending (highest→lowest price) for a "pyramid" look.
 *  - Accumulate volumes to create a stair-step line for each side.
 */
const DepthChart: React.FC<DepthChartProps> = ({
    selectedSymbolForDepthChart,
    isDarkTheme,
    closeDepthChartPopup,
    trades,
    midPrice,
}) => {
    // 1) Return null if no symbol is selected
    if (!selectedSymbolForDepthChart) return null;

    // 2) If no midPrice or no trades, show fallback
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
                    <h2 className="text-xl mb-4">Depth Chart - {selectedSymbolForDepthChart}</h2>
                    <p>No data available to draw chart.</p>
                </div>
            </div>
        );
    }

    // 3) Bin trades by price
    const BIN_SIZE = 0.5;
    const binPrice = (price: number) => Math.round(price / BIN_SIZE) * BIN_SIZE;

    // Separate into buy vs sell bins
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

    // Convert bins to arrays
    const buyPoints = Object.entries(buyBins).map(([price, vol]) => ({
        price: parseFloat(price),
        volume: vol as number,
    }));
    const sellPoints = Object.entries(sellBins).map(([price, vol]) => ({
        price: parseFloat(price),
        volume: vol as number,
    }));

    // 4) Sort: buys ascending, sells descending (for "reverse" effect)
    buyPoints.sort((a, b) => a.price - b.price);   // low→high
    sellPoints.sort((a, b) => b.price - a.price);  // high→low

    // 5) Compute cumulative volumes
    // Buys: ascending price => accumulate from bottom up
    const cumulativeBuys = useMemo(() => {
        let sum = 0;
        return buyPoints.map((pt) => {
            sum += pt.volume;
            return { x: pt.price, y: sum };
        });
    }, [buyPoints]);

    // Sells: descending price => accumulate from top down
    // This will yield a reversed array in terms of price,
    // so the line is drawn from right (high price) to left (mid).
    const cumulativeSells = useMemo(() => {
        let sum = 0;
        return sellPoints.map((pt) => {
            sum += pt.volume;
            return { x: pt.price, y: sum };
        });
    }, [sellPoints]);

    // 6) Chart.js data
    const chartData = {
        datasets: [
            {
                label: "Bids",
                data: cumulativeBuys,
                borderColor: "rgba(255,0,0,1)", // red
                backgroundColor: "rgba(255,0,0,0.2)",
                fill: true,
                stepped: true, // stair-step
            },
            {
                label: "Asks",
                data: cumulativeSells,
                borderColor: "rgba(0,255,0,1)", // green
                backgroundColor: "rgba(0,255,0,0.2)",
                fill: true,
                stepped: true,
            },
        ],
    };

    // 7) Chart.js options
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
                // If you REALLY want the highest price on the left, uncomment this:
                // reverse: true
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

    // 8) Render the popup & chart
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
