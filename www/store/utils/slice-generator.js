import api from "../../api";

const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

export function generateReducers(schema) {
  const reducers = {};

  const refs = Object.keys(schema.references).reduce((acc, k) => {
    acc[k] = [];

    return acc;
  }, {});

  reducers.create = (state, action) => {
    // Add references on init so that modifications to reference array don't
    // blow up.
    state[action.payload._id] = {
      ...refs,
      ...action.payload,
    };
  };

  reducers.update = (state, action) => {
    const { _id } = action.payload;

    // References still necessary here since `get` actions use update.
    state[_id] = { ...refs, ...state[_id], ...action.payload };
  };

  reducers.delete = (state, action) => {
    delete state[action.payload._id];
  };

  reducers.updateMany = (state, action) => {
    action.payload.forEach((item) => {
      const { _id } = item;

      // Update many can be called instead of create, so add references here as
      // well.
      state[_id] = { ...refs, ...state[_id], ...item };
    });
  };

  Object.entries(schema.references).forEach(([k, v]) => {
    const dispName = capitalize(v);

    reducers[`set${capitalize(k)}`] = (state, action) => {
      const { _id, [`${v}Ids`]: refIds } = action.payload;

      state[_id] = { ...state[_id], [k]: refIds };
    };

    reducers[`create${dispName}`] = (state, action) => {
      const { _id, [`${v}Id`]: refId } = action.payload;

      if (Array.isArray(state[_id]?.[k])) {
        state[_id][k].push(refId);
      } else {
        state[_id][k] = [refId];
      }
    };

    reducers[`delete${dispName}`] = (state, action) => {
      const { _id, [`${v}Id`]: refId } = action.payload;

      if (Array.isArray(state[_id]?.[k])) {
        state[_id][k] = state[_id][k].filter((id) => id !== refId);
      } else {
        state[_id][k] = [];
      }
    };
  });

  return reducers;
}

export function generateActions(schema) {
  const actions = {};
  const itemName = capitalize(schema.name);

  actions.get = (id) => {
    return async function getItem(dispatch) {
      const item = await api[schema.name].get(id);

      if (!item) {
        return;
      }

      dispatch({
        type: `${schema.name}/update`,
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

      // We must create item before adding it to reference arrays of ther items
      // or it may be referenced before it exists.
      dispatch({
        type: `${schema.name}/create`,
        payload: created,
      });

      Object.entries(schema.dependencies).forEach(([k, v]) => {
        dispatch({
          type: `${k}/create${itemName}`,
          payload: {
            _id: created[v],
            [`${schema.name}Id`]: created._id,
          },
        });
      });
    };
  };

  actions.delete = (item) => {
    return async function deleteItem(dispatch) {
      const deleted = await api[schema.name].destroy(item._id);

      if (!deleted) {
        return;
      }
      // Remove references to the item before deleting it to avoid race
      // condition
      Object.entries(schema.dependencies).forEach(([k, v]) => {
        dispatch({
          type: `${k}/delete${itemName}`,
          payload: {
            _id: item[v],
            [`${schema.name}Id`]: item._id,
          },
        });
      });

      dispatch({
        type: `${schema.name}/delete`,
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
        type: `${schema.name}/update`,
        payload: updated,
      });
    };
  };

  Object.entries(schema.references).forEach(([k, v]) => {
    const functionName = `get${capitalize(k)}`;

    actions[functionName] = (id) => {
      return async function getReferences(dispatch) {
        if (!id) {
          return;
        }

        const references = await api[schema.name][functionName](id);

        if (!references) {
          return;
        }

        dispatch({
          type: `${v}/updateMany`,
          payload: references,
        });

        dispatch({
          type: `${schema.name}/set${capitalize(k)}`,
          payload: {
            _id: id,
            [`${v}Ids`]: references.map((r) => r._id),
          },
        });
      };
    };
  });

  return actions;
}

export function generateSelectors(schema) {
  const selectors = {};

  selectors.get = (state, id) => {
    if (!id || !state[schema.name][id]) {
      return null;
    }

    return state[schema.name][id];
  };

  selectors.getAll = (state) => {
    return Object.values(state[schema.name]);
  };

  Object.entries(schema.references).forEach(([k, v]) => {
    selectors[k] = (state, id) => {
      if (!id || !state[schema.name]?.[id]?.[k]) {
        return [];
      }

      const ids = state[schema.name][id][k];

      return ids.map((id) => state[v][id]).filter(Boolean);
    };
  });

  return selectors;
}

export function generateSlice(schema) {
  schema.references = schema.references || {};
  schema.dependencies = schema.dependencies || {};

  return {
    name: schema.name,
    initialState: {},
    reducers: generateReducers(schema),
    actions: generateActions(schema),
    selectors: generateSelectors(schema),
  };
}
