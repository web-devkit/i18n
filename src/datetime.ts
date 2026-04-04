import { nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { I18nBase } from "./base.js";

@customElement("i18n-datetime")
export class Datetime extends I18nBase {
    @property() date?: "full" | "long" | "medium" | "short";

    @property() time?: "full" | "long" | "medium" | "short";

    @state() private _formatter?: Intl.DateTimeFormat;

    override render() {
        if (!this.date && !this.time) {
            console.warn("<i18n-datetime>: at least one of 'date' or 'time' attributes is required");
            return nothing;
        }
        if (!this.value || !this._formatter) return nothing;
        const date = new Date(this.value);
        if (isNaN(date.getTime())) return nothing;
        return this._formatter.format(date);
    }

    override updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);

        if (
            !_changedProperties.has("_resolvedLocale") &&
            !_changedProperties.has("date") &&
            !_changedProperties.has("time")
        ) {
            return;
        }

        if (!this.date && !this.time) {
            this._formatter = undefined;
            return;
        }

        this._formatter = new Intl.DateTimeFormat(this._resolvedLocale, {
            ...(this.date && { dateStyle: this.date }),
            ...(this.time && { timeStyle: this.time }),
        });
    }
}

/**
 * Add the custom element to HTMLElementTagNameMap for typing.
 */
declare global {
    interface HTMLElementTagNameMap {
        "i18n-datetime": Datetime;
    }
}
