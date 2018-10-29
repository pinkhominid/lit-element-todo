import {LitElement, html} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

class TodoItem extends LitElement {
  static get properties() {
    return {
      completed: {type: Boolean, reflect: true},
      editing: {type: Boolean, reflect: true}
    };
  }

  constructor() {
    super();

    this.completed = false;
    this.editing = false;
  }

  get completed() {
    return this._completed;
  }

  set completed(newValue) {
    const oldValue = this._completed;
    this._completed = newValue;
    this.requestUpdate('completed', oldValue);
    this.dispatchEvent(new CustomEvent('completedchange', {
      detail: {oldValue: oldValue, newValue: newValue},
      // bubble evt so todo-list can recompute stats
      bubbles: true
    }));
  }

  remove() {
    super.remove();
    this.dispatchEvent(new Event('remove'));
  }

  _onCheckboxChange(evt) {
    this.completed = evt.target.checked;
  }

  _onTextKeydown(evt) {
    if (evt.key === 'Enter') {
      this.editing = false;
      this._updateItemText(evt.target.value);
    } else if (evt.key === 'Escape') {
      this.editing = false;
    }
  }

  _updateItemText(newValue) {
    const oldValue = this.textContent;
    newValue = newValue.trim();

    // dirty check
    if (newValue === oldValue) return;

    // TODD (pinkhominid): file bug with lit-html
    // empty comment node placeholders cause problems when setting textContent
    // this.textContent = newValue;
    const firstTextNode = getFirstTextNodeChild(this);
    firstTextNode.nodeValue = newValue;

    this.dispatchEvent(new CustomEvent('textchange', {
      detail: {oldValue: oldValue, newValue: newValue}
    }));
  }

  _onTextBlur(evt) {
    if (!this.editing) return
    this.editing = false;
    this._updateItemText(evt.target.value);
  }

  async _onSlotDblClick(evt) {
    if (this.editing) return;
    this.editing = true;

    const textInput = evt.target.previousElementSibling;

    // wait for render to complete so we can select the text
    await this.updateComplete
    textInput.select();
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          --todo-item-completed-text-decoration: line-through;
        }
        :host([hidden]) {display: none;}
        :host([completed]) slot {
          text-decoration: var(--todo-item-completed-text-decoration);
        }
      </style>
      <input type=checkbox .checked=${this.completed} @change=${this._onCheckboxChange}>
      <input
        ?hidden=${!this.editing}
        @keydown=${this._onTextKeydown}
        @blur=${this._onTextBlur}
        .value=${this.innerText}
      >
      <slot ?hidden=${this.editing} @dblclick=${this._onSlotDblClick}></slot>
      <button @click=${this.remove}>&times;</button>
    `;
  }
}

function getFirstTextNodeChild(node) {
  return [...node.childNodes].find(child => child.nodeType === Node.TEXT_NODE);
}

customElements.define('todo-item', TodoItem);
