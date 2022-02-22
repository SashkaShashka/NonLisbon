export const createRublesFormat = (showCurrency) => {
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
    currency: "RUR",
  };

  if (showCurrency) {
    options.style = "currency";
  }

  return Intl.NumberFormat("default", options);
};

export const createAmountFormat = () => {
  const options = {
    maximumFractionDigits: 3,
    useGrouping: false,
  };

  return Intl.NumberFormat("default", options);
};
