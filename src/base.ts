import { LitElement, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { onLocaleChange, resolveLocale } from "./locale.js";

export abstract class I18nBase extends LitElement {
    @property() value?: string;

    @property() locale?: string;

    @state() protected _resolvedLocale?: string;

    private _unsubscribe?: () => void;

    override createRenderRoot() {
        // Wipe any children that may have been restored from an htmx
        // history snapshot or browser bfcache. Without this, Lit's
        // ChildPart (stored as a JS property, not serialized) is gone
        // on restore, so Lit appends fresh output next to the stale
        // rendered text instead of replacing it.
        // NOTE: this means these components cannot host meaningful
        // light-DOM children (e.g. slot-like content) — anything
        // placed inside will be removed before first render.
        this.replaceChildren();
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
