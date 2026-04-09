import { nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { I18nBase } from "./base.js";

@customElement("i18n-list")
export class List extends I18nBase {
    @property() type: "conjunction" | "disjunction" | "unit" = "conjunction";

    @property() display: "long" | "short" | "narrow" = "long";

    @state() private _formatter?: Intl.ListFormat;

    override render() {
        if (!this.value || !this._formatter) return nothing;

        const items: string[] = [];
        let current = "";
        for (let i = 0; i < this.value.length; i++) {
            if (this.value[i] === "\\" && this.value[i + 1] === ",") {
                current += ",";
                i++;
            } else if (this.value[i] === ",") {
                const trimmed = current.trim();
                if (trimmed) items.push(trimmed);
                current = "";
            } else {
                current += this.value[i];
            }
        }
        const last = current.trim();
        if (last) items.push(last);

        if (items.length === 0) return nothing;
        return this._formatter.format(items);
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

        this._formatter = new Intl.ListFormat(this._resolvedLocale, {
            type: this.type,
            style: this.display,
        });
    }
}

/**
 * Add the custom element to HTMLElementTagNameMap for typing.
 */
declare global {
    interface HTMLElementTagNameMap {
        "i18n-list": List;
    }
}
