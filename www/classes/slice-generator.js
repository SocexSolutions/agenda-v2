import api from "../api";

const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

function generateReducers(schema) {
  const reducers = {};

  const refs = Object.keys(schema.references).reduce((acc, k) => {
    acc[k] = [];

    return acc;
  }, {});

  reducers.create = (state, action) => {
    state[action.payload._id] = {
      ...refs,
      ...action.payload,
    };
  };

  reducers.update = (state, action) => {
    const { _id } = action.payload;

    state[_id] = { ...refs, ...state[_id], ...action.payload };
  };

  reducers.delete = (state, action) => {
    delete state[action.payload._id];
  };

  reducers.updateMany = (state, action) => {
    action.payload.forEach((item) => {
      const { _id } = item;

      state[_id] = { ...refs, ...state[_id], ...item };
    });
  };

  Object.entries(schema.references).forEach(([k, v]) => {
    const refName = capitalize(v.split(".")[0]);

    reducers[`set${refName}s`] = (state, action) => {
      const { _id, [`${k}Ids`]: refIds } = action.payload;

      state[_id][k] = refIds;
    };

    reducers[`create${refName}`] = (state, action) => {
      const { _id, [`${k}Id`]: refId } = action.payload;

      state[_id][k] = state[_id][k].push(refId);
    };

    reducers[`delete${refName}`] = (state, action) => {
      const { _id, [`${k}Id`]: refId } = action.payload;

      state[_id][k] = state[_id][k].filter((id) => id !== refId);
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

      dispatch({
        type: `${schema.name}/update`,
        payload: item,
      });
    };
  };

  actions.create = (item) => {
    return async function createItem(dispatch) {
      const createdItem = await api[schema.name].create(item);

      dispatch({
        type: `${schema.name}/create`,
        payload: createdItem,
      });

      Object.entries(schema.dependencies).forEach(([k, v]) => {
        dispatch({
          type: `${k}/create${itemName}`,
          payload: {
            _id: createdItem[v],
            [`${schema.name}Id`]: createdItem._id,
          },
        });
      });
    };
  };

  actions.delete = (item) => {
    return async function deleteItem(dispatch) {
      await api[schema.name].destroy(item._id);

      dispatch({
        type: `${schema.name}/delete`,
        payload: item,
      });

      Object.entries(schema.dependencies).forEach(([k, v]) => {
        dispatch({
          type: `${k}/delete${itemName}`,
          payload: {
            _id: item[v],
            [`${schema.name}Id`]: item._id,
          },
        });
      });
    };
  };

  actions.update = (item) => {
    return async function updateItem(dispatch) {
      const updatedItem = await api[schema.name].update(item);

      dispatch({
        type: `${schema.name}/update`,
        payload: updatedItem,
      });
    };
  };

  Object.entries(schema.references).forEach(([k, v]) => {
    const functionName = `get${capitalize(k)}`;
    const refStore = v.split(".")[0];

    actions[functionName] = (id) => {
      return async function getReferces(dispatch) {
        const references = await api[schema.name][functionName](id);

        dispatch({
          type: `${refStore}/updateMany`,
          payload: references,
        });
        dispatch({
          type: `${schema.name}/set${capitalize(k)}`,
          payload: {
            _id: id,
            [`${k}Ids`]: references.map((r) => r._id),
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
    const name = v.split(".")[0];

    selectors[k] = (state, id) => {
      if (!id || !state[schema.name][id]) {
        return [];
      }

      const ids = state[schema.name][id][k];

      return ids.map((id) => state[name][id]);
    };
  });

  return selectors;
}

export function generateSlice(schema) {
  const reducers = generateReducers(schema);

  return {
    name: schema.name,
    initialState: {},
    reducers,
  };
}
