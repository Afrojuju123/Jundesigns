import assert from "node:assert";
import {
  SCHOOL_PACKAGES,
  SCHOOL_ACTIVITIES,
  getPackagesForGroupSize,
  getPricePerStudent,
  estimateTotal,
} from "./src/data/schools.ts";

console.log("=== Running Schools & Groups Tier Boundary Test Suite ===\n");

// 1. Verify Activities and Packages Integrity
assert.strictEqual(SCHOOL_PACKAGES.length, 3, "There must be exactly 3 packages");
assert.strictEqual(Object.keys(SCHOOL_ACTIVITIES).length, 8, "There must be exactly 8 activities");

const bronze = SCHOOL_PACKAGES.find((p) => p.id === "bronze");
const silver = SCHOOL_PACKAGES.find((p) => p.id === "silver");
const gold = SCHOOL_PACKAGES.find((p) => p.id === "gold");

assert.ok(bronze && silver && gold, "All three packages must exist");
assert.strictEqual(bronze.activities.length, 5, "Bronze has 5 activities");
assert.strictEqual(silver.activities.length, 6, "Silver has 6 activities");
assert.strictEqual(gold.activities.length, 8, "Gold has 8 activities");
console.log("✅ Package structures and activity assignments verified");

// 2. Boundary Test Grid
const boundaryTests = [
  // [students, bronzeExpected, silverExpected, goldExpected]
  [24, null, null, null],
  [25, 5000, null, null],
  [35, 5000, 7000, null],
  [49, 5000, 7000, null],
  [50, 5000, 7000, 8000],
  [65, 5000, 7000, 8000],
  [66, 5000, 7000, 8000],
  [100, 5000, 7000, 8000],
  [101, 5000, 6500, 7500],
  [130, 5000, 6500, 7500],
  [131, 4500, 6500, 7500],
  [200, 4500, 6500, 7500],
  [201, 4500, 6000, 7000],
  [500, 4500, 6000, 7000],
];

console.log("\nTesting all 14 tier boundaries across Bronze, Silver, Gold...");

for (const [n, bExp, sExp, gExp] of boundaryTests) {
  const bActual = getPricePerStudent("bronze", n);
  const sActual = getPricePerStudent("silver", n);
  const gActual = getPricePerStudent("gold", n);

  assert.strictEqual(
    bActual,
    bExp,
    `Bronze at n=${n}: expected ${bExp}, got ${bActual}`
  );
  assert.strictEqual(
    sActual,
    sExp,
    `Silver at n=${n}: expected ${sExp}, got ${sActual}`
  );
  assert.strictEqual(
    gActual,
    gExp,
    `Gold at n=${n}: expected ${gExp}, got ${gActual}`
  );
  console.log(`  n=${String(n).padStart(3, " ")} -> Bronze: ${bActual || "N/A"}, Silver: ${sActual || "N/A"}, Gold: ${gActual || "N/A"}`);
}
console.log("✅ All 14 tier boundaries match specification perfectly");

// 3. Testing Totals & Estimation Calculations
console.log("\nTesting total calculation estimates...");
const estBronze80 = estimateTotal("bronze", 80);
assert.ok(estBronze80, "Estimate for Bronze at 80 students must not be null");
assert.strictEqual(estBronze80.perStudent, 5000);
assert.strictEqual(estBronze80.total, 400000, "80 students on Bronze = 80 x 5000 = 400,000 RWF");
console.log(`  Bronze @ 80: ${estBronze80.students} x ${estBronze80.perStudent} = ${estBronze80.total.toLocaleString()} RWF`);

const estSilver120 = estimateTotal("silver", 120);
assert.ok(estSilver120);
assert.strictEqual(estSilver120.perStudent, 6500);
assert.strictEqual(estSilver120.total, 780000);
console.log(`  Silver @ 120: ${estSilver120.students} x ${estSilver120.perStudent} = ${estSilver120.total.toLocaleString()} RWF`);

const estGold150 = estimateTotal("gold", 150);
assert.ok(estGold150);
assert.strictEqual(estGold150.perStudent, 7500);
assert.strictEqual(estGold150.total, 1125000);
console.log(`  Gold @ 150: ${estGold150.students} x ${estGold150.perStudent} = ${estGold150.total.toLocaleString()} RWF`);

const estGold250 = estimateTotal("gold", 250);
assert.ok(estGold250);
assert.strictEqual(estGold250.perStudent, 7000);
assert.strictEqual(estGold250.total, 1750000);
console.log(`  Gold @ 250: ${estGold250.students} x ${estGold250.perStudent} = ${estGold250.total.toLocaleString()} RWF`);

// 4. Testing getPackagesForGroupSize
assert.strictEqual(getPackagesForGroupSize(20).length, 0);
assert.strictEqual(getPackagesForGroupSize(25).length, 1); // bronze only
assert.strictEqual(getPackagesForGroupSize(35).length, 2); // bronze + silver
assert.strictEqual(getPackagesForGroupSize(50).length, 3); // bronze + silver + gold
console.log("✅ getPackagesForGroupSize filtered accurately by minStudents");

console.log("\n🎉 ALL SCHOOLS DATA TESTS PASSED!\n");
