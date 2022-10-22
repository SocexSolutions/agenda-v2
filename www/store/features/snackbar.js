import wait from "../../utils/wait";

const initialState = {
  open: false,
  message: "Success",
  type: "success",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "snackbar/silence":
      return { ...action.payload };

    case "snackbar/notify":
      return { ...action.payload };

    default:
      return state;
  }
};

/**
 * Create open a notification snackbar
 * @param {string} opts.message - message to display
 * @param {string} opts.type    - type of snackbar [success|danger]
 * @param {string} opts.ms      - how long ot leave bar open in ms
 * @return {Promise<undefined>} - resolves when snackbar closes
 */
export const notify = ({
  message = "Success",
  type = "success",
  ms = 4000,
}) => {
  return async function notify(dispatch, getState) {
    dispatch({
      type: "snackbar/notify",
      payload: { message, type, open: true },
    });

    await wait(ms);

    dispatch({
      type: "snackbar/silence",
      payload: { message, type, open: false },
    });
  };
};
