import { FiTrendingUp } from "react-icons/fi";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";

type Props = {
  evCountByYear: Record<string, number>;
};

const ActivityGraph = (props: Props) => {
  const { evCountByYear } = props;

  const chartData = Object.entries(evCountByYear).map(([year, count]) => ({
    year,
    count,
  }));

  return (
    <div className="col-span-12 overflow-hidden rounded-lg border border-stone-300 shadow">
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="flex items-center gap-1.5 font-semibold text-2xl">
            Electric Vehicle Growth Trends
          </h3>
          <p className="text-stone-500 mb-2 text-sm">
            Historical EV Population Analysis (1998-2024)
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
          <FiTrendingUp className="h-5 w-5 text-green-600" />
          <span className="text-green-700 font-semibold">+29.73% CAGR</span>
        </div>
      </div>

      <div className="h-[50vh] px-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              opacity={0.7}
            />
            <XAxis
              dataKey="year"
              className="text-xs font-bold"
              tick={{ fill: "#4b5563" }}
              tickLine={{ stroke: "#9ca3af" }}
              axisLine={{ stroke: "#9ca3af" }}
              tickMargin={8}
            />
            <YAxis
              className="text-xs font-bold"
              tick={{ fill: "#4b5563" }}
              tickLine={{ stroke: "#9ca3af" }}
              axisLine={{ stroke: "#9ca3af" }}
              tickFormatter={(value) => `${value.toLocaleString()}`}
              tickMargin={8}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                padding: "12px",
              }}
              formatter={(value) => [
                `${value.toLocaleString()} vehicles`,
                "Total EVs",
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Line
              type="linear"
              dataKey="count"
              stroke="#0AB2DE"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#0AB2DE",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4">
        <p className="text-stone-500 mb-2 text-sm italic">
          Data shows compound annual growth rate (CAGR) in electric vehicle
          adoption over the past decades
        </p>
      </div>
    </div>
  );
};

export default ActivityGraph;
