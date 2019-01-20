"use strict";
import { LitElement, html } from "@polymer/lit-element";

import "./ht-elements-statistics-payout.js";

class HTElementsStatisticsCommon extends LitElement {
  render() {
    const { data, payoutOrder, balance, opened, orderCreating } = this;
    return html`
    ${SharedStyles}
    <style>
      :host {
        display: block;
        position: relative;
        box-sizing: border-box;
      }

      paper-button {
        height:24px;
        min-height: 24px;
        font-size: .775rem;
        padding: 0 8px;
      }

      #container ht-elements-statistics-payout {
        margin: 8px 0 16px 0;
      }

      #container {
        display: flex;
        flex-direction: column;
      }

      #container > * {
        margin-bottom: 12px;
      }

      .value {
        font-weight: 600;
      }

      .sub-tax {
        font-size: 14px;
      }

      #tax {
        border-left: 3px solid var(--accent-color);
        padding:  4px 16px;
      }

      .title {
        margin-top: 8px;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }

      #balance {
        display:flex;
        align-items:center;
      }

      #balance .value {
        margin-right: 8px;
        margin-left: 4px;
      }
    </style>
    <div id="container">
      <div id="balance"><span class="label">Баланс: </span><span class="value">$${balance}</span>
        ${
          payoutOrder
            ? html`<span class="payout-order">(Вы заказали выплату - <a href="/my-orders">Заказ №${
                payoutOrder.orderNumber
              }</a>)</span>`
            : html`<paper-button raised @click=${_ => {
                this.opened = !this.opened;
              }}>${opened ? "Закрыть" : "Выплатить"}</paper-button>`
        }
        </div>
        ${
          opened && !payoutOrder
            ? html`<ht-elements-statistics-payout ?opened=${opened} .orderCreating=${orderCreating}></ht-elements-statistics-payout>`
            : null
        }
        <div id="sales"><span class="label">Продано: </span><span class="value">$${
          data.sales
        }</span></div>
        <div id="payout"><span class="label">Выплачено: </span><span class="value">$${
          data.payout
        }</span></div>
        <div id="tax">
          <span class="label">Удержано с выплат: </span><span class="value">$${
            data.tax
          }</span>
          <div class="sub-tax">
              <div class="title">Налоги</div>
              <div><span class="item">НДФЛ (13%) : </span><span class="value">$${
                data.ndfl
              }</span></div>
              <div class="title">Страховые взносы</div>
              <div><span class="item">ПФР (22%) : </span><span class="value">$${
                data.pfr
              }</span></div>
              <div><span class="item">ФОМС (5.1%) : </span><span class="value">$${
                data.foms
              }</span></div>
              <div class="title">Комиссия банка за выплаты (оплачивается за счет 01HT)</div>
              <div><span class="value">$${data.transferFee}</span></div>
        </div>  
      </div>
    </div>
`;
  }

  static get is() {
    return "ht-elements-statistics-common";
  }

  static get properties() {
    return {
      items: {
        type: Array
      },
      balance: {
        type: Number
      },
      data: {
        type: Object
      },
      payoutOrder: {
        type: Object
      },
      opened: {
        type: Boolean
      },
      orderCreating: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.data = {
      sales: 0,
      payout: 0,
      tax: 0,
      ndfl: 0,
      pfr: 0,
      foms: 0,
      transferFee: 0
    };
  }

  set items(items) {
    // this.opened = false;
    let data = {
      sales: 0,
      payout: 0,
      tax: 0,
      ndfl: 0,
      pfr: 0,
      foms: 0,
      transferFee: 0
    };
    for (let transaction of items) {
      let transactiontypeId = transaction.transactiontypeData.transactiontypeId;
      if (transactiontypeId === "58i5MxKKq7Mvfvmz4CCA") {
        data.sales += transaction.amount;
      }
      if (transactiontypeId === "23cMmVLxXIGQZrHHHoTG") {
        data.payout += transaction.amount;
      }
      if (transaction.tax) {
        let ndfl = transaction.tax.ndfl;
        let pfr = transaction.tax.pfr;
        let foms = transaction.tax.foms;
        data.tax = data.tax + ndfl + pfr + foms;
        data.ndfl += ndfl;
        data.pfr += pfr;
        data.foms += foms;
      }
      if (transaction.transferFee) {
        data.transferFee += transaction.transferFee;
      }
    }
    this.data = data;
  }
}

customElements.define(
  HTElementsStatisticsCommon.is,
  HTElementsStatisticsCommon
);
