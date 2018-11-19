"use strict";
import { LitElement, html } from "@polymer/lit-element";

class HTElementsStatistics extends LitElement {
  render() {
    return html`
    <style>
      :host {
        display: block;
        position: relative;
        box-sizing: border-box;
      }
    </style>
    <div id="container">
      <div>Раздел в разработке...</div>
    </div>
`;
  }

  static get is() {
    return "ht-elements-statistics";
  }

  static get properties() {
    return {}
  }
}

customElements.define(HTElementsStatistics.is, HTElementsStatistics);
