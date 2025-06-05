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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export interface PricePoint {
    t: number;
    p: number;
}

interface PriceHistoryChartProps {
    history: PricePoint[];
    isDarkTheme: boolean;
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({history, isDarkTheme}) => {
    const chartData = useMemo(() => {
        return {
            labels: history.map((h) => new Date(h.t).toLocaleTimeString()),
            datasets: [
                {
                    label: "Price",
                    data: history.map((h) => h.p),
                    borderColor: "rgba(75,192,192,1)",
                    backgroundColor: "rgba(75,192,192,0.2)",
                    fill: false,
                    tension: 0.1,
                },
            ],
        };
    }, [history]);

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
        <div className="h-80 w-full price-history-popup">
            <Line data={chartData} options={options}/>
        </div>
    );
};

export default PriceHistoryChart;
