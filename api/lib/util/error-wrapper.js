const AuthErr = require("../classes/auth-err");
const jobi = require("@starryinternet/jobi");

/**
 * Higher order function that wraps controllers handlers and handles custom
 * errors like AuthErr
 *
 * @param {Function} handler - route handler
 *
 * @returns {Function} route handler wrapped with an error handing function
 */
module.exports.errorWrapper = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      if (err instanceof AuthErr) {
        jobi.error("AUTH ERROR: ", err.message);

        return res.status(403).send("unauthorized");
      }

      jobi.error(err.message);

      return res.status(500).send();
    }
  };
};

/**
 * Wrap a controller's handlers with the error_wrappers
 *
 * @param {Object} controller - controller
 *
 * @returns {Object} - new controller with route handler wrapped
 */
module.exports.wrapController = (controller) => {
  const result = {};

  Object.entries(controller).forEach(([name, handler]) => {
    Object.assign(result, {
      [name]: module.exports.errorWrapper(handler),
    });
  });

  return result;
};
