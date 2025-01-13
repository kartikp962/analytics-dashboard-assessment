import { useEffect, useState } from "react";
import { FiTrendingUp } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SelectComponent from "./SelectComponent";

type Props = {
  rangeByMakeModelAndYear: Record<string, Record<string, number>>;
};

const BarChartComponent = (props: Props) => {
  const { rangeByMakeModelAndYear } = props;
  const [selectedModel, setSelectedModel] = useState<string>(
    Object.keys(rangeByMakeModelAndYear)[0]
  );

  useEffect(() => {
    setSelectedModel(Object.keys(rangeByMakeModelAndYear)[2]);
  }, [rangeByMakeModelAndYear]);

  const chartData =
    rangeByMakeModelAndYear[selectedModel] &&
    Object.entries(rangeByMakeModelAndYear[selectedModel]).map(
      ([year, count]) => ({
        year,
        Range: count,
      })
    );

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Record<string, any>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium">{payload[0].payload.year}</p>
          <p className="text-custom-blue">Range : {payload[0].value} miles</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="col-span-12 overflow-hidden rounded-lg border border-stone-300 shadow">
      <div className="p-4 flex items-center justify-between">
        <div className="">
          <h3 className="flex items-center gap-1.5 text-2xl font-semibold">
            Range Increase by Year
          </h3>
          <p className="text-stone-500 mb-2 text-sm">
            Yearly Range Growth for the Selected EV Model
          </p>
        </div>
        <SelectComponent
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          rangeByMakeModelAndYear={rangeByMakeModelAndYear}
        />
      </div>

      <div className="px-4 h-[50vh]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fill: "#666" }} tickLine={false} />
            <YAxis
              tick={{ fill: "#666" }}
              tickLine={false}
              domain={["auto", "dataMax + 5"]}
              tickCount={9}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Range" fill="#07B5DB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center space-x-3 p-4">
        <div className="flex items-center space-x-2 bg-green-100 px-3 py-1.5 rounded-full">
          <FiTrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-green-600 font-medium">
            10% trending up this year
          </span>
        </div>
        <span className="text-stone-500 text-sm">
          Showing electric vehicle range for the selected model over the years.
        </span>
      </div>
    </div>
  );
};

export default BarChartComponent;
