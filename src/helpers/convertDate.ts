export default (timestamp: string) => {
  return new Date(+timestamp).toLocaleDateString();
};
