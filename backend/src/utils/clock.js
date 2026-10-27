const config = require("../config");

function now(asOf) {
  if (asOf) {
    const parsed = new Date(asOf);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error("Invalid as_of");
    }
    return parsed;
  }
  if (config.demoAsOf) {
    return new Date(config.demoAsOf);
  }
  return new Date();
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

module.exports = { now, addHours };
