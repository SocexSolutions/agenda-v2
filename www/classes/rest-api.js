import client from "../api/client";
import { store } from "../store";
import { notify } from "../store/features/snackbar";
import debounce from "../utils/debounce";

class RestAPI {
  /**
   * Create an instance of the RestAPI which includes crud operational methods
   * for a given type/controller. By default there are `get`, `create`,
   * `update`, and `destroy`. Others can be included in the constructor.
   *
   * @param {String} type - rest type (e.g. takeaway, meeting, topic)
   *
   * @returns {RestAPI}
   */
  constructor(type) {
    this.type = type;

    for (const property of Object.keys(this)) {
      if (
        property !== "constructor" &&
        property !== "type" &&
        typeof this[property] === "function"
      ) {
        this[property] = debounce(this[property], 300);
      }
    }
  }

  /**
   * Get a specific object by id (handles errors with notification)
   *
   * @param {String} id - id of object to retrieve
   *
   * @returns {Promise<Object|undefined>} - retrieved object
   */
  async get(id) {
    try {
      const res = await client.get(`${this.type}/${id}`);

      return res.data;
    } catch (err) {
      store().dispatch(
        notify({
          message: `Failed to get ${this.type} (${err.message} )`,
          type: "danger",
        })
      );
    }
  }

  /**
   * Create a object (handles errors with notifications)
   *
   * @param {Object} payload - object to create
   *
   * @returns {Promise<Object|undefined>} - created object
   */
  async create(payload) {
    try {
      const res = await client.post(this.type, payload);

      return res.data;
    } catch (err) {
      store().dispatch(
        notify({
          message: `Failed to create ${this.type} (${err.message} )`,
          type: "danger",
        })
      );
    }
  }

  /**
   * Update an object (handles errors with notifications)
   *
   * @param {String} id - id of object to update
   * @param {Object} payload  - updates to object
   *
   * @returns {Promise<Object|undefined>} - updated object
   */
  async update(id, payload) {
    try {
      const res = await client.patch(`${this.type}/${id}`, payload);

      return res.data;
    } catch (err) {
      store().dispatch(
        notify({
          message: `Failed to update ${this.type} (${err.message} )`,
          type: "danger",
        })
      );

      return {};
    }
  }

  /**
   * Delete a object (handles errors with notifications)
   *
   * @param {String} id - id of object to delete
   *
   * @returns {Promise<undefined>}
   */
  async destroy(id) {
    try {
      await client.delete(`${this.type}/${id}`);
    } catch (err) {
      store().dispatch(
        notify({
          message: `Failed to delete ${this.type} (${err.message} )`,
          type: "danger",
        })
      );
    }
  }
}

export default RestAPI;
