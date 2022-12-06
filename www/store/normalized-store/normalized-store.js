import api from "../../api";

const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

/**
 * Generate actions using a given normalized store schema. Actions generated
 * include `get`, `create`, `delete`, `update`, and get methods for each of the
 * schemas references ie, if the schema's references includes 'topic`, an
 * action called `getTopics` will be created.
 *
 * @param {Object} schema - normalized store schema
 *
 * @return {Object} actions
 */
export const generateActions = (schema) => {
  const actions = {};

  actions.get = (id) => {
    return async function getItem(dispatch) {
      const item = await api[schema.name].get(id);

      if (!item) {
        return;
      }

      dispatch({
        type: `normalized/${schema.name}/update`,
        payload: item,
      });
    };
  };

  actions.create = (item) => {
    return async function createItem(dispatch) {
      const created = await api[schema.name].create(item);

      if (!created) {
        return;
      }

      dispatch({
        type: `normalized/${schema.name}/create`,
        payload: created,
      });
    };
  };

  actions.delete = (item) => {
    return async function deleteItem(dispatch) {
      const deleted = await api[schema.name].destroy(item._id);

      if (!deleted) {
        return;
      }

      dispatch({
        type: `normalized/${schema.name}/delete`,
        payload: item,
      });
    };
  };

  actions.update = (item) => {
    return async function updateItem(dispatch) {
      const updated = await api[schema.name].update(item._id, item);

      if (!updated) {
        return;
      }

      dispatch({
        type: `normalized/${schema.name}/update`,
        payload: updated,
      });
    };
  };

  if (schema.references) {
    schema.references.forEach((coll) => {
      const functionName = `get${capitalize(coll)}s`;

      actions[functionName] = (id) => {
        return async function getReferences(dispatch) {
          if (!id) {
            return;
          }

          const references = await api[schema.name][functionName](id);

          if (!references) {
            return;
          }

          references.forEach((ref) => {
            dispatch({
              type: `normalized/${coll}/update`,
              payload: ref,
            });
          });
        };
      };
    });
  }

  return actions;
};

/**
 * Generate selectors using a given normalized store schema. The generated
 * selectors include a `get` for the related object and `get` for each of the
 * schema's references such as `getTopics` if the schema's references includes
 * topic.
 *
 * @param {Object} schema - normalized store schema
 *
 * @returns {Object} selectors
 */
export const generateSelectors = (schema) => {
  const selectors = {};

  selectors.get = (state, id) => {
    if (!id || !state.normalized?.[schema.name]?.[id]) {
      return null;
    }

    return state.normalized[schema.name][id];
  };

  if (schema.references) {
    schema.references.forEach((coll) => {
      const selectorName = `${coll}s`;

      selectors[selectorName] = (state, id) => {
        if (!id || !state.normalized[schema.name]?.[id]?.[coll]) {
          return [];
        }

        const ids = state.normalized[schema.name][id][coll];

        return ids.map((id) => state.normalized[coll][id]).filter(Boolean);
      };
    });
  }

  return selectors;
};

const addReferences = ({ state, collection, schemas, doc }) => {
  const schema = schemas[collection];

  if (!schema.foreignKeys) {
    return;
  }

  for (const [foreignCollection, nativeKey] of Object.entries(
    schema.foreignKeys
  )) {
    if (!state[foreignCollection]) {
      throw new Error(
        "Normalized state does not contain collection",
        foreignCollection
      );
    }

    if (!doc[nativeKey]) {
      throw new Error(
        `Document in collection ${collection} does not have key ${nativeKey}, Document:`,
        doc
      );
    }

    if (state[foreignCollection][doc[nativeKey]]) {
      const newReferences = new Set([
        ...state[foreignCollection][doc[nativeKey]][collection],
        doc._id,
      ]);

      state[foreignCollection][doc[nativeKey]][collection] =
        Array.from(newReferences);
    } else {
      state[foreignCollection][doc[nativeKey]] = {
        [collection]: [doc._id],
      };
    }
  }
};

const removeReferences = ({ state, collection, schemas, doc }) => {
  const schema = schemas[collection];

  if (!schema.foreignKeys) {
    return;
  }

  for (const [foreignCollection, nativeKey] of Object.entries(
    schema.foreignKeys
  )) {
    if (!state[foreignCollection]) {
      throw new Error(
        "Normalized state does not contain collection:",
        foreignCollection
      );
    }

    if (!doc[nativeKey]) {
      throw new Error(
        `Document in collection ${collection} does not have key ${nativeKey}, Document:`,
        doc
      );
    }

    if (state[foreignCollection][doc[nativeKey]]) {
      const newReferences = state[foreignCollection][doc[nativeKey]][
        collection
      ].filter((refId) => {
        return refId !== doc._id;
      });

      state[foreignCollection][doc[nativeKey]][collection] = newReferences;
    }
  }
};

export const normalizedReducer = (state, action, schemas) => {
  const [prefix, collection, operation] = action.type.split("/");

  if (prefix !== "normalized") {
    return state;
  }

  if (operation === "create") {
    let refs = {};

    if (schemas[collection].references) {
      refs = schemas[collection].references.reduce((acc, r) => {
        acc[r] = [];

        return acc;
      }, {});
    }

    state[collection][action.payload._id] = {
      ...refs,
      ...action.payload,
    };

    addReferences({
      state,
      collection,
      schemas,
      doc: action.payload,
    });
  } else if (operation === "update") {
    let refs = {};

    if (schemas[collection].references) {
      refs = schemas[collection].references.reduce((acc, r) => {
        acc[r] = [];

        return acc;
      }, {});
    }

    state[collection][action.payload._id] = {
      ...refs,
      ...state[collection][action.payload._id],
      ...action.payload,
    };

    addReferences({
      state,
      collection,
      schemas,
      doc: action.payload,
    });
  } else if (operation === "delete") {
    removeReferences({
      state,
      collection,
      schemas,
      doc: action.payload,
    });

    delete state[collection][action.payload._id];
  }

  return { ...state };
};

/**
 * Create a reducer that works with normalized store actions given the schemas
 * that are used in the store.
 *
 * @param {Object} schemas - object containing schemas with keys of the schema
 * name
 */
export const createReducer = (schemas) => {
  return (state = {}, action) => {
    if (Object.keys(state).length === 0) {
      state = Object.keys(schemas).reduce((acc, s) => {
        acc[s] = {};

        return acc;
      }, {});
    }

    return normalizedReducer(state, action, schemas);
  };
};
