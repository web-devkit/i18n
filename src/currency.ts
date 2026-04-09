import { nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { I18nBase } from "./base.js";

@customElement("i18n-currency")
export class Currency extends I18nBase {
    @property() currency?: string;

    @property() display?: "symbol" | "narrowSymbol" | "code" | "name";

    @state() private _formatter?: Intl.NumberFormat;

    override render() {
        if (!this.currency) {
            console.warn("<i18n-currency>: missing required 'currency' attribute");
            return nothing;
        }
        if (!this.value || !this._formatter) return nothing;
        const num = parseFloat(this.value);
        if (Number.isNaN(num)) return nothing;
        return this._formatter.format(num);
    }

    override updated(_changedProperties: PropertyValues) {
        if (
            !_changedProperties.has("locale") &&
            !_changedProperties.has("_resolvedLocale") &&
            !_changedProperties.has("currency") &&
            !_changedProperties.has("display")
        ) {
            return;
        }

        if (!this.currency) {
            this._formatter = undefined;
            return;
        }

        this._formatter = new Intl.NumberFormat(this._resolvedLocale, {
            style: "currency",
            currency: this.currency,
            ...(this.display && { currencyDisplay: this.display }),
        });
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
