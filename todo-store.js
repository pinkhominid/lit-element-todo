// NOTE: increment key suffix if data shape changes
const key = '@pinkhominid/lit-element-todo/state/1';
const defaultState = {todos: []};

export default {
  load: () => {
    try {
      const stateStr = localStorage.getItem(key);
      if (stateStr) {
        return JSON.parse(stateStr);
      }
    } catch(e) {
      console.error('Error loading state.', e);
    }
    return defaultState;
  },
  save: (state) => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch(e) {
      console.error('Error saving state.', e);
    }
  }
};

