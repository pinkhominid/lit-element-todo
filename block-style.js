import {html} from '@polymer/lit-element';

export const blockStyle = html`
  <style>
    :host {display: block;}
    :host([hidden]) {display: none;}
  </style>
`;
