const wait = (ms) => {
  return new Promise((res) => setTimeout(() => res(), ms));
};

export default wait;
