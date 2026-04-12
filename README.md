<br>

<div align="center">
    <!-- https://danmarshall.github.io/google-font-to-svg-path/ -->
    <!-- Font: Afacad Flux, Fill: #4e84f5, Stroke: none, Text: @webdk/i18n -->
    <img src=".github/logo.svg" alt="@webdk/i18n" width="300"/><br>
    <p>Lit-based web components that format values using the browser's <code>Intl</code> API.</p>
</div>

<hr />

<p align="center">
    <a href="https://www.npmjs.com/package/@webdk/i18n"><img src="https://img.shields.io/npm/v/%40webdk%2Fi18n?style=flat&logo=npm" alt="npm version"></a>
    &nbsp;
    <a href="https://www.npmjs.com/package/@webdk/i18n"><img src="https://img.shields.io/npm/dm/%40webdk%2Fi18n?style=flat&logo=npm" alt="npm downloads"></a>
    &nbsp;
    <a href="https://bundlephobia.com/package/@webdk/i18n"><img src="https://img.shields.io/bundlephobia/minzip/%40webdk%2Fi18n?style=flat&label=bundle&logo=package" alt="bundle size"></a>
    &nbsp;
    <a href="https://github.com/web-devkit/i18n/blob/main/LICENSE"><img src="https://img.shields.io/github/license/web-devkit/i18n?style=flat" alt="license"></a>
    &nbsp;
</p>

## Getting Started

### Installation

```bash
npm install @webdk/i18n
```

### Usage

Import the components you need:

```js
import "@webdk/i18n";
```

Then use them in your HTML:

```html
<i18n-currency value="1234.50" currency="USD"></i18n-currency>
```

### Light DOM & Inner Content

All components render into the light DOM (no Shadow DOM). On first render, any existing children inside the element are removed — do not place content inside these components.

### Locale Resolution

All components resolve the locale in this order:

1. Explicit `locale` attribute on the component
2. `lang` attribute on the `<html>` element
3. Browser default locale

Components automatically re-render when the `<html lang>` attribute changes.

## Components

### `<i18n-currency>`

Formats a numeric value as a currency string using `Intl.NumberFormat`.

| Attribute  | Type                                              | Required | Description              |
| ---------- | ------------------------------------------------- | -------- | ------------------------ |
| `value`    | `string`                                          | no       | Numeric amount           |
| `currency` | `string`                                          | yes      | ISO 4217 code            |
| `display`  | `"symbol"` `"narrowSymbol"` `"code"` `"name"`     | no       | How the currency is shown |
| `from`     | `string`                                          | no       | Start of a range (used with `to`) |
| `to`       | `string`                                          | no       | End of a range (used with `from`) |
| `locale`   | `string`                                          | no       | Override locale          |

When both `from` and `to` are set, the component formats them as a single locale-aware range and ignores `value`.

```html
<i18n-currency value="1234.5" currency="USD"></i18n-currency>
<!-- $1,234.50 -->

<i18n-currency value="1234.5" currency="USD" display="code"></i18n-currency>
<!-- USD 1,234.50 -->

<i18n-currency value="5000" currency="JPY" locale="ja-JP"></i18n-currency>
<!-- ￥5,000 -->

<i18n-currency from="3" to="5" currency="USD"></i18n-currency>
<!-- $3.00 – $5.00 -->
```

### `<i18n-number>`

Formats a numeric value using `Intl.NumberFormat`. Supports decimal, percent, and unit styles.

| Attribute      | Type                              | Required | Description              |
| -------------- | --------------------------------- | -------- | ------------------------ |
| `value`        | `string`                          | no       | Numeric value            |
| `format`       | `"percent"`                       | no       | Formatting style         |
| `unit`         | `string`                          | no       | Unit identifier (e.g. `"kilometer"`, `"liter"`) |
| `display`      | `"long"` `"short"` `"narrow"`     | no       | Unit display style       |
| `min-decimals` | `number`                          | no       | Minimum fraction digits  |
| `max-decimals` | `number`                          | no       | Maximum fraction digits  |
| `from`         | `string`                          | no       | Start of a range (used with `to`) |
| `to`           | `string`                          | no       | End of a range (used with `from`) |
| `locale`       | `string`                          | no       | Override locale          |

When both `from` and `to` are set, the component formats them as a single locale-aware range and ignores `value`.

```html
<i18n-number value="1234567.89"></i18n-number>
<!-- 1,234,567.89 -->

<i18n-number value="0.4256" format="percent"></i18n-number>
<!-- 43% -->

<i18n-number value="120" unit="kilometer" display="long"></i18n-number>
<!-- 120 kilometers -->

<i18n-number value="3.14159" max-decimals="2"></i18n-number>
<!-- 3.14 -->

<i18n-number from="3" to="5" unit="kilometer"></i18n-number>
<!-- 3–5 km -->
```

### `<i18n-datetime>`

Formats a date/time value using `Intl.DateTimeFormat`. Optionally shows relative time using `Intl.RelativeTimeFormat`.

| Attribute   | Type                                          | Required | Description              |
| ----------- | --------------------------------------------- | -------- | ------------------------ |
| `value`     | `string`                                      | no       | ISO 8601 date string     |
| `date`      | `"full"` `"long"` `"medium"` `"short"`        | no       | Date style               |
| `time`      | `"full"` `"long"` `"medium"` `"short"`        | no       | Time style               |
| `relative`  | `"long"` `"short"` `"narrow"`                 | no       | Relative time style      |
| `threshold` | `number`                                      | no       | Days before switching from relative to absolute |
| `seconds`   | `boolean`                                     | no       | Include seconds in relative output |
| `from`      | `string`                                      | no       | Start of a range (used with `to`) |
| `to`        | `string`                                      | no       | End of a range (used with `from`) |
| `locale`    | `string`                                      | no       | Override locale          |

At least one of `date`, `time`, or `relative` must be set.

Relative times auto-update at appropriate intervals (every second, minute, or hour depending on the time difference).

When both `from` and `to` are set, the component formats them as a single locale-aware range using `Intl.DateTimeFormat.formatRange()` and ignores `value`. Range mode only applies in absolute formatting (with `date` and/or `time`); the `relative` mode does not support ranges.

```html
<i18n-datetime value="2026-04-04T14:30:00Z" date="long"></i18n-datetime>
<!-- April 4, 2026 -->

<i18n-datetime value="2026-04-04T14:30:00Z" date="short" time="short"></i18n-datetime>
<!-- 4/4/26, 2:30 PM -->

<i18n-datetime relative="long" value="2026-04-04T14:20:00Z"></i18n-datetime>
<!-- 5 days ago -->

<i18n-datetime relative="long" threshold="30" date="medium" value="2025-01-01T00:00:00Z"></i18n-datetime>
<!-- Falls back to absolute format after 30 days -->

<i18n-datetime from="2026-01-01" to="2026-01-05" date="medium"></i18n-datetime>
<!-- Jan 1 – 5, 2026 -->
```

### `<i18n-duration>`

Formats a duration using `Intl.DurationFormat`. Accepts either a Go-style duration string or individual time unit attributes.

| Attribute  | Type                                          | Required | Description              |
| ---------- | --------------------------------------------- | -------- | ------------------------ |
| `value`    | `string`                                      | no       | Go-style duration (e.g. `"1h30m10s"`, `"500ms"`) |
| `display`  | `"long"` `"short"` `"narrow"` `"digital"`     | no       | Output style (default: `"short"`) |
| `years`    | `number`                                      | no       | Years component          |
| `months`   | `number`                                      | no       | Months component         |
| `weeks`    | `number`                                      | no       | Weeks component          |
| `days`     | `number`                                      | no       | Days component           |
| `hours`    | `number`                                      | no       | Hours component          |
| `minutes`  | `number`                                      | no       | Minutes component        |
| `seconds`  | `number`                                      | no       | Seconds component        |
| `locale`   | `string`                                      | no       | Override locale          |

```html
<i18n-duration value="1h30m10s"></i18n-duration>
<!-- 1 hr, 30 min, 10 sec -->

<i18n-duration value="1h30m10s" display="long"></i18n-duration>
<!-- 1 hour, 30 minutes, 10 seconds -->

<i18n-duration value="1h30m10s" display="digital"></i18n-duration>
<!-- 1:30:10 -->

<i18n-duration days="2" hours="5" display="long"></i18n-duration>
<!-- 2 days, 5 hours -->
```

### `<i18n-list>`

Formats a list of items using `Intl.ListFormat`.

| Attribute | Type                                          | Required | Description              |
| --------- | --------------------------------------------- | -------- | ------------------------ |
| `value`   | `string`                                      | no       | Comma-separated items    |
| `type`    | `"conjunction"` `"disjunction"` `"unit"`      | no       | List type (default: `"conjunction"`) |
| `display` | `"long"` `"short"` `"narrow"`                 | no       | Output style (default: `"long"`) |
| `locale`  | `string`                                      | no       | Override locale          |

Use `\,` to include a literal comma within an item.

```html
<i18n-list value="Apple, Banana, Cherry"></i18n-list>
<!-- Apple, Banana, and Cherry -->

<i18n-list value="Red, Blue, Green" type="disjunction"></i18n-list>
<!-- Red, Blue, or Green -->

<i18n-list value="3 feet, 7 inches" type="unit"></i18n-list>
<!-- 3 feet, 7 inches -->
```

### `<i18n-display>`

Displays the localized name of a language, region, currency, script, calendar, or date-time field using `Intl.DisplayNames`.

| Attribute | Type                                                                          | Required | Description              |
| --------- | ----------------------------------------------------------------------------- | -------- | ------------------------ |
| `value`   | `string`                                                                      | no       | Code to resolve          |
| `type`    | `"language"` `"region"` `"script"` `"currency"` `"calendar"` `"dateTimeField"` | no       | Name type (default: `"language"`) |
| `display` | `"long"` `"short"` `"narrow"`                                                 | no       | Output style             |
| `locale`  | `string`                                                                      | no       | Override locale          |

```html
<i18n-display value="en" type="language"></i18n-display>
<!-- English -->

<i18n-display value="US" type="region"></i18n-display>
<!-- United States -->

<i18n-display value="JP" type="region" locale="ja-JP"></i18n-display>
<!-- 日本 -->

<i18n-display value="USD" type="currency"></i18n-display>
<!-- US Dollar -->
```

### `<i18n-plural>`

Selects the correct plural form for a count using `Intl.PluralRules`. Use `{{count}}` in any form to interpolate the count value.

| Attribute | Type                          | Required | Description              |
| --------- | ----------------------------- | -------- | ------------------------ |
| `value`   | `string`                      | no       | The count                |
| `type`    | `"cardinal"` `"ordinal"`      | no       | Plural type (default: `"cardinal"`) |
| `zero`    | `string`                      | no       | Form for the `zero` category |
| `one`     | `string`                      | no       | Form for the `one` category |
| `two`     | `string`                      | no       | Form for the `two` category |
| `few`     | `string`                      | no       | Form for the `few` category |
| `many`    | `string`                      | no       | Form for the `many` category |
| `other`   | `string`                      | no       | Form for the `other` category — used as fallback when the selected category is unset |
| `locale`  | `string`                      | no       | Override locale          |

Plural categories vary by language: English uses `one` and `other`; Arabic uses all six. Always provide `other` as a fallback.

```html
<i18n-plural value="1" one="{{count}} item" other="{{count}} items"></i18n-plural>
<!-- 1 item -->

<i18n-plural value="5" one="{{count}} item" other="{{count}} items"></i18n-plural>
<!-- 5 items -->

<i18n-plural value="3" type="ordinal" one="{{count}}st" two="{{count}}nd" few="{{count}}rd" other="{{count}}th"></i18n-plural>
<!-- 3rd -->
```

### `<i18n-segment>`

Splits text into locale-aware segments (graphemes, words, or sentences) using `Intl.Segmenter`. Each segment is rendered as a `<span>` with `data-segment-index` and `data-is-word-like` attributes for styling and filtering.

| Attribute     | Type                                  | Required | Description              |
| ------------- | ------------------------------------- | -------- | ------------------------ |
| `value`       | `string`                              | no       | Text to segment          |
| `granularity` | `"grapheme"` `"word"` `"sentence"`    | no       | Segmentation level (default: `"word"`) |
| `locale`      | `string`                              | no       | Override locale          |

```html
<i18n-segment value="Hello, world!" granularity="word"></i18n-segment>
<!-- <span>Hello</span><span>,</span><span> </span><span>world</span><span>!</span> -->

<i18n-segment value="今日は良い天気です。" granularity="word" locale="ja-JP"></i18n-segment>
<!-- Splits Japanese text on word boundaries -->
```

Combine with CSS to highlight only word-like segments:

```css
i18n-segment span[data-is-word-like="true"] {
    background: yellow;
}
```

## Not Included

The following `Intl` APIs are intentionally not exposed as components, because they don't map to a rendering concern:

- **`Intl.Collator`** — used for locale-aware string comparison and sorting. This is a JavaScript operation on data, not something you render. Use it directly in your code: `new Intl.Collator(locale).compare(a, b)`.
- **`Intl.Locale`** — a utility for parsing and manipulating locale identifiers. There is nothing to render. Use it directly when you need to inspect or transform locale tags.

## License

MIT
