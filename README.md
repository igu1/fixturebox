# fixturebox

**Turn real API responses into safe development fixtures.**

> One small problem. One obvious API. Very little setup. Immediate value.

Real data is the best seed for tests and bug reproductions — and it leaks
PII / secrets the moment you commit it. `fixturebox` keeps the shape,
drops the PII.

## Install

```bash
npm i fixturebox
```

## Usage

```ts
import { fixture } from "fixturebox";

const safe = fixture(realApiResponse);
```

```jsonc
// in
{ "name": "Mohammed Ali", "email": "ali@example.com", "phone": "+919876543210", "customer_id": "cus_829123" }

// out
{ "name": "Alex Stone",  "email": "alex.stone1@example.test", "phone": "+1-555-0101", "customer_id": "customer_fake_001" }
```

Preserved automatically:

- structure and nesting
- field types (`id: 91` → `id: 1`, `active: true` stays)
- nullable fields (`maybe: null` stays `null`)
- array length (`items: [1,2,3]` → `[1, 2, 3]`)
- **relationships**: the same original value maps to the same fake in one run

```ts
fixture({ user_id: 91, orders: [{ user_id: 91 }, { user_id: 92 }] });
// → { user_id: 1, orders: [{ user_id: 1 }, { user_id: 2 }] }
```

Replaced by key-name heuristics (or force them):

```ts
fixture(data, {
  fields: { email: "email", phone: "phone", customer_id: "id" },  // override per key
  // kinds: name | email | phone | id | token | password | address | ip | date | text
});
```

## CLI

```bash
cat production-response.json | fixturebox                    # safe JSON to stdout
fixturebox production-response.json -o fixtures/response.json
```

## Notes

- zero runtime dependencies
- ESM + CJS + `.d.ts` + `bin`
- Node >= 18
- heuristic coverage: email, phone, name, password/secret, tokens, ids,
  address/city, ip, birthday — other keys pass through as `text`

## License

MIT
