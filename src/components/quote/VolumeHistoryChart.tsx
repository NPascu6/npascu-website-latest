import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface VolumePoint {
    t: number;
    v: number;
}

interface VolumeHistoryChartProps {
    history: VolumePoint[];
    isDarkTheme: boolean;
}

const VolumeHistoryChart: React.FC<VolumeHistoryChartProps> = ({ history, isDarkTheme }) => {
    const chartData = useMemo(() => {
        return {
            labels: history.map((h) => new Date(h.t).toLocaleTimeString()),
            datasets: [
                {
                    label: "Volume",
                    data: history.map((h) => h.v),
                    backgroundColor: "rgba(153,102,255,0.5)",
                },
            ],
        };
    }, [history]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: { color: isDarkTheme ? "#fff" : "#000" },
            },
            y: {
                ticks: { color: isDarkTheme ? "#fff" : "#000" },
            },
        },
        plugins: {
            legend: {
                labels: { color: isDarkTheme ? "#fff" : "#000" },
            },
        },
    } as const;

    if (history.length === 0) {
        return <div className="p-4">No data to display.</div>;
    }

    return (
        <div className="h-80 w-full volume-history-popup">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default VolumeHistoryChart;
