import { LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { onLocaleChange, resolveLocale } from "./locale.js";

@customElement("i18n-currency")
export class Currency extends LitElement {
    @property() value?: string;

    @property() locale?: string;

    @property() currency?: string;

    @property() display?: "symbol" | "narrowSymbol" | "code" | "name";

    @state() private _formatter?: Intl.NumberFormat;

    private _unsubscribe?: () => void;

    override createRenderRoot() {
        return this;
    }

    override connectedCallback() {
        super.connectedCallback();
        if (!this.locale) {
            this._unsubscribe = onLocaleChange(() => this._buildFormatter());
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this._unsubscribe?.();
        this._unsubscribe = undefined;
    }

    override render() {
        if (!this.currency) {
            console.warn("<i18n-currency>: missing required 'currency' attribute");
            return nothing;
        }
        if (!this.value || !this._formatter) return nothing;
        const num = parseFloat(this.value);
        if (isNaN(num)) return nothing;
        return this._formatter.format(num);
    }

    override updated(_changedProperties: PropertyValues) {
        if (_changedProperties.has("locale")) {
            this._unsubscribe?.();
            this._unsubscribe = undefined;
            if (!this.locale) {
                this._unsubscribe = onLocaleChange(() => this._buildFormatter());
            }
        }

        if (
            !_changedProperties.has("locale") &&
            !_changedProperties.has("currency") &&
            !_changedProperties.has("display")
        ) {
            return;
        }

        this._buildFormatter();
    }

    private _buildFormatter() {
        if (!this.currency) {
            this._formatter = undefined;
            return;
        }

        this._formatter = new Intl.NumberFormat(resolveLocale(this.locale), {
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
