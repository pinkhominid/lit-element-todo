import {LitElement, html} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {repeat} from 'https://unpkg.com/lit-html/directives/repeat?module';
import './todo-form.js';
import './todo-list.js';
import './todo-item.js';

class TodoManager extends LitElement {
  static get properties() {
    return {_todos: {type: Array}};
  }

  constructor() {
    super();
    this._todos = [];
  }

  _onSubmit(evt) {
    const newTodos = [...this._todos];
    newTodos.push({id: this._todos.length, text: evt.detail.text});
    this._todos = newTodos;
  }

  _onItemCompleteChange(evt) {
    const newTodos = [...this._todos];
    evt.target._data.completed = evt.target.completed;
    this._todos = newTodos;
  }

  _onItemTextChange(evt) {
    const newTodos = [...this._todos];
    evt.target._data.text = evt.detail.newValue;
    this._todos = newTodos;
  }

  _onItemRemove(evt) {
    const newTodos = [...this._todos];
    arrayRemove(newTodos, evt.target._data);
    this._todos = newTodos;
  }

  render() {
    return html`
      <style>:host {display: block;}</style>
      <h1>todos</h1>
      <todo-form @submit=${this._onSubmit}></todo-form>
      <todo-list ?hidden=${!this._todos.length}>
        ${repeat(this._todos, todo => todo.id, todo => html`
          <todo-item
            ._data=${todo}
            ?completed=${todo.completed}
            @completedchange=${this._onItemCompleteChange}
            @textchange=${this._onItemTextChange}
            @remove=${this._onItemRemove}
          >${todo.text}</todo-item>
        `)}
      </todo-list>
    `
  }
}

function arrayRemove(arry, item) {
  arry.splice(arry.indexOf(item), 1);
}

customElements.define('todo-manager', TodoManager);
