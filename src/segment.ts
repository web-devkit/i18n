import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { I18nBase } from "./base.js";

@customElement("i18n-segment")
export class Segment extends I18nBase {
    @property() granularity: "grapheme" | "word" | "sentence" = "word";

    @state() private _segmenter?: Intl.Segmenter;

    override render() {
        if (!this.value || !this._segmenter) return nothing;
        const segments = Array.from(this._segmenter.segment(this.value));
        return html`${segments.map(
            (s) =>
                html`<span
                    data-segment-index=${s.index}
                    data-is-word-like=${s.isWordLike ?? false}
                >${s.segment}</span>`,
        )}`;
    }

    override updated(_changedProperties: PropertyValues) {
        if (
            !_changedProperties.has("locale") &&
            !_changedProperties.has("_resolvedLocale") &&
            !_changedProperties.has("granularity")
        ) {
            return;
        }

        this._segmenter = new Intl.Segmenter(this._resolvedLocale, {
            granularity: this.granularity,
        });
    }
}

/**
 * Add the custom element to HTMLElementTagNameMap for typing.
 */
declare global {
    interface HTMLElementTagNameMap {
        "i18n-segment": Segment;
    }
}
