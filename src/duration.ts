import { nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { I18nBase } from "./base.js";

const GO_DURATION_RE = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+(?:\.\d+)?)s)?(?:(\d+)ms)?$/;

function parseGoDuration(value: string): Record<string, number> | undefined {
    const match = value.match(GO_DURATION_RE);
    if (!match) return undefined;
    if (!match[1] && !match[2] && !match[3] && !match[4]) return undefined;

    const duration: Record<string, number> = {};
    if (match[1]) duration.hours = parseInt(match[1]);
    if (match[2]) duration.minutes = parseInt(match[2]);
    if (match[3]) {
        const sec = parseFloat(match[3]);
        const wholeSec = Math.floor(sec);
        const ms = Math.round((sec - wholeSec) * 1000);
        if (wholeSec) duration.seconds = wholeSec;
        if (ms) duration.milliseconds = ms;
    }
    if (match[4]) duration.milliseconds = (duration.milliseconds ?? 0) + parseInt(match[4]);
    return duration;
}

@customElement("i18n-duration")
export class Duration extends I18nBase {
    @property() display: "long" | "short" | "narrow" | "digital" = "short";

    @property({ type: Number }) years?: number;

    @property({ type: Number }) months?: number;

    @property({ type: Number }) weeks?: number;

    @property({ type: Number }) days?: number;

    @property({ type: Number }) hours?: number;

    @property({ type: Number }) minutes?: number;

    @property({ type: Number }) seconds?: number;

    @state() private _formatter?: Intl.DurationFormat;

    override render() {
        if (!this._formatter) return nothing;

        const duration = this._buildDuration();
        if (!duration) return nothing;

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

    private _buildDuration(): Record<string, number> | undefined {
        if (
            this.years !== undefined ||
            this.months !== undefined ||
            this.weeks !== undefined ||
            this.days !== undefined ||
            this.hours !== undefined ||
            this.minutes !== undefined ||
            this.seconds !== undefined
        ) {
            const d: Record<string, number> = {};
            if (this.years) d.years = this.years;
            if (this.months) d.months = this.months;
            if (this.weeks) d.weeks = this.weeks;
            if (this.days) d.days = this.days;
            if (this.hours) d.hours = this.hours;
            if (this.minutes) d.minutes = this.minutes;
            if (this.seconds) d.seconds = this.seconds;
            return d;
        }

        if (this.value) {
            return parseGoDuration(this.value);
        }

        return undefined;
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
