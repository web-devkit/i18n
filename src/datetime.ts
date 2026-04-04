import { LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("i18n-datetime")
export class Datetime extends LitElement {
    @property() value?: string;

    @property() locale?: string;

    @property() date: "full" | "long" | "medium" | "short"  = "full";

    @property() time: "full" | "long" | "medium" | "short" = "full";

    @state() private _formatter?: Intl.DateTimeFormat;

    override createRenderRoot() {
        return this; // no shadow dom
    }

    override render() {
        return (this.value && this._formatter)
            ? this._formatter.format(new Date(this.value))
            : nothing;
    }

    override updated(_changedProperties: PropertyValues) {
        if (
            !_changedProperties.has("locale") &&
            !_changedProperties.has("date") &&
            !_changedProperties.has("time")
        ) {
            return;
        }

        this._formatter = new Intl.DateTimeFormat(this.locale, {
            dateStyle: this.date,
            timeStyle: this.time,
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
