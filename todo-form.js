import {LitElement, html} from '@polymer/lit-element';

class TodoForm extends LitElement {
  _submit(evt) {
    evt.preventDefault();

    const inputVal = evt.target.firstElementChild.value.trim();
    evt.target.reset();

    if (inputVal.length) {
      this.dispatchEvent(new CustomEvent('submit', {detail: {text: inputVal}}));
    }
  }

  render() {
    return html`
      <style>:host {display: block;}</style>
      <form @submit=${this._submit}>
        <input placeholder="What needs to be done?">
      </form>
    `
  }
}
customElements.define('todo-form', TodoForm);
