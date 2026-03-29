import { LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("i18n-currency")
export class Currency extends LitElement {
    @property() value?: string;

    @property() locale?: string;

    @property() currency?: string;

    @state() private _formatter?: Intl.NumberFormat;

    override createRenderRoot() {
        return this;
    }

    override render() {
        return (this.value && this._formatter)
            ? this._formatter.format(parseFloat(this.value))
            : nothing;
    }

    override updated(_changedProperties: PropertyValues) {
        if (
            _changedProperties.has("locale") ||
            _changedProperties.has("currency")
        ) {
            this._formatter = new Intl.NumberFormat(this.locale, {
                style: "currency",
                currency: this.currency || "",
                minimumFractionDigits: 2,
            });
        }
    }
}

/**
 * Add the custom element to HTMLElementTagNameMap for typing.
 */
declare global {
    interface HTMLElementTagNameMap {
        "i18n-currency": Currency;
    }
}
