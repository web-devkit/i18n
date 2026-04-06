import { nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { I18nBase } from "./base.js";

@customElement("i18n-duration")
export class Duration extends I18nBase {
    @property() display: "long" | "short" | "narrow" | "digital" = "short";

    @state() private _formatter?: Intl.DurationFormat;

    override render() {
        if (!this.value) return nothing;
        if (!this._formatter) return nothing;

        let duration: Record<string, number>;
        try {
            duration = JSON.parse(this.value);
        } catch {
            return nothing;
        }

        if (typeof duration !== "object" || duration === null) return nothing;
        return this._formatter.format(duration);
    }

    override updated(_changedProperties: PropertyValues) {
        if (
            !_changedProperties.has("locale") &&
            !_changedProperties.has("_resolvedLocale") &&
            !_changedProperties.has("display")
        ) {
            return;
        }

        this._formatter = new Intl.DurationFormat(this._resolvedLocale, {
            style: this.display,
        });
    }
}

/**
 * Add the custom element to HTMLElementTagNameMap for typing.
 */
declare global {
    interface HTMLElementTagNameMap {
        "i18n-duration": Duration;
    }
}
