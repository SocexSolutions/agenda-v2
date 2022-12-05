import api from "../../api";

const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

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

    const newReferences = new Set([
      ...state[foreignCollection][doc[nativeKey]][collection],
      doc._id,
    ]);

    state[foreignCollection][doc[nativeKey]][collection] =
      Array.from(newReferences);
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

    const newReferences = state[foreignCollection][doc[nativeKey]][
      collection
    ].filter((refId) => {
      return refId !== doc._id;
    });

    state[foreignCollection][doc[nativeKey]][collection] = newReferences;
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

// TODO add references to schemas at some point
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

export const createNormalizedReducer = (schemas) => {
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
