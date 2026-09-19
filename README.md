# URL Percent Encoder

Percent-encodes URI components with correct reserved character sets for path segments, query strings, and fragment strings.

```js
import { encodePath, encodeQuery, encodeFragment } from 'url-percent-encoder';

encodePath('a/b c');       // 'a%2Fb%20c'
encodeQuery('q=hello world'); // 'q=hello%20world'
encodeFragment('sec/1?line=2'); // 'sec/1?line=2'
```

## Why this library exists

JavaScript's built-in `encodeURIComponent` is almost always too aggressive: it encodes characters such as `!`, `'`, `(`, `)`, and `*` that are valid in many URI components. Those extra percent signs make URLs harder to read and can break systems that expect the more permissive RFC 3986 character sets.

This library encodes using the reserved character sets from RFC 3986:

- `encodePath` encodes a single path segment. `/` is encoded so a segment cannot alter the path hierarchy.
- `encodeQuery` leaves `/` and `?` unescaped because they are allowed in query data.
- `encodeFragment` also leaves `/` and `?` unescaped.

Space is always encoded as `%20`, never `+`. Non-ASCII input is encoded as UTF-8 bytes.

## Awkward edge cases

The encoder does not treat `*` as reserved. Many HTTP clients and servers accept `*` unescaped, and encoding it can break form-urlencoded payloads. If you need stricter encoding, use `encodeURIComponentCustom(value, extraSafeChars)` with an empty array to get the same behaviour as the built-in `encodeURIComponent` for ASCII.

## API

### `encodePath(value)`
Returns a percent-encoded string safe for a single path segment.

### `encodeQuery(value)`
Returns a percent-encoded string safe for a query component.

### `encodeFragment(value)`
Returns a percent-encoded string safe for a fragment component.

### `encodeURIComponentCustom(value, extraSafeChars)`
Returns a percent-encoded string where `extraSafeChars` (an array of characters) are also left unescaped.
