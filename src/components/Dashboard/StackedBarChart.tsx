import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  evMakeModelCount: Record<string, Record<string, number>>;
};

type transformedDataResultType = {
  Company: string;
  [key: string]: string | number;
};

type ChartConfigType = {
  [key: string]: {
    label: string;
    color: string;
  };
};

const colors = [
  "hsl(173, 58%, 39%)",
  "hsl(12, 76%, 61%)",
  "hsl(197, 37%, 24%)",
  "hsl(43, 74%, 66%)",
  "hsl(27, 87%, 67%)",
  "hsl(15, 85%, 65%)",
  "hsl(200, 70%, 50%)",
  "hsl(320, 80%, 55%)",
  "hsl(60, 60%, 45%)",
  "hsl(280, 65%, 60%)",
];

const transformData = (data: Record<string, Record<string, number>>) => {
  const result: transformedDataResultType[] = [];
  Object.entries(data).forEach(([make, models]) => {
    const entry: transformedDataResultType = { Company: make };
    Object.entries(models).forEach(([model, count]) => {
      entry[model] = count;
    });
    result.push(entry);
  });
  return result;
};

const generateChartConfig = (data: Record<string, Record<string, number>>) => {
  const config: ChartConfigType = {};
  const models = new Set<string>();

  Object.values(data).forEach((modelsObj) => {
    Object.keys(modelsObj).forEach((model) => models.add(model));
  });

  Array.from(models).forEach((model, index) => {
    config[model] = {
      label: model,
      color: colors[index % colors.length],
    };
  });

  return config;
};

const StackedBarChart = (props: Props) => {
  const { evMakeModelCount } = props;
  const chartData = transformData(evMakeModelCount);
  const chartConfig = generateChartConfig(evMakeModelCount);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Record<string, any>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const filteredModels = Object.keys(chartConfig).filter((model) =>
        Object.keys(data).includes(model)
      );

      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <div className="space-y-2">
            {filteredModels.map((model, idx) => {
              const modelData = chartConfig[model];
              const modelValue = data[model] || 0;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: modelData.color }}
                    />
                    <span className="text-xs">{modelData.label}</span>
                  </div>
                  <span className="font-medium text-xs">
                    {modelValue.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="col-span-12 overflow-hidden rounded-lg border border-stone-300 shadow">
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="flex items-center gap-1.5 font-semibold text-2xl">
            Electric Vehicle Distribution by Make and Model
          </h3>
          <p className="text-stone-500 mb-2 text-sm">
            Visual representation of electric vehicle counts across different
            car manufacturers and their models. Hover over bars to see detailed
            breakdown by model.
          </p>
        </div>
      </div>

      <div className="px-4 h-[100vh]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 20, bottom: 20, left: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickFormatter={(val) => `${val.toLocaleString()}`}
            />
            <YAxis
              type="category"
              dataKey="Company"
              tickMargin={10}
              interval={0}
              tick={{ fill: "#374151", fontWeight: 500 }}
              width={90}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
            {Object.keys(chartConfig).map((model) => (
              <Bar
                key={model}
                dataKey={model}
                stackId="a"
                fill={chartConfig[model].color}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4">
        <p className="text-stone-500 mb-2 text-sm">
          Showing data for different models and makes
        </p>
      </div>
    </div>
  );
};

export default StackedBarChart;
