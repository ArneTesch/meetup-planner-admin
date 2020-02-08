export default (timestamp: string | number) => {
  return new Date(+timestamp).toLocaleDateString();
};
