import {LitElement, html} from '@polymer/lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {blockStyle} from './block-style';
import {router} from './router';
import {store} from './todo-store';
import './check-list';
import './check-item';

class TodoManager extends LitElement {
  static get properties() {
    return {_filter: {type:String}};
  }

  constructor() {
    super();

    this._state = store();
    this._filter = 'all';
    this._filters = {
      all: () => true,
      active: todo => !todo.checked,
      completed: todo => todo.checked
    };

    router({
      '/': () => this._filter = 'all',
      '/active': () => this._filter = 'active',
      '/completed': () => this._filter = 'completed'
    }, this);
  }

  get state() {return this._state;}

  set state(newValue) {
    const oldValue = this._state;
    store(this._state = newValue);
    this.requestUpdate('state', oldValue);
  }

  firstUpdated() {
    this.shadowRoot.querySelector('input[name=text]').focus();
  }

  _addTodo(todo) {
    todo = {...todo, id: this.state.lastId + 1};
    this.state = {...this.state, lastId: todo.id, todos: [...this.state.todos, todo]};
  }

  // todo arg optional, noarg = all
  _updateTodos(patch, todo) {
    if (patch.text != null && !patch.text.length) {
      this._removeTodos(todo);
    } else {
      this.state = {...this.state, todos: this.state.todos.map(t => {
        return todo && t !== todo ? t : {...t, ...patch};
      })};
    }
  }

  // todo arg optional, noarg = all completed
  _removeTodos(todo) {
    this.state = {...this.state, todos: this.state.todos.filter(
      todo ? t => t !== todo : this._filters.active
    )};
  }

  _onSubmitTodo() {
    return evt => {
      evt.preventDefault();

      const value = evt.target.text.value.trim();
      if (value) {
        this._addTodo({text: value});
        evt.target.reset();
      }
    }
  }

  _onChangeTodoChecked(todo) {
    return evt => {
      // ignore change event of edit todo text input
      if (!evt.target.matches('check-item, [type=checkbox]')) return;
      this._updateTodos({checked: evt.target.checked}, todo);
    }
  }

  _onRemoveTodosClick(todo) {
    return () => this._removeTodos(todo);
  }

  _onDblclickTodo(todo) {
    return async evt => {
      this._updateTodos({editing: true}, todo);
      await this.updateComplete
      evt.target.previousElementSibling.focus();
    }
  }

  _onKeydownTodoEdit(todo) {
    return evt => {
      if (evt.key === 'Enter') {
        this._updateTodos({editing: false, text: evt.target.value.trim()}, todo);
      } else if (evt.key === 'Escape') {
        // todo: figure out why input is persisting old value, workaround for now
        evt.target.value = todo.text;
        this._updateTodos({editing: false}, todo);
      }
    }
  }

  _onBlurTodoEdit(todo) {
    return evt => {
      if (!todo.editing) return;
      this._updateTodos({editing: false, text: evt.target.value.trim()}, todo);
    }
  }

  render() {
    const {state, _filters, _filter} = this;
    const todos = state.todos;
    const hasTodos = !!todos.length;
    const activeLength = todos.filter(todo => _filters.active(todo)).length;
    const completedLength = todos.length - activeLength;
    const pluralizeActive = activeLength !== 1;

    return html`
      ${blockStyle}

      <style>
        form > input {min-width: 130px;}
        check-item {display: inline;}
        check-item[checked] > span {text-decoration: line-through;}
        .selected {text-decoration: none;}
        footer > * {margin-right: 10px;}
      </style>

      <h1>todos</h1>

      <form @submit=${this._onSubmitTodo()}>
        <input
          type=checkbox
          .hidden=${!hasTodos}
          .checked=${!activeLength}
          @change=${this._onChangeTodoChecked()}
        >

        <input name=text placeholder="What needs to be done?">
      </form>

      <check-list .hidden=${!hasTodos}>
        ${repeat(todos, todo => todo.id, todo => html`
          <div .hidden=${!_filters[_filter](todo)}>
            <check-item .checked=${todo.checked} @change=${this._onChangeTodoChecked(todo)}>
              <input
                .value=${todo.text}
                .hidden=${!todo.editing}
                @keydown=${this._onKeydownTodoEdit(todo)}
                @blur=${this._onBlurTodoEdit(todo)}
              >

              <span
                .hidden=${todo.editing}
                @dblclick=${this._onDblclickTodo(todo)}
              >${todo.text}</span>
            </check-item>

            <button
              @click=${this._onRemoveTodosClick(todo)}
              .hidden=${todo.editing}
            >&times;</button>
          </div>
        `)}
      </check-list>

      <footer .hidden=${!hasTodos}>
        <i>${activeLength} item${pluralizeActive ? 's' : ''} left</i>
        <span>
          <a href=#/ class=${_filter === 'all' ? 'selected': ''}>All</a>
          <a href=#/active class=${_filter === 'active' ? 'selected': ''}>Active</a>
          <a href=#/completed class=${_filter === 'completed' ? 'selected': ''}>Completed</a>
        </span>
        <button
          .hidden=${!completedLength}
          @click=${this._onRemoveTodosClick()}
        >Clear completed</button>
      </footer>
    `
  }
}

customElements.define('todo-manager', TodoManager);
