const rewire = require("rewire");

module.exports = (pathInLib) => {
  const fullPath = process.cwd() + "/" + pathInLib;

  return rewire(fullPath);
};
