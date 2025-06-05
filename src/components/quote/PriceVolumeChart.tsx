import React, {useMemo} from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import {PricePoint} from "./PriceHistoryChart";
import {VolumePoint} from "./VolumeHistoryChart";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface PriceVolumeChartProps {
    priceHistory: PricePoint[];
    volumeHistory: VolumePoint[];
    isDarkTheme: boolean;
}

const PriceVolumeChart: React.FC<PriceVolumeChartProps> = ({priceHistory, volumeHistory, isDarkTheme}) => {
    const chartData = useMemo(() => {
        const labels = priceHistory.map((p) => new Date(p.t).toLocaleTimeString());
        return {
            labels,
            datasets: [
                {
                    label: "Price",
                    type: "line" as const,
                    data: priceHistory.map((p) => p.p),
                    borderColor: "rgba(75,192,192,1)",
                    backgroundColor: "rgba(75,192,192,0.2)",
                    yAxisID: 'y1',
                },
                {
                    label: "Volume",
                    type: "bar" as const,
                    data: volumeHistory.map((v) => v.v),
                    backgroundColor: "rgba(153,102,255,0.5)",
                    yAxisID: 'y2',
                },
            ],
        };
    }, [priceHistory, volumeHistory]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {color: isDarkTheme ? '#fff' : '#000'},
            },
            y1: {
                type: 'linear' as const,
                position: 'left' as const,
                ticks: {color: isDarkTheme ? '#fff' : '#000'},
            },
            y2: {
                type: 'linear' as const,
                position: 'right' as const,
                grid: {drawOnChartArea: false},
                ticks: {color: isDarkTheme ? '#fff' : '#000'},
            },
        },
        plugins: {
            legend: {labels: {color: isDarkTheme ? '#fff' : '#000'}},
        },
    } as const;

    if (priceHistory.length === 0 || volumeHistory.length === 0) {
        return <div className="p-4">No data to display.</div>;
    }

    return (
        <div className="h-80 w-full">
            <Chart type='bar' data={chartData} options={options} />
        </div>
    );
};

export default PriceVolumeChart;
