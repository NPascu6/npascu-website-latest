import React, {useMemo} from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {Line} from "react-chartjs-2";
import {PricePoint} from "./PriceHistoryChart";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MovingAverageChartProps {
    history: PricePoint[];
    windowSize?: number;
    isDarkTheme: boolean;
}

const MovingAverageChart: React.FC<MovingAverageChartProps> = ({history, windowSize = 5, isDarkTheme}) => {
    const chartData = useMemo(() => {
        const labels = history.map((h) => new Date(h.t).toLocaleTimeString());
        const prices = history.map((h) => h.p);
        const movingAvg: number[] = [];
        for (let i = 0; i < prices.length; i++) {
            const start = Math.max(0, i - windowSize + 1);
            const subset = prices.slice(start, i + 1);
            const avg = subset.reduce((a, b) => a + b, 0) / subset.length;
            movingAvg.push(avg);
        }
        return {
            labels,
            datasets: [
                {
                    label: "Price",
                    data: prices,
                    borderColor: "rgba(75,192,192,1)",
                    backgroundColor: "rgba(75,192,192,0.2)",
                    fill: false,
                    tension: 0.1,
                },
                {
                    label: `${windowSize}-Period SMA`,
                    data: movingAvg,
                    borderColor: "rgba(255,99,132,1)",
                    backgroundColor: "rgba(255,99,132,0.2)",
                    fill: false,
                    tension: 0.1,
                },
            ],
        };
    }, [history, windowSize]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {color: isDarkTheme ? "#fff" : "#000"},
            },
            y: {
                ticks: {color: isDarkTheme ? "#fff" : "#000"},
            },
        },
        plugins: {
            legend: {
                labels: {color: isDarkTheme ? "#fff" : "#000"},
            },
        },
    } as const;

    if (history.length === 0) {
        return <div className="p-4">No data to display.</div>;
    }

    return (
        <div className="h-80 w-full">
            <Line data={chartData} options={options}/>
        </div>
    );
};

export default MovingAverageChart;
