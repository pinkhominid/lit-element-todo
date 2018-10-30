import {LitElement, html} from '@polymer/lit-element';
import {repeat} from 'lit-html/directives/repeat';

import store from './todo-store.js';
import './todo-form.js';
import './todo-list.js';
import './todo-item.js';

class TodoManager extends LitElement {
  constructor() {
    super();
    this.state = store.load();
  }

  get todoData() {
    return this.state.todos;
  }

  set todoData(data) {
    const oldValue = this.state.todos;
    this.state.todos = data;
    store.save(this.state);
    this.requestUpdate('todoData', oldValue);
  }

  _onSubmit(evt) {
    const newTodos = [...this.todoData];
    newTodos.push({id: this.todoData.length, text: evt.detail.text});
    this.todoData = newTodos;
  }

  _onItemCompleteChange(evt) {
    const newTodos = [...this.todoData];
    evt.target._data.completed = evt.detail.newValue;
    this.todoData = newTodos;
  }

  _onItemTextChange(evt) {
    const newTodos = [...this.todoData];
    evt.target._data.text = evt.detail.newValue;
    this.todoData = newTodos;
  }

  _onItemRemove(evt) {
    const newTodos = [...this.todoData];
    arrayRemove(newTodos, evt.target._data);
    this.todoData = newTodos;
  }

  render() {
    return html`
      <style>:host {display: block;}</style>
      <h1>todos</h1>
      <todo-form @submit=${this._onSubmit}></todo-form>
      <todo-list ?hidden=${!this.todoData.length}>
        ${repeat(this.todoData, todo => todo.id, todo => html`
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
  const idx = arry.indexOf(item);
  if (idx < 0) return;
  arry.splice(idx, 1);
}

customElements.define('todo-manager', TodoManager);
