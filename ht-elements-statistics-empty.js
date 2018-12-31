"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-button";

class HTElementsStatisticsEmpty extends LitElement {
  render() {
    return html`
    ${SharedStyles}
    <style>
        :host {
            display: flex;
            position: relative;
            box-sizing: border-box;
        }

        a {
            color:inherit;
            text-decoration: none;
        }

        img {
            width: 15vw;
            max-width: 164px;
            min-width: 128px;
        }

        #container {
            display:flex;
            align-items:center;
            flex-direction:column;
            margin: 32px auto 32px auto;
        }

        #text {
            margin-top:16px;
        }

        #sub {
            text-align:center;
            margin: 8px 0 16px 0;
            font-size: 16px;
            color: var(--secondary-text-color);
        }
    </style>
    <div id="container">
        <img src="${
          window.cloudinaryURL
        }/image/upload/v1541516058/apps/elements/pages/my-orders/empty.svg" alt="No sales">
        <div id="text" class="mdc-typography--headline5">У вас пока нет продаж</div>
        <div id="sub-text">
          <!-- <div id="sub">Для покупки воспользуйтесь нашим каталогом</div> -->
        </div>
        <!-- <a href="/catalog">
            <paper-button raised>Каталог</paper-button>
        </a> -->
    </div>
`;
  }

  static get is() {
    return "ht-elements-statistics-empty";
  }
}

customElements.define(HTElementsStatisticsEmpty.is, HTElementsStatisticsEmpty);