import { nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { I18nBase } from "./base.js";

@customElement("i18n-plural")
export class Plural extends I18nBase {
    @property() type: "cardinal" | "ordinal" = "cardinal";

    @property() zero?: string;

    @property() one?: string;

    @property() two?: string;

    @property() few?: string;

    @property() many?: string;

    @property() other?: string;

    @state() private _rules?: Intl.PluralRules;

    override render() {
        if (!this.value || !this._rules) return nothing;
        const count = Number.parseFloat(this.value);
        if (Number.isNaN(count)) return nothing;

        const category = this._rules.select(count);
        const template = (this[category as "zero" | "one" | "two" | "few" | "many" | "other"] ?? this.other) as
            | string
            | undefined;
        if (!template) return nothing;

        return template.replace(/\{\{count\}\}/g, this.value);
    }

    override updated(_changedProperties: PropertyValues) {
        if (
            !_changedProperties.has("locale") &&
            !_changedProperties.has("_resolvedLocale") &&
            !_changedProperties.has("type")
        ) {
            return;
        }

        this._rules = new Intl.PluralRules(this._resolvedLocale, {
            type: this.type,
        });
    }
}

/**
 * Add the custom element to HTMLElementTagNameMap for typing.
 */
declare global {
    interface HTMLElementTagNameMap {
        "i18n-plural": Plural;
    }
}
