import * as fb from "../src/index";

console.log("\x1b[90m$ npm i fixturebox\n\x1b[0m");

console.log("\x1b[32m1. real production data (unsafe to copy into tests)\x1b[0m\n");
const real = {
  name: "Mohammed Ali",
  email: "ali@example.com",
  phone: "+919876543210",
  customer_id: "cus_829123",
  auth_token: "eyJhbGciOiJIUzI1IsInR5cCI6",
  city: "Pondicherry",
  notes: "First signup on the new landing page",
};
console.log(real);

console.log("\x1b[32m\n2. fixture(real) — safe to commit\x1b[0m\n");
console.log(fb.fixture(real));

console.log("\x1b[32m\n3. relationships survive: same value -> same fake\x1b[0m\n");
const withOrders = {
  user_id: 91,
  orders: [{ user_id: 91 }, { user_id: 92 }],
};
console.log(fb.fixture(withOrders));
