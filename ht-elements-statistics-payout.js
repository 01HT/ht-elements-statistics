"use strict";
import { LitElement, html } from "@polymer/lit-element";

import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
import "@01ht/ht-spinner";

class HTElementsStatistics extends LitElement {
  render() {
    const { userData, orderCreating, loading } = this;
    const ready = userData && userData.payoutData && userData.payoutData.ready;
    return html`
    ${SharedStyles}
    <style>
      :host {
        display: block;
        position: relative;
        box-sizing: border-box;
      }

      h2 {
        margin-top:0;
        font-size: 18px;
        font-weight:500;
      }

      iron-icon {
        margin-right: 8px;
        min-width:24px;
      }

      ht-spinner.loading {
        margin: 64px 0;
      }

      #container {
        padding: 16px;
        box-shadow: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12);
        font-size: 16px;
      }

      .item {
        display:flex;
        align-items:center;
        margin-bottom: 8px;
      }

      [icon="ht-elements-statistics-payout:check"] {
        color:var(--accent-color);
      }

      [icon="ht-elements-statistics-payout:close"] {
        color:#d22f2f;
      }

      [disabled] {
          background: #ccc;
      }

      [hidden] {
        display:none;
      }

      #actions {
        display:flex;
        justify-content:flex-end;
      }
    </style>
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
            <p>Выплаты осуществляются с 1 по 10 число месяца. (<a href="https://docs.elements.01.ht/for-authors/payments/" target="_blank" rel="noopener">о выплатах</a>)</p>
            <div class="item"><iron-icon icon="ht-elements-statistics-payout:${
              ready ? "check" : "close"
            }"></iron-icon><div><a href="/account/payout">Настройки выплат</a> указаны</div>
            </div>

            ${
              ready
                ? html`
              <div class="item"><iron-icon icon="ht-elements-statistics-payout:${
                this.checkBalance(userData) ? "check" : "close"
              }"></iron-icon>Текущий баланс больше $${
                    userData.payoutData.swift ? "500" : "50"
                  }</div>
              `
                : null
            }
            <div id="actions">
                <paper-button raised ?disabled=${!ready ||
                  !this.checkBalance(
                    userData
                  )} ?hidden=${orderCreating} @click=${_ => {
              this.createPayoutOrder();
            }}>Создать
                </paper-button>
                <ht-spinner button ?hidden=${!orderCreating}></ht-spinner>
            </div>
          </div>
      `
      }
    </div>
`;
  }

  static get is() {
    return "ht-elements-statistics-payout";
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
      }
    };
  }

  updated(changedProperties) {
    if (changedProperties.has("opened")) {
      this.loading = true;
      this.checkСonditions();
    }
  }

  checkBalance(userData) {
    if (userData && userData.payoutData && userData.payoutData.ready) {
      if (
        (userData.payoutData.swift && userData.balance >= 500) ||
        (!userData.payoutData.swift && userData.balance >= 50)
      )
        return true;
    }
    return false;
  }

  async checkСonditions() {
    let userId = firebase.auth().currentUser.uid;
    let userData = await this.getUserData(userId);
    this.userData = userData;
    this.loading = false;
  }

  async getUserData(userId) {
    let querySnapshot = await window.firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get();
    let userData = querySnapshot.data();
    return userData;
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

customElements.define(HTElementsStatistics.is, HTElementsStatistics);
