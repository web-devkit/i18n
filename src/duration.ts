import { nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { I18nBase } from "./base.js";

// Compatible with Go's time.Duration.String() output format.
const DURATION_RE = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+(?:\.\d+)?)s)?(?:(\d+)ms)?$/;

function parseDuration(value: string): Record<string, number> | undefined {
    const match = value.match(DURATION_RE);
    if (!match) return undefined;
    if (!match[1] && !match[2] && !match[3] && !match[4]) return undefined;

    const duration: Record<string, number> = {};
    if (match[1]) duration.hours = parseInt(match[1], 10);
    if (match[2]) duration.minutes = parseInt(match[2], 10);
    let seconds = 0;
    let totalMs = 0;

    if (match[3]) {
        const sec = parseFloat(match[3]);
        seconds += Math.floor(sec);
        totalMs += Math.round((sec - Math.floor(sec)) * 1000);
    }
    if (match[4]) {
        totalMs += parseInt(match[4], 10);
    }

    if (totalMs >= 1000) {
        seconds += Math.floor(totalMs / 1000);
        totalMs = totalMs % 1000;
    }

    if (seconds) duration.seconds = seconds;
    if (totalMs) duration.milliseconds = totalMs;

    return Object.keys(duration).length > 0 ? duration : undefined;
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
            const set = (key: string, val?: number) => {
                if (val !== undefined && !Number.isNaN(val)) d[key] = val;
            };
            set("years", this.years);
            set("months", this.months);
            set("weeks", this.weeks);
            set("days", this.days);
            set("hours", this.hours);
            set("minutes", this.minutes);
            set("seconds", this.seconds);
            return Object.keys(d).length > 0 ? d : undefined;
        }

        if (this.value) {
            return parseDuration(this.value);
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
