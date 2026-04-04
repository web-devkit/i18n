import { LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("i18n-time")
export class Time extends LitElement {
    @property() value?: string;

    @property() locale?: string;

    @property() format: "full" | "long" | "medium" | "short" = "full";

    @state() private _formatter?: Intl.DateTimeFormat;

    override createRenderRoot() {
        return this; // no shadow dom
    }

    override render() {
        if (!this.value || !this._formatter) return nothing;
        const date = new Date(this.value);
        if (isNaN(date.getTime())) return nothing;
        return this._formatter.format(date);
    }

    override updated(_changedProperties: PropertyValues) {
        if (
            !_changedProperties.has("locale") &&
            !_changedProperties.has("format")
        ) {
            return;
        }

        this._formatter = new Intl.DateTimeFormat(this.locale, {
            timeStyle: this.format,
        });
    }
}

/**
 * Add the custom element to HTMLElementTagNameMap for typing.
 */
declare global {
    interface HTMLElementTagNameMap {
        "i18n-time": Time;
    }
}
