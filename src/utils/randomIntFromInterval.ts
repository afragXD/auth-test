const randomIntFromInterval = (min: number, max: number) => {
  if (min > max) throw new Error();

  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);

  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
};

export default randomIntFromInterval;
