import { nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { I18nBase } from "./base.js";

type DateTimeStyle = "full" | "long" | "medium" | "short";
type RelativeStyle = "long" | "short" | "narrow";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 365 * DAY],
    ["month", 30 * DAY],
    ["week", 7 * DAY],
    ["day", DAY],
    ["hour", HOUR],
    ["minute", MINUTE],
];

function bestRelativeUnit(diffMs: number, seconds: boolean): [number, Intl.RelativeTimeFormatUnit] {
    const absDiff = Math.abs(diffMs);
    for (const [unit, ms] of RELATIVE_UNITS) {
        if (absDiff >= ms) {
            return [Math.round(diffMs / ms), unit];
        }
    }
    if (seconds) {
        return [Math.round(diffMs / SECOND), "second"];
    }
    return [0, "second"];
}

function autoUpdateInterval(diffMs: number, seconds: boolean): number {
    const absDiff = Math.abs(diffMs);
    if (seconds && absDiff < MINUTE) return SECOND;
    if (absDiff < HOUR) return MINUTE;
    return HOUR;
}

@customElement("i18n-datetime")
export class Datetime extends I18nBase {
    @property() date?: DateTimeStyle;

    @property() time?: DateTimeStyle;

    @property() relative?: RelativeStyle;

    @property({ type: Number }) threshold?: number;

    @property({ type: Boolean }) seconds = false;

    @state() private _formatter?: Intl.DateTimeFormat;

    @state() private _relativeFormatter?: Intl.RelativeTimeFormat;

    @state() private _tick = 0;

    private _timer?: ReturnType<typeof setTimeout>;

    override disconnectedCallback() {
        super.disconnectedCallback();
        this._clearTimer();
    }

    override render() {
        if (!this.relative && !this.date && !this.time) return nothing;

        if (!this.value) { this._clearTimer(); return nothing; }
        const date = new Date(this.value);
        if (isNaN(date.getTime())) { this._clearTimer(); return nothing; }

        if (!this.relative) return this._formatter?.format(date) ?? nothing;

        const diffMs = date.getTime() - Date.now();

        if (this._isThresholdExceeded(diffMs)) {
            if (diffMs > 0) this._scheduleUpdate(diffMs);
            else this._clearTimer();
            return this._formatter?.format(date) ?? nothing;
        }

        this._scheduleUpdate(diffMs);
        if (!this._relativeFormatter) return nothing;
        const [value, unit] = bestRelativeUnit(diffMs, this.seconds);
        return this._relativeFormatter.format(value, unit);
    }

    override updated(_changedProperties: PropertyValues) {
        if (
            !_changedProperties.has("locale") &&
            !_changedProperties.has("_resolvedLocale") &&
            !_changedProperties.has("date") &&
            !_changedProperties.has("time") &&
            !_changedProperties.has("relative") &&
            !_changedProperties.has("threshold")
        ) {
            return;
        }

        if (this.threshold !== undefined && !Number.isFinite(this.threshold)) {
            console.warn("<i18n-datetime>: 'threshold' must be a finite number");
        }

        if (this.threshold !== undefined && Number.isFinite(this.threshold) && !this.date && !this.time) {
            console.warn("<i18n-datetime>: 'threshold' requires 'date' or 'time' for absolute fallback");
        }

        if (this.date || this.time) {
            this._formatter = new Intl.DateTimeFormat(this._resolvedLocale, {
                ...(this.date && { dateStyle: this.date }),
                ...(this.time && { timeStyle: this.time }),
            });
        } else {
            this._formatter = undefined;
        }

        if (this.relative) {
            this._relativeFormatter = new Intl.RelativeTimeFormat(this._resolvedLocale, {
                style: this.relative,
                numeric: "auto",
            });
        } else {
            this._relativeFormatter = undefined;
            this._clearTimer();
        }
    }

    private _isThresholdExceeded(diffMs: number): boolean {
        return Number.isFinite(this.threshold) && Math.abs(diffMs) > this.threshold! * DAY;
    }

    private _scheduleUpdate(diffMs: number) {
        this._clearTimer();
        const interval = autoUpdateInterval(diffMs, this.seconds);
        this._timer = setTimeout(() => this._tick++, interval);
    }

    private _clearTimer() {
        if (this._timer !== undefined) {
            clearTimeout(this._timer);
            this._timer = undefined;
        }
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
