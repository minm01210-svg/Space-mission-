# NASA CCMC DONKI datasets

Generated from the official CCMC DONKI API at https://ccmc.gsfc.nasa.gov/DONKI-API for 2024-01-01 through 2026-11-11.

## Files

- csv/: one reviewable CSV per DONKI collection.
- `raw/`: the original JSON responses, split by endpoint and two-month request window.
- manifest.json: source, dates, counts, URLs, and any failed requests.

The CSVs are event-level extracts. Scalar nested properties are expanded into dotted columns; nested arrays/objects that cannot be represented safely as scalar columns are kept as compact JSON text inside a CSV cell. This preserves the source information without silently treating missing values as zero.

The data is suitable for space-weather context and scenario testing around launch/travel operations. It is not a substitute for vehicle performance data, precise ephemerides, trajectory optimization, or an operational launch-weather feed. Review `manifest.json` for the 14 request windows that remained unavailable and review the source documentation before using it in a mission simulation.

The OpenAPI specification used to identify the collections is preserved at C:/Users/ASUS/Downloads/api-1.json and was not modified.
