const Lock = require("../models/lock");
const jobi = require("@starryinternet/jobi");

async function wait(ms) {
  return new Promise((r) => setTimeout(() => r(), ms));
}

async function release(lock) {
  jobi.debug("releasing database lock with key:", lock.key);
  return Lock.deleteOne({ _id: lock._id });
}

async function acquire(key, lenMs = 5000) {
  const exp = new Date(Date.now() + lenMs);

  jobi.trace("attempting db lock acquisition for key:", key);

  let curLock;
  for (let i = 0; i < 5; i++) {
    curLock = await Lock.findOne({ key, expires: { $gt: new Date() } });

    if (curLock) {
      jobi.trace("found existing db lock with key:", key);
      await wait(100);
    } else {
      break;
    }
  }

  if (curLock) {
    throw new Error("unable to acquire lock with key:", key);
  }

  const lock = await Lock.create({
    key,
    expires: exp,
  });

  jobi.debug("acquired lock with key:", key);

  return () => release(lock);
}

exports.acquire = acquire;
