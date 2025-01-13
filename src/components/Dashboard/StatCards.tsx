import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { formatNumberWithCommas } from "../../utils/utils";

type topEvMakerChangePercentageType = {
  topMake: string | null;
  percentageDifference: number | null;
};

type maxRangeEvType = {
  make: string;
  model: string;
  range: number;
};

type Props = {
  totalEvVehicles: number;
  totalEvVehiclesChangePercentage: number;
  topEvMakerChangePercentage: topEvMakerChangePercentageType;
  typeOfEv: Record<string, number>;
  cafvEligiblity: number;
  cafvEligiblityChangePercentage: number;
  maxRangeEv: maxRangeEvType;
  totalEvModels: number;
};

const StatCards = (props: Props) => {
  const {
    totalEvVehicles,
    totalEvVehiclesChangePercentage,
    topEvMakerChangePercentage,
    typeOfEv,
    cafvEligiblity,
    cafvEligiblityChangePercentage,
    maxRangeEv,
    totalEvModels,
  } = props;

  return (
    <>
      <Card
        title="Total EV Vehicles"
        value={formatNumberWithCommas(totalEvVehicles)}
        pillText={`${totalEvVehiclesChangePercentage}%`}
        trend={totalEvVehiclesChangePercentage > 0 ? "up" : "down"}
        period=""
      />
      <Card
        title="Top EV Maker"
        value={topEvMakerChangePercentage.topMake as string}
        pillText={`${topEvMakerChangePercentage.percentageDifference}%`}
        trend={
          (topEvMakerChangePercentage.percentageDifference as number) > 0
            ? "up"
            : "down"
        }
        period=""
      />
      <Card
        title="Type of EVs (BEVs/PHEVs)"
        value={`${formatNumberWithCommas(
          typeOfEv.BEVs
        )} / ${formatNumberWithCommas(typeOfEv.PHEVs)}`}
        pillText=""
        trend=""
        period=""
      />
      <Card
        title="CAFV Eligibility"
        value={formatNumberWithCommas(cafvEligiblity)}
        pillText={`${cafvEligiblityChangePercentage}%`}
        trend={cafvEligiblityChangePercentage > 0 ? "up" : "down"}
        period=""
      />
      <Card
        title="Max Range EV"
        value={`${maxRangeEv.make} ${maxRangeEv.model} (${maxRangeEv.range})`}
        pillText=""
        trend=""
        period=""
      />
      <Card
        title="Total EV Models"
        value={totalEvModels}
        pillText=""
        trend=""
        period=""
      />
    </>
  );
};

const Card = ({
  title,
  value,
  pillText,
  trend,
  period,
}: {
  title: string;
  value: string | number;
  pillText: string;
  trend: "up" | "down" | "";
  period: string;
}) => {
  return (
    <div className="col-span-12 sm:col-span-4 md:col-span-6 lg:col-span-4 xl:col-span-4 p-4 rounded-lg border border-stone-300 shadow">
      <div className="flex mb-8 items-start justify-between">
        <div>
          <h3 className="text-stone-500 mb-2 text-sm">{title}</h3>
          <p className="text-3xl font-semibold">{value}</p>
        </div>

        <span
          className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : trend === ""
              ? ""
              : "bg-red-100 text-red-700"
          }`}
        >
          {trend === "up" ? (
            <FiTrendingUp />
          ) : trend === "" ? null : (
            <FiTrendingDown />
          )}
          {pillText}
        </span>
      </div>

      <p className="text-xs text-stone-500">{period}</p>
    </div>
  );
};

export default StatCards;
