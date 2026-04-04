import { LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { onLocaleChange, resolveLocale } from "./locale.js";

@customElement("i18n-time")
export class Time extends LitElement {
    @property() value?: string;

    @property() locale?: string;

    @property() format: "full" | "long" | "medium" | "short" = "full";

    @state() private _formatter?: Intl.DateTimeFormat;

    private _unsubscribe?: () => void;

    override createRenderRoot() {
        return this; // no shadow dom
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
        if (!this.value || !this._formatter) return nothing;
        const date = new Date(this.value);
        if (isNaN(date.getTime())) return nothing;
        return this._formatter.format(date);
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
            !_changedProperties.has("format")
        ) {
            return;
        }

        this._buildFormatter();
    }

    private _buildFormatter() {
        this._formatter = new Intl.DateTimeFormat(resolveLocale(this.locale), {
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
