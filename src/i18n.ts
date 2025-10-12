import { LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("util-i18n")
class I18n extends LitElement {
    @property() value?: string;

    @property() format?: "currency";

    @property() locale?: string;

    @property() currency?: string;

    @state() private _formattedValue?: string;

    override createRenderRoot() {
        return this;
    }

    override render() {
        return this._formattedValue || nothing;
    }

    override updated(_changedProperties: PropertyValues) {
        if (_changedProperties.has("value")) {
            this._formatValue();
        }
    }

    private _formatValue() {
        if (this.value === undefined) {
            return;
        }

        if (this.format === undefined) {
            this._formattedValue = this.value;
            return;
        }

        switch (this.format) {
            case "currency":
                this._formattedValue = new Intl.NumberFormat(this.locale, {
                    style: "currency",
                    currency: this.currency || "",
                    minimumFractionDigits: 2,
                }).format(parseFloat(this.value));
                break;
        }
    }
}

/**
 * Add the custom element to HTMLElementTagNameMap for typing.
 */
declare global {
    interface HTMLElementTagNameMap {
        "util-i18n": I18n;
    }
}
