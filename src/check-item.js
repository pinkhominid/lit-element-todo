import {LitElement, html} from '@polymer/lit-element';
import {blockStyle} from './block-style';

class CheckItem extends LitElement {
  static get properties() {
    return {
      checked: {type: Boolean, reflect: true}
    };
  }

  constructor() {
    super();
    this.checked = false;
  }

  _onCheckboxChange(evt) {
    this.checked = evt.target.checked;
    this.dispatchEvent(new CustomEvent('change', {bubbles: true}));
  }

  render() {
    const {checked, _onCheckboxChange} = this;
    return html`
      ${blockStyle}
      <input type=checkbox .checked=${checked} @change=${_onCheckboxChange}>
      <slot></slot>
    `;
  }
}

customElements.define('check-item', CheckItem);
