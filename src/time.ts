import { LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("i18n-time")
export class Time extends LitElement {
    @property() value?: string;

    @property() locale?: string;

    @property() format: "full" | "long" | "medium" | "short" = "full";

    @property() relative: "long" | "short" | "narrow" | undefined = undefined;

    @state() private _formatter?: Intl.DateTimeFormat | Intl.RelativeTimeFormat;

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
            !_changedProperties.has("style")
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
