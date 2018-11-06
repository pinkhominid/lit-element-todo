// NOTE: increment key suffix if data shape changes
const key = '@pinkhominid/lit-element-todo/state/2';
const defaultState = {lastId: 0, todos: []};

export function store(state) {
    try {
      if (state !== undefined) { // set
        localStorage.setItem(key, JSON.stringify(state));
      } else { // get
        state = defaultState;
        const stateStr = localStorage.getItem(key);
        if (stateStr) {
          state = JSON.parse(stateStr);
        }
      }
    } catch(e) {
      console.error(`Error accessing store (${key})`, e);
    }
    return state;
};
