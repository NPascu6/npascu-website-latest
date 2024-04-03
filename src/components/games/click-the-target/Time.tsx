const Time: React.FC<{ time: number }> = ({ time }) => (
    <div className="m-4 p-2 text-lg font-bold text-white bg-blue-500">
        Time: {time.toFixed(2)}
    </div>
);

export default Time;