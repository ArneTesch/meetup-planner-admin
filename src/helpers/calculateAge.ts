export default (timestamp: number) =>
  Math.round((new Date().getTime() - timestamp) / (1000 * 60 * 60 * 24 * 365));
