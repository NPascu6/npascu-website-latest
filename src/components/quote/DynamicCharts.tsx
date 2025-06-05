import React, {useState} from "react";
import DepthChart from "./DepthChartComponent";
import PriceHistoryChart from "./PriceHistoryChart";
import VolumeHistoryChart from "./VolumeHistoryChart";
import MovingAverageChart from "./MovingAverageChart";
import PriceVolumeChart from "./PriceVolumeChart";
import {availableSymbols, FinnhubQuote} from "./QuoteComponent";
import {FinnhubTrade} from "./types";

interface DynamicChartsProps {
    priceHistory: { [symbol: string]: { t: number; p: number }[] };
    volumeHistory: { [symbol: string]: { t: number; v: number }[] };
    orderBooks: { [symbol: string]: FinnhubTrade[] };
    quotes: { [symbol: string]: { quote: FinnhubQuote } };
    isDarkTheme: boolean;
    initialSymbol?: string;
}

const chartOptions = [
    "Price History",
    "Volume History",
    "Depth Chart",
    "Moving Average",
    "Price & Volume",
] as const;
type ChartType = typeof chartOptions[number];

const DynamicCharts: React.FC<DynamicChartsProps> = ({priceHistory, volumeHistory, orderBooks, quotes, isDarkTheme, initialSymbol}) => {
    const [selectedSymbol, setSelectedSymbol] = useState<string>(initialSymbol || availableSymbols[0]);
    const [chartType, setChartType] = useState<ChartType>("Price History");

    const renderChart = () => {
        switch (chartType) {
            case "Price History":
                return <PriceHistoryChart history={priceHistory[selectedSymbol] || []} isDarkTheme={isDarkTheme}/>;
            case "Volume History":
                return <VolumeHistoryChart history={volumeHistory[selectedSymbol] || []} isDarkTheme={isDarkTheme}/>;
            case "Depth Chart":
                return (
                    <DepthChart
                        selectedSymbolForDepthChart={selectedSymbol}
                        isDarkTheme={isDarkTheme}
                        closeDepthChartPopup={() => {}}
                        trades={orderBooks[selectedSymbol] || []}
                        midPrice={quotes[selectedSymbol]?.quote.c || 0}
                    />
                );
            case "Moving Average":
                return <MovingAverageChart history={priceHistory[selectedSymbol] || []} isDarkTheme={isDarkTheme}/>;
            case "Price & Volume":
                return (
                    <PriceVolumeChart
                        priceHistory={priceHistory[selectedSymbol] || []}
                        volumeHistory={volumeHistory[selectedSymbol] || []}
                        isDarkTheme={isDarkTheme}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <div className="flex space-x-2 mb-2">
                <select
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="p-1 text-black"
                >
                    {availableSymbols.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as ChartType)}
                    className="p-1 text-black"
                >
                    {chartOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>
            <div className="h-80 w-full flex items-center justify-center">
                {renderChart()}
            </div>
        </div>
    );
};

export default DynamicCharts;
