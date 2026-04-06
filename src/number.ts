import { nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { I18nBase } from "./base.js";

@customElement("i18n-number")
export class NumberFormat extends I18nBase {
    @property() format?: "percent";

    @property() unit?: string;

    @property() display?: "long" | "short" | "narrow";

    @property({ attribute: "min-decimals", type: Number }) minDecimals?: number;

    @property({ attribute: "max-decimals", type: Number }) maxDecimals?: number;

    @state() private _formatter?: Intl.NumberFormat;

    override render() {
        if (!this.value || !this._formatter) return nothing;
        const num = parseFloat(this.value);
        if (isNaN(num)) return nothing;
        return this._formatter.format(num);
    }

    override updated(_changedProperties: PropertyValues) {
        if (
            !_changedProperties.has("locale") &&
            !_changedProperties.has("_resolvedLocale") &&
            !_changedProperties.has("format") &&
            !_changedProperties.has("unit") &&
            !_changedProperties.has("display") &&
            !_changedProperties.has("minDecimals") &&
            !_changedProperties.has("maxDecimals")
        ) {
            return;
        }

        const style = this.unit ? "unit" : (this.format ?? "decimal");

        this._formatter = new Intl.NumberFormat(this._resolvedLocale, {
            style,
            ...(this.unit && { unit: this.unit }),
            ...(this.display && { unitDisplay: this.display }),
            ...(this.minDecimals !== undefined && { minimumFractionDigits: this.minDecimals }),
            ...(this.maxDecimals !== undefined && { maximumFractionDigits: this.maxDecimals }),
        });
    }
}

/**
 * Add the custom element to HTMLElementTagNameMap for typing.
 */
declare global {
    interface HTMLElementTagNameMap {
        "i18n-number": NumberFormat;
    }
}
