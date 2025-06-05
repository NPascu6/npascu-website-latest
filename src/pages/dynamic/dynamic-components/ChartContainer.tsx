import React, {useMemo} from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {Bar} from "react-chartjs-2";
import {tables} from "../../../assets/tableDb";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ChartContainer: React.FC = () => {
    const counts = useMemo(() => {
        const table = tables.find((t) => t.id === 1);
        if (!table) return {} as Record<string, number>;
        const result: Record<string, number> = {};
        table.data.forEach((row: any) => {
            const dept = row.department || "Unknown";
            result[dept] = (result[dept] || 0) + 1;
        });
        return result;
    }, []);

    const data = useMemo(() => {
        return {
            labels: Object.keys(counts),
            datasets: [
                {
                    label: "Employees by Department",
                    data: Object.values(counts),
                    backgroundColor: "rgba(75,192,192,0.6)",
                },
            ],
        };
    }, [counts]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    } as const;

    return (
        <div className="h-64 w-full">
            <Bar data={data} options={options}/>
        </div>
    );
};

export default ChartContainer;
