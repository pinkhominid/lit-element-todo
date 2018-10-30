import {LitElement, html} from '@polymer/lit-element';
import {repeat} from 'lit-html/directives/repeat';

class TodoList extends LitElement {
  static get properties() {
    return {
      filter: {reflect: true},
    }
  }

  constructor() {
    super();

    this.filter = 'all';
    this._filterFns = {
      'all': item => true,
      'active': item => !item.completed,
      'completed': item => item.completed
    };
  }

  get items() {
    // don't pick up nested list items
    return [...this.querySelectorAll(':scope > todo-item')];
  }

  _applyFilterFn() {
    this.items.forEach(item => item.hidden = !this._filterFns[this.filter](item));
  }

  _onCheckboxChange(evt) {
    this.items.forEach(item => item.completed = evt.target.checked);
    this.requestUpdate();
  }

  _onItemChange() {
    // recompute stats when child todo-items change
    this.requestUpdate();
  }

  _onClearCompletedClick() {
    this.items.forEach(item => {if (item.completed) item.remove();});
  }

  _onFilterChange(evt) {
    this.filter = evt.target.value;
  }

  render() {
    const activeItemsLength = this.items.filter(item => this._filterFns.active(item)).length;
    const shouldPluralize = activeItemsLength !== 1;
    const completedItemsLength = this.items.length - activeItemsLength;

    // show/hide items based on filter
    this._applyFilterFn();

    return html`
      <style>
        :host {display: block;}
        label {text-transform: capitalize;}
      </style>
      <input
        type=checkbox
        ?hidden=${!this.items.length}
        @change=${this._onCheckboxChange}
        .checked=${!activeItemsLength}
      >
      <slot @slotchange=${this._onItemChange} @completedchange=${this._onItemChange}></slot>
      <button ?hidden=${!completedItemsLength} @click=${this._onClearCompletedClick}>Clear completed</button>
      <div ?hidden=${!this.items.length}>
        <p>${activeItemsLength} item${shouldPluralize ? 's' : ''} left</p>
        <div @change=${this._onFilterChange}>
          ${repeat(Object.keys(this._filterFns), undefined, filterType => html`
            <label><input
              type=radio
              name=todo-filter
              value=${filterType}
              .checked=${this.filter === filterType}
            >${filterType}</label>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define('todo-list', TodoList);
