// DepthChartComponent.tsx
import React, {useMemo} from "react";
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
import {Line} from "react-chartjs-2";

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

/**
 * Depth Chart (approx) from trade data:
 * - Uses a very fine BIN_SIZE to bin trades.
 * - Splits into buy side (price < mid) and sell side (price >= mid).
 * - Ensures both sides always have at least one data point (fallback) so no side is missing.
 * - Computes cumulative volumes in a directional order:
 *     - Bids: sorted descending (from best bid downwards)
 *     - Asks: sorted ascending (from best ask upwards)
 * - Uses gradient fills with a tension value for a smooth curve representation.
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
        buyPoints.push({price: midPrice - BIN_SIZE, volume: 0});
    }
    if (sellPoints.length === 0) {
        // If no sells, add a fallback point just above midPrice.
        sellPoints.push({price: midPrice + BIN_SIZE, volume: 0});
    }

    // 5) Sort points:
    // - Bids (buys): descending order so that the curve starts at midPrice and extends leftwards.
    // - Asks (sells): ascending order so that the curve extends rightwards.
    buyPoints.sort((a, b) => b.price - a.price);
    sellPoints.sort((a, b) => a.price - b.price);

    // 6) Compute cumulative volumes for each side.
    // For bids, accumulate in descending order.
    const cumulativeBuys = useMemo(() => {
        let sum = 0;
        return buyPoints.map((pt) => {
            sum += pt.volume;
            return {x: pt.price, y: sum};
        });
    }, [buyPoints]);

    // For asks, accumulate in ascending order.
    const cumulativeSells = useMemo(() => {
        let sum = 0;
        return sellPoints.map((pt) => {
            sum += pt.volume;
            return {x: pt.price, y: sum};
        });
    }, [sellPoints]);

    // Determine maximum cumulative volume for y-axis range
    const yMax = Math.max(
        ...cumulativeBuys.map((pt) => pt.y),
        ...cumulativeSells.map((pt) => pt.y)
    );

    // 7) Build Chart.js data, including a dashed mid–price line.
    // Gradient fill functions adjust the background so that the bottom part is a bit darker.
    const chartData = {
        datasets: [
            {
                label: "Bids",
                data: cumulativeBuys,
                borderColor: "rgba(255,0,0,1)", // red
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return "rgba(255,0,0,0.2)";
                    const gradient = ctx.createLinearGradient(
                        0,
                        chartArea.top,
                        0,
                        chartArea.bottom
                    );
                    gradient.addColorStop(0, "rgba(255,0,0,0.2)");
                    gradient.addColorStop(1, "rgba(255,0,0,0.4)"); // darker at the bottom
                    return gradient;
                },
                fill: true,
                tension: 0.4, // smooth curve
                order: 1,
            },
            {
                label: "Asks",
                data: cumulativeSells,
                borderColor: "rgba(0,255,0,1)", // green
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return "rgba(0,255,0,0.2)";
                    const gradient = ctx.createLinearGradient(
                        0,
                        chartArea.top,
                        0,
                        chartArea.bottom
                    );
                    gradient.addColorStop(0, "rgba(0,255,0,0.2)");
                    gradient.addColorStop(1, "rgba(0,255,0,0.4)"); // darker at the bottom
                    return gradient;
                },
                fill: true,
                tension: 0.4, // smooth curve
                order: 1,
            },
            {
                label: "Mid Price",
                data: [
                    {x: midPrice, y: 0},
                    {x: midPrice, y: yMax},
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

    // 8) Chart.js options with animations disabled for stability.
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {duration: 0},
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

    // 9) Render the popup & chart.
    return (
        <div
            style={{zIndex: 1000}}
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
                    <Line data={chartData} options={chartOptions}/>
                </div>
            </div>
        </div>
    );
};

export default DepthChart;
