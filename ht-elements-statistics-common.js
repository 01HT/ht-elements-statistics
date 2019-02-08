"use strict";
import { LitElement, html, css } from "lit-element";

import "@polymer/paper-button/paper-button.js";

import "./ht-elements-statistics-payout.js";
import { generateReport } from "./generateReport.js";

import { callFirebaseHTTPFunction } from "@01ht/ht-client-helper-functions";

class HTElementsStatisticsCommon extends LitElement {
  static styles = [
    window.SharedStyles,
    css`<style>
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
        font-size: 14px;
      }

      #container > * {
        margin-bottom: 16px;
      }

      #info > * {
        margin-bottom: 8px;
      }

      #info > *:last-child {
        margin-bottom: 0;
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

      .title:first-child {
        margin-top: 0;
      }

      #balance {
        display:flex;
        align-items:center;
      }

      #balance .value {
        margin-right: 8px;
        margin-left: 4px;
      }

      .equivalent {
        color: var(--secondary-text-color);
        font-weight: 400;
      }

      #payout-actions {
        padding: 8px;
        background: #f5f5b4;
        border-radius: 4px;
        padding: 16px;
        font-size: 14px;
      }
      
      .payout-status {
        margin-top: 6px;
      }

      #payout-reports-actions {
        margin-top: 8px;
      }

      #payout-reports-actions paper-button {
        margin-right: 8px;
      }

      .payout-status span {
        font-weight: 500;
      }

      [disabled] {
          background: #ccc;
      }

      [hidden] {
        display:none;
      }
    </style>`
  ];

  render() {
    const { data, payoutOrder, balance, opened, orderCreating } = this;
    return html`
    <div id="container">
      ${
        payoutOrder && !payoutOrder.completed
          ? html`
      <div id="payout-actions">
        <div class="payout-title">Вы заказали выплату - <a href="/my-orders">Заказ №${
          payoutOrder.orderNumber
        }</a></div>
        <div class="payout-status">Статус: <span>${
          payoutOrder.statusText
        }</span></div>
        <div id="payout-reports-actions">
          <paper-button raised ?disabled="${!payoutOrder.reportReady}" @click="${_ => {
              this._showReport(payoutOrder.orderId, payoutOrder.orderNumber);
            }}">Посмотреть</paper-button>
          <paper-button raised ?disabled="${!payoutOrder.reportReady}" ?hidden="${
              payoutOrder.reportConfirmed
            }" @click="${_ => {
              this._approveReport(payoutOrder.orderId);
            }}">Утвердить</paper-button>
        </div>
      </div>`
          : null
      }
      <div id="info">
        <div id="balance"><span class="label">Баланс: </span><span class="value">${balance} RUB</span>
        ${
          !payoutOrder
            ? html`<paper-button raised @click="${_ => {
                this.opened = !this.opened;
              }}">${opened ? "Закрыть" : "Выплатить"}</paper-button>`
            : null
        }
        </div>
        ${
          opened && !payoutOrder
            ? html`<ht-elements-statistics-payout ?opened="${opened}" .orderCreating="${orderCreating}"></ht-elements-statistics-payout>`
            : null
        }
        <div id="sales"><span class="label">Продано: </span><span class="value">${
          data.totalSales
        } RUB</span></div>
        <div id="payout"><span class="label">Выплачено: </span><span class="value">${
          data.totalReward
        } RUB <span class="equivalent">(${
      data.totalRewardUSD
    } USD)</span></span></div>
      </div>
      
        <div id="tax">
          <div class="sub-tax">
              <div class="title">Налоги</div>
              <div><span class="item">НДФЛ : </span><span class="value">Не удерживается</span></div>
              <div class="title">Страховые взносы (оплачивается за счет 01HT)</div>
              <div><span class="item">ПФР (22%) : </span><span class="value">${
                data.pfrRUB
              } RUB</span></div>
              <div><span class="item">ФОМС (5.1%) : </span><span class="value">${
                data.fomsRUB
              } RUB</span></div>
              <div class="title">Комиссия банка за выплаты (оплачивается за счет 01HT)</div>
              <div><span class="value">${data.transferFeeInRUB} RUB</span></div>
        </div>  
      </div>
    </div>
`;
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
      totalSales: 0,
      totalReward: 0,
      totalRewardUSD: 0,
      ndflRUB: 0,
      pfrRUB: 0,
      fomsRUB: 0,
      transferFeeInRUB: 0
    };
  }

  async _downloadReport(reportHTML, orderNumber) {
    try {
      let documentHTML = await generateReport(reportHTML, orderNumber);
      let iframe = document.createElement("iframe");
      iframe.style = "position:fixed;visibility:hidden";
      document.body.appendChild(iframe);
      let iframeWindow = iframe.contentWindow;
      let doc = iframeWindow.document;
      doc.open();
      doc.write(documentHTML);
      doc.close();
      setTimeout(_ => {
        document.body.removeChild(iframe);
      }, 6000);
    } catch (error) {
      throw new Error("_downloadReport: " + error.message);
    }
  }

  async _showReport(orderId, orderNumber) {
    try {
      let response = await callFirebaseHTTPFunction({
        name: "httpsReportsPreview",
        authorization: true,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ orderId: orderId })
        }
      });
      let reportHTML = response.reportHTML;
      this._downloadReport(reportHTML, orderNumber);
    } catch (error) {
      throw new Error("_showReport: " + error.message);
    }
  }

  async _approveReport(orderId) {
    try {
      await callFirebaseHTTPFunction({
        name: "httpsReportsApprove",
        authorization: true,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ orderId: orderId })
        }
      });
    } catch (error) {
      throw new Error("_showReport: " + error.message);
    }
  }

  set items(items) {
    // this.opened = false;
    let data = {
      totalSales: 0,
      totalReward: 0,
      totalRewardUSD: 0,
      ndflRUB: 0,
      pfrRUB: 0,
      fomsRUB: 0,
      transferFeeInRUB: 0
    };
    for (let transaction of items) {
      let transactiontypeId = transaction.transactiontypeData.transactiontypeId;
      if (transactiontypeId === "58i5MxKKq7Mvfvmz4CCA") {
        data.totalSales += transaction.authorReward;
      }
      if (transactiontypeId === "23cMmVLxXIGQZrHHHoTG") {
        data.totalReward += transaction.totalAuthorReward;
        data.totalRewardUSD += transaction.totalAuthorRewardInUSD;
        data.transferFeeInRUB += transaction.transferFeeInRUB;
        data.ndflRUB += transaction.taxes.ndflRUB;
        data.pfrRUB += transaction.insurancePremiums.pfrRUB;
        data.fomsRUB += transaction.insurancePremiums.fomsRUB;
      }
    }
    data.totalSales = data.totalSales.toFixed(2);
    data.totalReward = data.totalReward.toFixed(2);
    data.totalRewardUSD = data.totalRewardUSD.toFixed(2);
    data.ndflRUB = data.ndflRUB.toFixed(2);
    data.pfrRUB = data.pfrRUB.toFixed(2);
    data.fomsRUB = data.fomsRUB.toFixed(2);
    data.transferFeeInRUB = data.transferFeeInRUB.toFixed(2);
    this.data = data;
  }
}

customElements.define(
  "ht-elements-statistics-common",
  HTElementsStatisticsCommon
);
