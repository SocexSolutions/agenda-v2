import api from "../api";

const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

const meetingSchema = {
  name: "meeting",
  references: {
    topics: "topic._id",
    participants: "participant._id",
  },
};

const topicSchema = {
  itemName: "topic",
  references: {
    actionItems: "actionItem._id",
    takeaways: "takeaway._id",
  },
  dependencies: {
    meeting: "meeting_id",
  },
};

function createReducers(schema) {
  const reducers = {};

  const refs = Object.keys(schema.references).reduce((acc, k) => {
    acc[k] = [];
  });

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
}

function createActions(schema) {
  const actions = {};
  const itemName = capitalize(schema.name);

  actions[`get${itemName}`] = (id) => {
    return async function getItem(dispatch) {
      const item = await api[schema.name].get(id);

      dispatch({
        type: `${schema.name}/update`,
        payload: { [schema.name]: item },
      });
    };
  };

  actions[`create${itemName}`] = (item) => {
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

  actions[`delete${itemName}`] = (item) => {
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

  actions[`update${itemName}`] = (item) => {
    return async function updateItem(dispatch) {
      const updatedItem = await api[schema.name].update(item);

      dispatch({
        type: `${schema.name}/update`,
        payload: updatedItem,
      });
    };
  };

  Object.entries(schema.references).forEach(([k, v]) => {
    const functionName = `get${itemName}${capitalize(k)}s`;

    actions[functionName] = (id) => {
      return async function getReferces(dispatch) {
        const topics = await api[schema.name][functionName](id);

        dispatch({
          type: `${k}/updateMany`,
          payload: topics,
        });
      };
    };
  });

  return actions;
}

export default function createSlice(schema) {
  const reducers = createReducers(schema);
  const actions = createActions(schema);

  return {
    name: schema.name,
    initialState: {},
    reducers,
    actions,
  };
}
