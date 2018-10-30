import {LitElement, html} from '@polymer/lit-element';
import {blockStyle} from './block-style';

class CheckList extends LitElement {
  render() {
    return html`
      ${blockStyle}
      <style>
        :host {
          margin: 16px 0;
          padding-left: 18px;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define('check-list', CheckList);
