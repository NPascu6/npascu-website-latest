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
 * Depth Chart (approx) from trade data:
 * - Uses a very fine BIN_SIZE to bin trades.
 * - Splits into buy side (price < mid) and sell side (price >= mid).
 * - Ensures both sides always have at least one data point (fallback) so no side is missing.
 * - Accumulates volumes to create a stair-step line for each side.
 * - Adds a dashed vertical mid–price line.
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

    // 2) If no midPrice or no trades at all, show fallback message
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

    // 3) Bin trades by price with a very fine bin for increased granularity
    const BIN_SIZE = 0.001; // Very fine granularity
    const binPrice = (price: number) => Math.round(price / BIN_SIZE) * BIN_SIZE;

    // Separate into buy vs. sell bins
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

    // Convert bins to arrays of { price, volume }
    let buyPoints = Object.entries(buyBins).map(([price, vol]) => ({
        price: parseFloat(price),
        volume: vol as number,
    }));
    let sellPoints = Object.entries(sellBins).map(([price, vol]) => ({
        price: parseFloat(price),
        volume: vol as number,
    }));

    // 4) Ensure both sides have at least one data point.
    if (buyPoints.length === 0) {
        // If no buys, add a fallback point just below midPrice.
        buyPoints.push({ price: midPrice - BIN_SIZE, volume: 0 });
    }
    if (sellPoints.length === 0) {
        // If no sells, add a fallback point just above midPrice.
        sellPoints.push({ price: midPrice + BIN_SIZE, volume: 0 });
    }

    // 5) Sort: buys in ascending order (low→high), sells in descending order (high→low)
    buyPoints.sort((a, b) => a.price - b.price);
    sellPoints.sort((a, b) => b.price - a.price);

    // 6) Compute cumulative volumes for each side
    const cumulativeBuys = useMemo(() => {
        let sum = 0;
        return buyPoints.map((pt) => {
            sum += pt.volume;
            return { x: pt.price, y: sum };
        });
    }, [buyPoints]);

    const cumulativeSells = useMemo(() => {
        let sum = 0;
        return sellPoints.map((pt) => {
            sum += pt.volume;
            return { x: pt.price, y: sum };
        });
    }, [sellPoints]);

    // Determine maximum cumulative volume for y-axis range
    const yMax = Math.max(
        ...cumulativeBuys.map((pt) => pt.y),
        ...cumulativeSells.map((pt) => pt.y)
    );

    // 7) Build Chart.js data, including a dashed mid–price line
    const chartData = {
        datasets: [
            {
                label: "Bids",
                data: cumulativeBuys,
                borderColor: "rgba(255,0,0,1)", // red
                backgroundColor: "rgba(255,0,0,0.2)",
                fill: true,
                stepped: true,
                order: 1,
            },
            {
                label: "Asks",
                data: cumulativeSells,
                borderColor: "rgba(0,255,0,1)", // green
                backgroundColor: "rgba(0,255,0,0.2)",
                fill: true,
                stepped: true,
                order: 1,
            },
            {
                label: "Mid Price",
                data: [
                    { x: midPrice, y: 0 },
                    { x: midPrice, y: yMax },
                ],
                borderColor: "rgba(255,255,0,1)", // yellow
                borderWidth: 2,
                borderDash: [6, 6],
                fill: false,
                pointRadius: 0,
                order: 2,
            },
        ],
    };

    // 8) Chart.js options with animations disabled for stability
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        responsiveAnimationDuration: 0,
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
                    // Uncomment and adjust if needed:
                    // stepSize: BIN_SIZE * 10,
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

    // 9) Render the popup & chart
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
