<h1 align="center">@webdk/i18n</h1>

<p align="center">Lit-based web components that format values using the browser's <code>Intl</code> API.</p>

---

<p align="center">
  <a href="https://www.npmjs.com/package/@webdk/i18n"><img src="https://img.shields.io/npm/v/%40webdk%2Fi18n?style=flat&logo=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@webdk/i18n"><img src="https://img.shields.io/npm/dm/%40webdk%2Fi18n?style=flat" alt="npm downloads"></a>
  <a href="https://bundlephobia.com/package/@webdk/i18n"><img src="https://img.shields.io/bundlephobia/minzip/%40webdk%2Fi18n?style=flat" alt="bundle size"></a>
  <a href="https://github.com/web-devkit/i18n/blob/main/LICENSE"><img src="https://img.shields.io/github/license/web-devkit/i18n?style=flat" alt="license"></a>
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
| `locale`   | `string`                                          | no       | Override locale          |

```html
<i18n-currency value="1234.5" currency="USD"></i18n-currency>
<!-- $1,234.50 -->

<i18n-currency value="1234.5" currency="USD" display="code"></i18n-currency>
<!-- USD 1,234.50 -->

<i18n-currency value="5000" currency="JPY" locale="ja-JP"></i18n-currency>
<!-- ￥5,000 -->
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
| `locale`       | `string`                          | no       | Override locale          |

```html
<i18n-number value="1234567.89"></i18n-number>
<!-- 1,234,567.89 -->

<i18n-number value="0.4256" format="percent"></i18n-number>
<!-- 43% -->

<i18n-number value="120" unit="kilometer" display="long"></i18n-number>
<!-- 120 kilometers -->

<i18n-number value="3.14159" max-decimals="2"></i18n-number>
<!-- 3.14 -->
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
| `locale`    | `string`                                      | no       | Override locale          |

At least one of `date`, `time`, or `relative` must be set.

Relative times auto-update at appropriate intervals (every second, minute, or hour depending on the time difference).

```html
<i18n-datetime value="2026-04-04T14:30:00Z" date="long"></i18n-datetime>
<!-- April 4, 2026 -->

<i18n-datetime value="2026-04-04T14:30:00Z" date="short" time="short"></i18n-datetime>
<!-- 4/4/26, 2:30 PM -->

<i18n-datetime relative="long" value="2026-04-04T14:20:00Z"></i18n-datetime>
<!-- 5 days ago -->

<i18n-datetime relative="long" threshold="30" date="medium" value="2025-01-01T00:00:00Z"></i18n-datetime>
<!-- Falls back to absolute format after 30 days -->
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

## License

MIT
