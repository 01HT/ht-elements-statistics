"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { render } from "lit-html";

import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon/iron-icon.js";

import "@01ht/ht-date";

// https://glitch.com/edit/#!/lying-blanket?path=app.js:17:5
import "@vaadin/vaadin-grid/vaadin-grid.js";

import "./ht-elements-statistics-empty.js";
import "./ht-elements-statistics-grid-styles.js";
import "./ht-elements-statistics-common.js";

import "@01ht/ht-elements-orders/ht-elements-orders-item-details.js";

class HTElementsStatistics extends LitElement {
  render() {
    const { items, payoutOrder, balance, orderCreating } = this;
    return html`
    ${SharedStyles}
    <style>
      :host {
        display: block;
        position: relative;
        box-sizing: border-box;
      }

      vaadin-grid {
        height: 100%;
      }

      iron-icon {
        min-width: 20px;
        min-height: 20px;
        width: 20px;
        height: 20px;
      }

      ht-elements-statistics-common {
        margin-top: 24px;
      }

      #container {
        margin-top: 32px;
      }

      #table {
        height: calc(100vh - 264px);
        margin-top: 8px;
     }

     .type {
        display:flex;
        align-items:center;
        position:relative;
     }

     .type iron-icon {
        margin-right: 4px;    
     }

     .amount {
        font-weight: 500;
        font-size: 13px;
     }

     .amount.green {
        color: var(--accent-color);
     }

     .positive {
        color: var(--accent-color);
     }

     .details {
      display: flex;
      height: 128px;
      overflow: auto;
      padding: 8px 16px 0 16px;
      border: 1px solid #e8ebef;
     }
    </style>
    <iron-iconset-svg size="24" name="ht-elements-statistics">
      <svg>
          <defs>
            <g id="expand-less"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path></g>
            <g id="expand-more"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></g>
            <g id="sale"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 473.8 473.8" style="enable-background:new 0 0 473.8 473.8;" xml:space="preserve">
                <path d="M454.8,111.7c0-1.8-0.4-3.6-1.2-5.3c-1.6-3.4-4.7-5.7-8.1-6.4L241.8,1.2c-3.3-1.6-7.2-1.6-10.5,0L25.6,100.9
                    c-4,1.9-6.6,5.9-6.8,10.4v0.1c0,0.1,0,0.2,0,0.4V362c0,4.6,2.6,8.8,6.8,10.8l205.7,99.7c0.1,0,0.1,0,0.2,0.1
                    c0.3,0.1,0.6,0.2,0.9,0.4c0.1,0,0.2,0.1,0.4,0.1c0.3,0.1,0.6,0.2,0.9,0.3c0.1,0,0.2,0.1,0.3,0.1c0.3,0.1,0.7,0.1,1,0.2
                    c0.1,0,0.2,0,0.3,0c0.4,0,0.9,0.1,1.3,0.1c0.4,0,0.9,0,1.3-0.1c0.1,0,0.2,0,0.3,0c0.3,0,0.7-0.1,1-0.2c0.1,0,0.2-0.1,0.3-0.1
                    c0.3-0.1,0.6-0.2,0.9-0.3c0.1,0,0.2-0.1,0.4-0.1c0.3-0.1,0.6-0.2,0.9-0.4c0.1,0,0.1,0,0.2-0.1l206.3-100c4.1-2,6.8-6.2,6.8-10.8
                    V112C454.8,111.9,454.8,111.8,454.8,111.7z M236.5,25.3l178.4,86.5l-65.7,31.9L170.8,57.2L236.5,25.3z M236.5,198.3L58.1,111.8
                    l85.2-41.3L321.7,157L236.5,198.3z M42.8,131.1l181.7,88.1v223.3L42.8,354.4V131.1z M248.5,442.5V219.2l85.3-41.4v58.4
                    c0,6.6,5.4,12,12,12s12-5.4,12-12v-70.1l73-35.4V354L248.5,442.5z"/>
            </g>
            <g id="payout"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"></path></g>
          </defs>
      </svg>
    </iron-iconset-svg>
    <div id="container">
      ${
        items.length === 0
          ? html`<ht-elements-statistics-empty></ht-elements-statistics-empty>`
          : html`
          <h1 class="mdc-typography--headline5">Моя статистика</h1>
          <ht-elements-statistics-common .balance=${balance} .items=${items} .payoutOrder=${payoutOrder} .orderCreating=${orderCreating}></ht-elements-statistics-common>
            <div id="table">
                <vaadin-grid .items=${items} .rowDetailsRenderer="${
              this.rowDetailsRenderer
            }">
                <vaadin-grid-column width="60px" header="Сумма" .renderer="${
                  this.amountRenderer
                }"></vaadin-grid-column>
                <vaadin-grid-column width="100px"  header="Тип" .renderer="${
                  this.typeRenderer
                }"></vaadin-grid-column>
                <vaadin-grid-column width="120px" header="Дата" .renderer="${
                  this.dateRenderer
                }"></vaadin-grid-column>
                <vaadin-grid-column width="160px" header="Детали" .renderer="${
                  this._boundToggleDetailsRenderer
                }"></vaadin-grid-column>      
            </div>
        `
      }
    </div>
`;
  }

  static get is() {
    return "ht-elements-statistics";
  }

  static get properties() {
    return {
      items: {
        type: Array,
        hasChanged: () => true
      },
      payoutOrder: {
        type: Object
      },
      balance: {
        type: Number
      },
      orderCreating: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this._boundToggleDetailsRenderer = this.toggleDetailsRenderer.bind(this); // need this to invoke class methods in renderers
  }

  get grid() {
    return this.shadowRoot.querySelector("vaadin-grid");
  }

  dateRenderer(root, column, rowData) {
    render(
      html`
        <ht-date .data=${rowData.item.created}></ht-date>
      `,
      root
    );
  }

  amountRenderer(root, column, rowData) {
    let htmlData = html``;
    const transactiontypeId =
      rowData.item.transactiontypeData.transactiontypeId;
    switch (transactiontypeId) {
      // sale
      case "58i5MxKKq7Mvfvmz4CCA":
        htmlData = html`<span class="amount green">+ $${
          rowData.item.amount
        }</span>`;
        break;
      // payout
      case "23cMmVLxXIGQZrHHHoTG":
        htmlData = html`<span class="amount">- $${rowData.item.amount}</span>`;
        break;
    }
    render(htmlData, root);
  }

  typeRenderer(root, column, rowData) {
    let icon = "";
    const transactiontypeId =
      rowData.item.transactiontypeData.transactiontypeId;
    const transactiontypeName = rowData.item.transactiontypeData.name;
    switch (transactiontypeId) {
      // sale
      case "58i5MxKKq7Mvfvmz4CCA":
        icon = "sale";
        break;
      // payout
      case "23cMmVLxXIGQZrHHHoTG":
        icon = "payout";
        break;
    }
    let htmlData = html`<div class="type"><iron-icon icon="ht-elements-statistics:${icon}"></iron-icon><span>${transactiontypeName}</span></div>`;
    render(htmlData, root);
  }

  _toggleDetails(value, item) {
    if (value) {
      this.grid.openItemDetails(item);
    } else {
      this.grid.closeItemDetails(item);
    }
  }

  toggleDetailsRenderer(root, column, rowData) {
    // only render the checkbox once, to avoid re-creating during subsequent calls
    let checkboxElem = root.querySelector("vaadin-checkbox");
    const orderNumber = rowData.item.orderNumber;
    let htmlData = html``;
    const transactiontypeId =
      rowData.item.transactiontypeData.transactiontypeId;
    switch (transactiontypeId) {
      // sale
      case "58i5MxKKq7Mvfvmz4CCA":
        htmlData = html`
        <vaadin-checkbox @checked-changed="${e =>
          this._toggleDetails(
            e.detail.value,
            root.item
          )}"> Показать детали</vaadin-checkbox>
    `;
        break;
      // payout
      case "23cMmVLxXIGQZrHHHoTG":
        htmlData = html`-`;
        break;
    }
    render(htmlData, root);
    // store the item to avoid grid virtual scrolling reusing DOM nodes to mess it up
    root.item = rowData.item;
    if (root.querySelector("vaadin-checkbox")) {
      root.querySelector("vaadin-checkbox").checked =
        this.grid.detailsOpenedItems.indexOf(root.item) > -1;
    }
  }

  rowDetailsRenderer(root, column, rowData) {
    let htmlData = ``;
    if (rowData.item.items) {
      htmlData = html`<div class="details"><ht-elements-orders-item-details .items=${
        rowData.item.items
      }></ht-elements-orders-item-details></div>`;
    }
    render(htmlData, root);
  }
}

customElements.define(HTElementsStatistics.is, HTElementsStatistics);
