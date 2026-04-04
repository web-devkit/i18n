import { LitElement, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { onLocaleChange, resolveLocale } from "./locale.js";

export abstract class I18nBase extends LitElement {
    @property() value?: string;

    @property() locale?: string;

    @state() protected _resolvedLocale?: string;

    private _unsubscribe?: () => void;

    override createRenderRoot() {
        return this;
    }

    override connectedCallback() {
        super.connectedCallback();
        this._resolvedLocale = resolveLocale(this.locale);
        if (!this.locale) {
            this._unsubscribe = onLocaleChange(() => this._onLocaleChange());
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this._unsubscribe?.();
        this._unsubscribe = undefined;
    }

    override willUpdate(_changedProperties: PropertyValues) {
        if (_changedProperties.has("locale")) {
            this._unsubscribe?.();
            this._unsubscribe = undefined;
            if (!this.locale) {
                this._unsubscribe = onLocaleChange(() => this._onLocaleChange());
            }
            this._resolvedLocale = resolveLocale(this.locale);
        }
    }

    private _onLocaleChange() {
        this._resolvedLocale = resolveLocale(this.locale);
    }
}
