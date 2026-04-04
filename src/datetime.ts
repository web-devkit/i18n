import { LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { onLocaleChange, resolveLocale } from "./locale.js";

@customElement("i18n-datetime")
export class Datetime extends LitElement {
    @property() value?: string;

    @property() locale?: string;

    @property() date?: "full" | "long" | "medium" | "short";

    @property() time?: "full" | "long" | "medium" | "short";

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
        if (_changedProperties.has("locale")) {
            this._unsubscribe?.();
            this._unsubscribe = undefined;
            if (!this.locale) {
                this._unsubscribe = onLocaleChange(() => this._buildFormatter());
            }
        }

        if (
            !_changedProperties.has("locale") &&
            !_changedProperties.has("date") &&
            !_changedProperties.has("time")
        ) {
            return;
        }

        this._buildFormatter();
    }

    private _buildFormatter() {
        if (!this.date && !this.time) {
            this._formatter = undefined;
            return;
        }

        this._formatter = new Intl.DateTimeFormat(resolveLocale(this.locale), {
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
