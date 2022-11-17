const jobi = require("@starryinternet/jobi");

function reqLog(req, res, next) {
  try {
    jobi.info(req.method, req.originalUrl);
    jobi.debug("body:", req.body);
    jobi.trace("req:", req);

    const baseSend = res.send;

    res.send = (data) => {
      jobi.debug("response payload:", data);

      res.send = baseSend;

      return res.send(data);
    };
    // eslint-disable-next-line no-empty
  } catch (error) {}

  next();
}

module.exports = reqLog;
