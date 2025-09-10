import React, {useMemo} from "react";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    Filler,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import type {ChartData} from "chart.js";
import {Line} from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

import {FinnhubTrade} from "./types";

interface DepthChartProps {
    selectedSymbolForDepthChart: string | null;
    isDarkTheme: boolean;
    closeDepthChartPopup: () => void;
    trades: FinnhubTrade[]; // trades for the selected symbol
    midPrice: number; // midPrice (e.g. current price from quotes)
    inline?: boolean; // render inline instead of popup
}

const DepthChart: React.FC<DepthChartProps> = ({
    selectedSymbolForDepthChart,
    isDarkTheme,
    closeDepthChartPopup,
    trades,
    midPrice,
    inline = false,
}) => {
    // 1) If no symbol is selected, render nothing.
    if (!selectedSymbolForDepthChart) return null;

    // Derive a mid price primarily from order book data
    const effectiveMidPrice = useMemo(() => {
        if (trades.length) {
            const bidPrices = trades
                .filter((t) => (t.side ? t.side === "bid" : true))
                .map((t) => t.p);
            const askPrices = trades
                .filter((t) => (t.side ? t.side === "ask" : false))
                .map((t) => t.p);
            if (bidPrices.length && askPrices.length) {
                const bestBid = Math.max(...bidPrices);
                const bestAsk = Math.min(...askPrices);
                return (bestBid + bestAsk) / 2;
            }
            const all = trades.map((t) => t.p);
            return all.reduce((a, b) => a + b, 0) / all.length;
        }
        return midPrice;
    }, [midPrice, trades]);

    // 2) If no trades, show a fallback message.
    if (trades.length === 0) {
        if (inline) {
            return (
                <div className="h-full w-full flex items-center justify-center">
                    <p>No data available to draw chart.</p>
                </div>
            );
        }
        return (
            <div
                onClick={closeDepthChartPopup}
                className={`fixed inset-0 flex justify-center items-center z-50 ${
                    isDarkTheme ? "bg-gray-900 bg-opacity-75" : "bg-gray-300 bg-opacity-75"
                }`}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`depth-chart-popup relative p-2 w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto ${
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
    const {cumulativeBuys, cumulativeSells, xMin, xMax, yMax} = useMemo(() => {
        // Separate trades into bids and asks using the side property when
        // available. If side is missing fall back to midPrice comparison.
        const bids = trades.filter((t) =>
            t.side ? t.side === "bid" : t.p < effectiveMidPrice
        );
        const asks = trades.filter((t) =>
            t.side ? t.side === "ask" : t.p >= effectiveMidPrice
        );

        // Sort them like the order book (bids desc, asks asc)
        bids.sort((a, b) => b.p - a.p);
        asks.sort((a, b) => a.p - b.p);

        // Compute cumulative volumes based on each individual trade to
        // keep the same granularity as the order book.
        let sum = 0;
        const cumulativeBuys = bids.map((trade) => {
            sum += trade.v;
            return {x: trade.p, y: sum};
        });
        const lastBid = cumulativeBuys[cumulativeBuys.length - 1]?.y || 0;
        sum = 0;
        const cumulativeSells = asks.map((trade) => {
            sum += trade.v;
            return {x: trade.p, y: sum};
        });

        // Anchor datasets at the mid price so bid/ask areas don't overlap
        if (cumulativeBuys.length === 0) {
            cumulativeBuys.push(
                {x: effectiveMidPrice - 0.0001, y: 0},
                {x: effectiveMidPrice, y: 0}
            );
        } else {
            cumulativeBuys.push({x: effectiveMidPrice, y: lastBid});
        }

        if (cumulativeSells.length === 0) {
            cumulativeSells.push(
                {x: effectiveMidPrice, y: 0},
                {x: effectiveMidPrice + 0.0001, y: 0}
            );
        } else {
            cumulativeSells.unshift({x: effectiveMidPrice, y: 0});
        }

        // Determine max cumulative volume for scaling.
        const yMax = Math.max(
            ...cumulativeBuys.map((pt) => pt.y),
            ...cumulativeSells.map((pt) => pt.y)
        );

        const xMin = bids.length
            ? Math.min(bids[bids.length - 1].p, effectiveMidPrice)
            : effectiveMidPrice;
        const xMax = asks.length
            ? Math.max(asks[asks.length - 1].p, effectiveMidPrice)
            : effectiveMidPrice;
        return {cumulativeBuys, cumulativeSells, xMin, xMax, yMax};
    }, [trades, effectiveMidPrice]);

    // 4) Build the Chart.js data.
    const chartData: ChartData<"line", {x: number; y: number}[], unknown> = {
        datasets: [
            {
                label: "Bids",
                data: cumulativeBuys,
                borderColor: "rgba(0,255,0,1)",
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
                    gradient.addColorStop(1, "rgba(0,255,0,0.4)");
                    return gradient;
                },
                fill: true,
                pointRadius: 0,
                stepped: "after" as const,
                tension: 0,
                order: 1,
            },
            {
                label: "Asks",
                data: cumulativeSells,
                borderColor: "rgba(255,0,0,1)",
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
                    gradient.addColorStop(1, "rgba(255,0,0,0.4)");
                    return gradient;
                },
                fill: true,
                pointRadius: 0,
                stepped: "before" as const,
                tension: 0,
                order: 1,
            },
            {
                label: "Mid Price",
                data: [
                    {x: effectiveMidPrice, y: 0},
                    {x: effectiveMidPrice, y: yMax},
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
        animation: {duration: 0},
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
    if (inline) {
        return (
            <div className="h-full w-full">
                <Line data={chartData} options={chartOptions} />
            </div>
        );
    }

    return (
        <div
            style={{zIndex: 1000}}
            onClick={closeDepthChartPopup}
            className={`fixed inset-0 flex justify-center items-center z-50 ${
                isDarkTheme ? "bg-gray-900 bg-opacity-75" : "bg-gray-300 bg-opacity-75"
            }`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`depth-chart-popup relative p-2 w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto ${
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
