"use strict";
import { LitElement, html, css } from "lit-element";

import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
import "@01ht/ht-spinner";

import { styles } from "@01ht/ht-theme/styles";

class HTElementsStatistics extends LitElement {
  static get styles() {
    return [
      styles,
      css`
        :host {
          display: block;
          position: relative;
          box-sizing: border-box;
        }

        h2 {
          margin-top: 0;
          font-size: 18px;
          font-weight: 500;
        }

        iron-icon {
          margin-right: 8px;
          min-width: 24px;
        }

        ht-spinner.loading {
          margin: 64px 0;
        }

        #container {
          padding: 16px;
          box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2),
            0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12);
          font-size: 14px;
        }

        .item {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }

        [icon="ht-elements-statistics-payout:check"] {
          color: var(--accent-color);
        }

        [icon="ht-elements-statistics-payout:close"] {
          color: #d22f2f;
        }

        [disabled] {
          background: #ccc;
        }

        [hidden] {
          display: none;
        }

        #actions {
          display: flex;
          justify-content: flex-end;
        }
      `
    ];
  }

  render() {
    const { userData, orderCreating, loading, contractActive } = this;
    return html`
    <iron-iconset-svg size="24" name="ht-elements-statistics-payout">
      <svg>
          <defs>
            <g id="check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></g>
            <g id="close"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g>
          </defs>
      </svg>
    </iron-iconset-svg>
    <div id="container">
      ${
        loading
          ? html`<ht-spinner class="loading"></ht-spinner>`
          : html`
          <div id="info">
            <h2>Создание заказа на выплату</h2>
            <p>Выплаты осуществляются с 1 по 10 число месяца. (<a href="https://docs.elements.01.ht/guide/remuneration/" target="_blank" rel="noopener">о выплатах</a>)</p>
            <div class="item"><iron-icon icon="ht-elements-statistics-payout:${
              contractActive ? "check" : "close"
            }"></iron-icon><div><a href="/contract">Агентский договор</a></div>
            </div>
            <div class="item"><iron-icon icon="ht-elements-statistics-payout:${
              userData.payoutData ? "check" : "close"
            }"></iron-icon><div><a href="/payout">Настройки выплат</a></div>
            </div>
            ${
              userData.payoutData
                ? html`
              <div class="item"><iron-icon icon="ht-elements-statistics-payout:${
                this.checkBalance(userData) ? "check" : "close"
              }"></iron-icon>Баланс больше ${
                    userData.payoutData.payoutType === "swift"
                      ? "30 000 RUB"
                      : "3 000 RUB"
                  }</div>
              `
                : null
            }
            <div id="actions">
                <paper-button raised ?disabled="${!contractActive ||
                  !this.checkBalance(userData) ||
                  !userData.payoutData}" ?hidden="${orderCreating}" @click="${_ => {
              this.createPayoutOrder();
            }}">Создать
                </paper-button>
                <ht-spinner button ?hidden="${!orderCreating}"></ht-spinner>
            </div>
          </div>
      `
      }
    </div>
`;
  }

  static get properties() {
    return {
      payoutOrder: {
        type: Object
      },
      opened: {
        type: Boolean
      },
      userData: {
        type: Object
      },
      orderCreating: {
        type: Boolean
      },
      loading: {
        type: Boolean
      },
      contractActive: {
        type: Boolean
      }
    };
  }

  updated(changedProperties) {
    if (changedProperties.has("opened")) {
      this.loading = true;
      this.checkСonditions();
    }
  }

  constructor() {
    super();
    this.userData = {};
  }

  checkBalance(userData) {
    if (userData && userData.payoutData) {
      if (
        (userData.payoutData.payoutType === "swift" &&
          userData.balance >= 30000) ||
        (!userData.payoutData.payoutType !== "swift" &&
          userData.balance >= 3000)
      )
        return true;
    }
    return false;
  }

  async _getLastContract(userId) {
    try {
      let snapshot = await firebase
        .firestore()
        .collection("contracts")
        .where("userId", "==", userId)
        .orderBy("created", "desc")
        .limit(1)
        .get();
      if (snapshot.empty) return false;
      let contractData;
      await snapshot.forEach(doc => {
        contractData = doc.data();
      });
      return contractData;
    } catch (error) {
      throw new Error("_getLastContract: " + error.message);
    }
  }

  async _getUserData(userId) {
    let querySnapshot = await window.firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get();
    let userData = querySnapshot.data();
    return userData;
  }

  async checkСonditions() {
    let userId = firebase.auth().currentUser.uid;
    this.userData = await this._getUserData(userId);
    let contractData = await this._getLastContract(userId);
    if (contractData && contractData.active) {
      this.contractActive = true;
    } else {
      this.contractActive = false;
    }
    this.loading = false;
  }

  async createPayoutOrder() {
    this.orderCreating = true;
    this.dispatchEvent(
      new CustomEvent("create-order", {
        bubbles: true,
        composed: true,
        detail: {
          ordertypeId: "83cNtcXdV0SQhXgU5Ufy"
        }
      })
    );
  }
}

customElements.define("ht-elements-statistics-payout", HTElementsStatistics);
