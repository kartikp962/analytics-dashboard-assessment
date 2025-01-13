import { useEffect, useState } from "react";
import Papa from "papaparse";
import StatCards from "./StatCards";
import ActivityGraph from "./ActivityGraph";
import {
  calculatePercentageChangeInEVs,
  countCAFVEligibleVehicles,
  countEVTypes,
  countUniqueEVModels,
  findEVModelWithMaxRange,
  getEVCountByMakeAndModel,
  getEVCountByYear,
  getRangeByMakeModelAndYear,
  getTopEVMakeWithYearDifference,
} from "../../utils/utils";
import StackedBarChart from "./StackedBarChart";
import BarChartComponent from "./BarChartComponent";

type topEvMakerChangePercentageType = {
  topMake: string | null;
  percentageDifference: number | null;
};

type maxRangeEvType = {
  make: string;
  model: string;
  range: number;
};

const Grid = () => {
  const [totalEvVehicles, setTotalEvVehicles] = useState<number>(0);
  const [totalEvVehiclesChangePercentage, setTotalEvVehiclesChangePercentage] =
    useState<number>(0);
  const [topEvMakerChangePercentage, setTopEvMakerChangePercentage] =
    useState<topEvMakerChangePercentageType>({
      topMake: "",
      percentageDifference: 0,
    });
  const [typeOfEv, setTypeOfEv] = useState<Record<string, number>>({});
  const [cafvEligiblity, setCafvEligiblity] =
    useState<number>(0);
  const [cafvEligiblityChangePercentage, setCafvEligiblityChangePercentage] =
    useState<number>(0);
  const [maxRangeEv, setMaxRangeEv] = useState<maxRangeEvType>({
    make: "",
    model: "",
    range: 0,
  });
  const [totalEvModels, setTotalEvModels] = useState<number>(0);
  const [evCountByYear, setEvCountByYear] = useState<Record<string, number>>(
    {}
  );
  const [evMakeModelCount, setEvMakeModelCount] = useState<
    Record<string, Record<string, number>>
  >({});
  const [rangeByMakeModelAndYear, setRangeByMakeModelAndYear] = useState<
    Record<string, Record<string, number>>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "/data/Electric_Vehicle_Population_Data.csv"
      );
      const csvData = await response.text();
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result: { data: Record<string, string>[] }) => {
          const { data } = result || [];

          setTotalEvVehicles(data?.length);

          const newTotalEvVehiclesChangePercentage =
            calculatePercentageChangeInEVs(data);
          setTotalEvVehiclesChangePercentage(
            newTotalEvVehiclesChangePercentage
          );

          const newTopEvMakerChangePercentage =
            getTopEVMakeWithYearDifference(data);

          setTopEvMakerChangePercentage(newTopEvMakerChangePercentage);

          const newEvByTpe = countEVTypes(data);
          setTypeOfEv(newEvByTpe);

          const newEvByCAFVEligiblity = countCAFVEligibleVehicles(data);
          setCafvEligiblity(newEvByCAFVEligiblity);

          const newCafvEligiblityChangePercentage =
            isNaN(newEvByCAFVEligiblity) ||
            isNaN(data?.length) ||
            data?.length === 0
              ? 0
              : Math.round((newEvByCAFVEligiblity / data?.length) * 100);

          setCafvEligiblityChangePercentage(newCafvEligiblityChangePercentage);

          const newEvModelWithMaxRange = findEVModelWithMaxRange(data);
          setMaxRangeEv(newEvModelWithMaxRange);

          const newTotalEvModels = countUniqueEVModels(data);
          setTotalEvModels(newTotalEvModels);

          const newEvCountByYear = getEVCountByYear(data);
          setEvCountByYear(newEvCountByYear);

          const newEvMakeModelCount = getEVCountByMakeAndModel(data);
          setEvMakeModelCount(newEvMakeModelCount);

          const newRangeByMakeModelAndYear = getRangeByMakeModelAndYear(data);
          setRangeByMakeModelAndYear(newRangeByMakeModelAndYear);
        },
      });
    };

    fetchData();
  }, []);

  return (
    <div className="px-4 grid gap-3 grid-cols-12">
      <StatCards
        totalEvVehicles={totalEvVehicles}
        totalEvVehiclesChangePercentage={totalEvVehiclesChangePercentage}
        topEvMakerChangePercentage={topEvMakerChangePercentage}
        typeOfEv={typeOfEv}
        cafvEligiblity={cafvEligiblity}
        cafvEligiblityChangePercentage={cafvEligiblityChangePercentage}
        maxRangeEv={maxRangeEv}
        totalEvModels={totalEvModels}
      />
      <ActivityGraph evCountByYear={evCountByYear} />
      <StackedBarChart evMakeModelCount={evMakeModelCount} />
      <BarChartComponent rangeByMakeModelAndYear={rangeByMakeModelAndYear} />
    </div>
  );
};

export default Grid;
