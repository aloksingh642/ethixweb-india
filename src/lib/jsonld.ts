/**
 * Serialises structured data for a <script type="application/ld+json"> block.
 *
 * Escaping `<` as \\u003c is the standard defence against a `</script>` inside a
 * JSON string terminating the block early. It is safe in JSON — \\u003c and < are
 * the same character to every conformant parser — but inert inside an HTML
 * script element.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
