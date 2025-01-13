export const calculatePercentageChangeInEVs = (data: Record<string, string>[]) : number => {
    const years = [...new Set(data.map(car => car['Model Year']))]; // Get unique years
    years.sort((a, b) => Number(b) - Number(a)); // Sort in descending order

    const latestYear = years[0];
    const secondLatestYear = years[1];

    const totalLatestYearEVs = data.filter(car => car['Model Year'] === latestYear).length;
    const totalSecondLatestYearEVs = data.filter(car => car['Model Year'] === secondLatestYear).length;

    const percentageChange = ((totalLatestYearEVs - totalSecondLatestYearEVs) / totalSecondLatestYearEVs) * 100;

    return Math.round(percentageChange);
};

  export const getTopEVMakeWithYearDifference = (data: Record<string, string>[]) : {topMake: string | null; percentageDifference: number | null} => {
    const makeCounts = data.reduce((acc, car) => {
      acc[car.Make] = (acc[car.Make] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    let topMake: string | null = null;
    let maxCount = 0;
  
    for (const [make, count] of Object.entries(makeCounts)) {
      if (count > maxCount) {
        topMake = make;
        maxCount = count;
      }
    }
  
    if (!topMake) {
      return { topMake: null, percentageDifference: null };
    }
  
    const topMakeData = data.filter(car => car.Make === topMake);
  
    const yearCounts = topMakeData.reduce((acc, car) => {
      acc[car['Model Year']] = (acc[car['Model Year']] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    const sortedYears = Object.keys(yearCounts).map(Number).sort((a, b) => b - a);
  
    if (sortedYears.length < 2) {
      return { topMake, percentageDifference: null };
    }
  
    const latestYear = sortedYears[0];
    const secondLatestYear = sortedYears[1];
    const latestCount = yearCounts[latestYear];
    const secondLatestCount = yearCounts[secondLatestYear];
  
    const percentageDifference = Math.round(((Number(latestCount) - Number(secondLatestCount)) / Number(secondLatestCount)) * 100);
  
    return { topMake, percentageDifference };
  };
  

  export const findTopEVMakerDifference = (data: Record<string, string>[]) => {

    const years = [...new Set(data.map(car => car['Model Year']))];
    years.sort((a, b) => Number(b) - Number(a));

    const latestYear = years[0];
    const secondLatestYear = years[1];

    const makersCountByYear: Record<string, Record<string, number>> = {};
    data.forEach(car => {
        const { 'Model Year': year, 'Make': make } = car;
        if (!makersCountByYear[year]) {
            makersCountByYear[year] = {};
        }
        if (!makersCountByYear[year][make]) {
            makersCountByYear[year][make] = 0;
        }
        makersCountByYear[year][make]++;
    });

    const latestYearMakers = makersCountByYear[latestYear] || {};
    const topMakerLatestYear = Object.entries(latestYearMakers).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);

    const secondLatestYearMakers = makersCountByYear[secondLatestYear] || {};
    const topMakerSecondLatestYear = Object.entries(secondLatestYearMakers).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);

    const countLatestYear = topMakerLatestYear[1] || 0;
    const countSecondLatestYear = topMakerSecondLatestYear[1] || 0;

    let percentageDifference = 0;
    if (Number(countSecondLatestYear) > 0) {
        percentageDifference = ((Number(countLatestYear) - Number(countSecondLatestYear)) / Number(countSecondLatestYear)) * 100;
    }

    return {
        topMaker: topMakerLatestYear[0],
        percentageDifference: Math.round(percentageDifference)
    };
};



// Function to count BEVs and PHEVs
export const countEVTypes = (data: Record<string, string>[]) : Record<string, number> => {
    return data.reduce(
      (acc, car) => {
        if (car['Electric Vehicle Type'] === "Battery Electric Vehicle (BEV)") {
          acc.BEVs += 1;
        } else {
          acc.PHEVs += 1;
        }
        return acc;
      },
      { BEVs: 0, PHEVs: 0 } // Initial counts
    );
  };

// Function to count vehicles eligible for Clean Alternative Fuel Vehicle
export const countCAFVEligibleVehicles = (data: Record<string, string>[]): number => {
  return data.filter(
    (car) => car['Clean Alternative Fuel Vehicle (CAFV) Eligibility'] === "Clean Alternative Fuel Vehicle Eligible"
  ).length;
};

export const countCAFVEligibleVehiclesWithYearDifference = (data: Record<string, string>[]) => {
  // Filter data for CAFV-eligible vehicles
  const cafvEligibleData = data.filter(
    (car) =>
      car['Clean Alternative Fuel Vehicle (CAFV) Eligibility'] ===
      "Clean Alternative Fuel Vehicle Eligible"
  );

  // Count occurrences by year
  const yearCounts = cafvEligibleData.reduce((acc, car) => {
    acc[car['Model Year']] = (acc[car['Model Year']] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort years in descending order
  const sortedYears = Object.keys(yearCounts).map(Number).sort((a, b) => b - a);

  if (sortedYears.length < 2) {
    return { eligibleCount: cafvEligibleData.length, percentageDifference: null }; // Not enough data for comparison
  }

  const latestYear = sortedYears[0];
  const secondLatestYear = sortedYears[1];
  const latestCount = yearCounts[latestYear];
  const secondLatestCount = yearCounts[secondLatestYear];

  // Calculate percentage difference
  const percentageDifference = Math.round(((latestCount - secondLatestCount) / secondLatestCount) * 100);

  return {
    eligibleCount: cafvEligibleData.length,
    percentageDifference,
  };
};


export const findEVModelWithMaxRange = (data: Record<string, string>[]) : {
  make: string;
  model: string;
  range: number;
} => {
    let maxRange = 0;
    let makeWithMaxRange  = '';
    let modelWithMaxRange = '';

    // Iterate through the data and find the model with the maximum range
    data.forEach(car => {
        let range = parseFloat(car['Electric Range'].replace(/[^\d.-]/g, ''));
        if (isNaN(range)) {
          range = 0;
        }

        if (range > maxRange) {
            maxRange = range;
            makeWithMaxRange = car['Make']; 
            modelWithMaxRange = car['Model']; 
        }
    });

    return { make: makeWithMaxRange, model: modelWithMaxRange, range: maxRange };
}

export const countUniqueEVModels = (data: Record<string, string>[]) : number => {
    const uniqueModels = new Set();

    // Iterate through the data and add the model to the Set
    data.forEach(car => {
        const model = car['Model']; // Assuming the model is stored in the 'Model' property
        uniqueModels.add(model); // The Set will only store unique models
    });

    // Return the count of unique models
    return uniqueModels.size;
};

export const getEVCountByYear = (data: Record<string, string>[]): Record<string, number> => {
  // Validate input
  const evCount = data.reduce((acc: Record<string, number>, row) => {
    const year = row["Model Year"]; // Adjust the key as needed for your data
    if (year) {
      acc[year] = (acc[year] || 0) + 1;
    }
    return acc;
  }, {});

  // Sort the result by year
  return Object.fromEntries(
    Object.entries(evCount).sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))
  );
};

export function getEVCountByMakeAndModel(data: Record<string, string>[]): Record<string, Record<string, number>> {
  return data.reduce((acc, curr) => {
    const make = curr["Make"];
    const model = curr["Model"];

    // Ensure the 'Make' exists in the accumulator
    if (!acc[make]) {
      acc[make] = {};
    }

    // If the 'Model' doesn't exist under the 'Make', initialize it with 0
    if (!acc[make][model]) {
      acc[make][model] = 0;
    }

    // Increment the count for the specific model under the make
    acc[make][model] += 1;

    return acc;
  }, {} as Record<string, Record<string, number>>);
}

export const getRangeByMakeModelAndYear = (
  data: Record<string, string>[]
): Record<string, Record<string, number>> => {
  const rangeData = data.reduce(
    (
      acc: Record<
        string,
        Record<string, { totalRange: number; count: number }>
      >,
      row
    ) => {
      const companyModel = `${row["Make"]} ${row["Model"]}`; // Combine Make and Model
      const year = row["Model Year"];
      const range = parseFloat(row["Electric Range"]);

      if (companyModel && year && !isNaN(range) && range > 0) {
        if (!acc[companyModel]) {
          acc[companyModel] = {};
        }
        if (!acc[companyModel][year]) {
          acc[companyModel][year] = { totalRange: 0, count: 0 };
        }
        acc[companyModel][year].totalRange += range;
        acc[companyModel][year].count += 1;
      }

      return acc;
    },
    {}
  );

  // Compute the average for each company+model and year
  const avgRangeByCompanyModelAndYear: Record<
    string,
    Record<string, number>
  > = {};
  Object.keys(rangeData).forEach((companyModel) => {
    avgRangeByCompanyModelAndYear[companyModel] = {};
    Object.keys(rangeData[companyModel]).forEach((year) => {
      avgRangeByCompanyModelAndYear[companyModel][year] =
        rangeData[companyModel][year].totalRange /
        rangeData[companyModel][year].count;
    });
  });

  return avgRangeByCompanyModelAndYear;
}

  


export const formatNumberWithCommas = (number: number) => {
    if(!number) return 0;
    return number.toLocaleString();
  }