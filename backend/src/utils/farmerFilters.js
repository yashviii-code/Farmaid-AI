const TEST_FARMER_NAME = "API Test Farmer";
const TEST_EMAIL_PATTERN = /^apitest\+/i;

export function isVisibleFarmer(user) {
  return (
    user?.role === "farmer" &&
    String(user?.fullName || "").trim() !== TEST_FARMER_NAME &&
    !TEST_EMAIL_PATTERN.test(String(user?.email || "").trim())
  );
}

export function parseFarmArea(value) {
  const match = String(value || "").match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}
