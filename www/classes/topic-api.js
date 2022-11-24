import RestAPI from "./rest-api";
import client from "../api/client";
import { store } from "../store";
import { notify } from "../store/features/snackbar";

class TopicAPI extends RestAPI {
  /**
   * Create an instance of TopicAPI
   *
   * @returns {TopicAPI}
   */
  constructor() {
    super("topic");
  }

  /**
   * Fetch the takeaways for a given topic
   * @param {string} id - topic id to get takeaways for
   * @returns {Promise<Takeaway[]>} - array of related takeaways
   */
  async getTakeaways(id) {
    try {
      const res = await client.get(`topic/${id}/takeaways`);

      return res.data;
    } catch (err) {
      store().dispatch(
        notify({
          message: `Failed to get takeaways for topic (${err.message})`,
          type: "danger",
        })
      );

      return null;
    }
  }

  /**
   * Fetch the action items for a given topic
   * @param {string} id - topic id to get action items for
   * @returns {Promise<ActionItem[]>} - array of related action items
   */
  async getActionItems(id) {
    try {
      const res = await client.get(`topic/${id}/action-items`);

      return res.data;
    } catch (err) {
      store().dispatch(
        notify({
          message: `Failed to get action items for topic (${err.message})`,
          type: "danger",
        })
      );

      return null;
    }
  }

  /**
   * Add or remove a like from a topic with the given email
   * @param {string} id - topic id
   */
  async like(id) {
    try {
      const res = await client.patch(`topic/${id}/like`);

      return res.data;
    } catch (err) {
      store().dispatch(
        notify({
          message: `Failed to like topic (${err.message})`,
          type: "danger",
        })
      );

      return null;
    }
  }

  /**
   * Close the given topic by setting its status to closed
   * @param {string} id - topic id
   */
  async close(id) {
    try {
      const res = await client.patch(`topic/${id}/close`);

      return res.data;
    } catch (err) {
      store().dispatch(
        notify({
          message: `Failed to close topic (${err.message})`,
          type: "danger",
        })
      );

      return null;
    }
  }

  /**
   * Close the given topic by setting its status to closed
   * @param {string} id - topic id
   */
  async reOpen(id) {
    try {
      const res = await client.patch(`topic/${id}/reopen`);

      return res.data;
    } catch (err) {
      store().dispatch(
        notify({
          message: `Failed to re-open topic (${err.message})`,
          type: "danger",
        })
      );

      return null;
    }
  }
}

export default TopicAPI;
