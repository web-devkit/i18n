import { nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { I18nBase } from "./base.js";

@customElement("i18n-display")
export class Display extends I18nBase {
    @property() type: "language" | "region" | "script" | "currency" | "calendar" | "dateTimeField" = "language";

    @property() display?: "long" | "short" | "narrow";

    @state() private _formatter?: Intl.DisplayNames;

    override render() {
        if (!this.value || !this._formatter) return nothing;
        try {
            return this._formatter.of(this.value) ?? nothing;
        } catch {
            return nothing;
        }
    }

    override updated(_changedProperties: PropertyValues) {
        if (
            !_changedProperties.has("locale") &&
            !_changedProperties.has("_resolvedLocale") &&
            !_changedProperties.has("type") &&
            !_changedProperties.has("display")
        ) {
            return;
        }

        this._formatter = new Intl.DisplayNames(this._resolvedLocale, {
            type: this.type,
            ...(this.display && { style: this.display }),
        });
    }
}

/**
 * Add the custom element to HTMLElementTagNameMap for typing.
 */
declare global {
    interface HTMLElementTagNameMap {
        "i18n-display": Display;
    }
}
