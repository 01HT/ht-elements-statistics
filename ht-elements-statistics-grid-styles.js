let htElementsStatisticsGridStyles = document.createElement("template");

htElementsStatisticsGridStyles.innerHTML = `
<custom-style>
  <style is="custom-style">
    html {
    --lumo-primary-color: var(--accent-color) !important;
    }
  </style>
</custom-style>
<dom-module id="ht-vaadin-grid-styles" theme-for="vaadin-grid">
    <template>
        <style>
            [part~="header-cell"] {
                background: #f5f5f5 !important;
                border-bottom: 1px solid rgba(0,0,0,0.12) !important;
                color: rgba(0,0,0,0.54) !important;
            }

            [part~="cell"] {
                color: rgba(0,0,0,0.54) !important;
                font-size: 13px !important;
                line-height: 16px !important;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild(htElementsStatisticsGridStyles.content);
