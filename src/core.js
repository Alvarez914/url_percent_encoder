/**
 * Reserved character sets per RFC 3986.
 *
 * The core rule is: characters that are allowed unescaped in a URI component
 * differ depending on where the component appears. We implement the most
 * widely used practical split:
 *
 * - Path segments keep pchar plus '/' (the separator is handled by the caller
 *   if needed).
 * - Query strings allow pchar plus '/' and '?'.
 * - Fragment strings allow pchar plus '/' and '?'.
 *
 * We deliberately do not encode '*' for query/fragment because RFC 3986
 * leaves it as a reserved character that many servers and clients accept
 * unescaped, and encoding it can break form-urlencoded payloads. For path
 * segments we also leave '*' unescaped for the same interoperability reason.
 *
 * Characters that are always safe: ALPHA / DIGIT / "-" / "." / "_" / "~"
 * plus the additional component-specific set.
 */

const ALWAYS_SAFE = new Set(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'.split('')
);

const PATH_EXTRA_SAFE = new Set(['!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':', '@']);
const QUERY_EXTRA_SAFE = new Set(['!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':', '@', '/', '?']);
const FRAGMENT_EXTRA_SAFE = new Set(['!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':', '@', '/', '?']);

/**
 * Percent-encode a string using the supplied set of characters that may
 * remain unescaped. Space is always encoded as %20, never '+'.
 */
function encodeWithSafeSet(value, safeSet) {
  let out = '';
  for (const ch of String(value)) {
    const code = ch.codePointAt(0);
    if (code === undefined) continue;
    if (code < 0x80) {
      if (safeSet.has(ch) || ALWAYS_SAFE.has(ch)) {
        out += ch;
      } else {
        out += percentEncodeByte(code);
      }
    } else {
      out += percentEncodeUtf8(ch);
    }
  }
  return out;
}

function percentEncodeByte(byte) {
  return '%' + byte.toString(16).toUpperCase().padStart(2, '0');
}

function percentEncodeUtf8(ch) {
  const bytes = new TextEncoder().encode(ch);
  let out = '';
  for (const byte of bytes) {
    out += percentEncodeByte(byte);
  }
  return out;
}

/**
 * Percent-encode a string for use as a single path segment.
 * Slash characters are encoded so that a segment containing '/' does not
 * alter the path hierarchy.
 */
export function encodePath(value) {
  return encodeWithSafeSet(value, PATH_EXTRA_SAFE);
}

/**
 * Percent-encode a string for use as a query component.
 * Slash and question mark are left unescaped because they are allowed in
 * query data and commonly used by APIs.
 */
export function encodeQuery(value) {
  return encodeWithSafeSet(value, QUERY_EXTRA_SAFE);
}

/**
 * Percent-encode a string for use as a fragment component.
 * Slash and question mark are allowed in fragments per RFC 3986.
 */
export function encodeFragment(value) {
  return encodeWithSafeSet(value, FRAGMENT_EXTRA_SAFE);
}

/**
 * Expose the underlying encoder for callers who need a custom safe set.
 * This is intentionally kept simple: it accepts an array of characters that
 * will remain unescaped in addition to the always-safe set.
 */
export function encodeURIComponentCustom(value, extraSafeChars) {
  const safe = new Set(extraSafeChars);
  return encodeWithSafeSet(value, safe);
}
