import {
  calculateItemVials,
  calculateTotalVials,
  calculateTotalLabels,
  getStoreSellingUnitConfig,
} from './vialCalculation';

function runTests() {
  console.log('=== RUNNING SELLING UNIT & VIAL CALCULATION TEST SUITE ===\n');

  let passed = 0;
  let failed = 0;

  function assertEqual(testName: string, actual: any, expected: any) {
    if (actual === expected) {
      console.log(`[PASS] ${testName}: expected ${expected}, got ${actual}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}: expected ${expected}, got ${actual}`);
      failed++;
    }
  }

  // Test 1: Per Kit product (5 Kits × 10 Vials/Kit + 1 Accessory)
  const test1Items = [
    { name: 'Tirzepatide 10mg', quantity: 5, sellingUnit: 'kit' as const, vialsPerKit: 10 },
    { name: 'BAC Water 30ml', quantity: 1, isAccessory: true },
  ];
  assertEqual('Test 1 - Total Vials (5 Kits x 10 Vials/Kit + 1 Accessory)', calculateTotalVials(test1Items), 50);
  assertEqual('Test 1 - Total Labels', calculateTotalLabels(test1Items), 50);

  // Test 2: Per Kit product with non-10 Vials/Kit (3 Kits × 5 Vials/Kit)
  const test2Items = [
    { name: 'Semaglutide 5mg (5 Vials Kit)', quantity: 3, sellingUnit: 'kit' as const, vialsPerKit: 5 },
  ];
  assertEqual('Test 2 - Total Vials (3 Kits x 5 Vials/Kit)', calculateTotalVials(test2Items), 15);
  assertEqual('Test 2 - Total Labels', calculateTotalLabels(test2Items), 15);

  // Test 3: Per Vial product (10 Vials)
  const test3Items = [
    { name: 'BPC-157 5mg Vial', quantity: 10, sellingUnit: 'vial' as const },
  ];
  assertEqual('Test 3 - Total Vials (10 Single Vials)', calculateTotalVials(test3Items), 10);
  assertEqual('Test 3 - Total Labels', calculateTotalLabels(test3Items), 10);

  // Test 4: Per Vial product high quantity (50 Vials)
  const test4Items = [
    { name: 'TB-500 10mg Vial', quantity: 50, sellingUnit: 'vial' as const },
  ];
  assertEqual('Test 4 - Total Vials (50 Single Vials)', calculateTotalVials(test4Items), 50);
  assertEqual('Test 4 - Total Labels', calculateTotalLabels(test4Items), 50);

  // Test 5: Mixed Order (2 Kits x 10 Vials/Kit + 5 Single Vials + BAC Water)
  const test5Items = [
    { name: 'Retatrutide 10mg Kit', quantity: 2, sellingUnit: 'kit' as const, vialsPerKit: 10 },
    { name: 'AOD-9604 Single Vial', quantity: 5, sellingUnit: 'vial' as const },
    { name: 'Reconstitution Solution', quantity: 2, isAccessory: true },
  ];
  assertEqual('Test 5 - Total Vials (2 Kits x 10 + 5 Vials + Solution)', calculateTotalVials(test5Items), 25);
  assertEqual('Test 5 - Total Labels', calculateTotalLabels(test5Items), 25);

  // Test 6: Fallback for legacy product without explicit sellingUnit
  const test6Items = [
    { name: 'Tirzepatide', variantLabel: '10 Vials / Kit', quantity: 2 },
  ];
  assertEqual('Test 6 - Legacy Fallback (2 Kits x 10 Vials via label)', calculateTotalVials(test6Items), 20);

  // Test 7: Accessories Isolation
  const test7Items = [
    { name: 'BAC Water 30ml', quantity: 5, isAccessory: true },
    { name: 'Sterile Syringes 10-pack', quantity: 3, isAccessory: true },
  ];
  assertEqual('Test 7 - Accessories Only Total Vials', calculateTotalVials(test7Items), 0);

  console.log('\n--- STORE ISOLATION TESTS (A-G) ---');

  // Test A: Product configured with different selling units across 3 stores
  const productA = {
    id: 'prod-sema-10mg',
    name: 'Semaglutide 10mg',
    groupBuySettings: { sellingUnit: 'vial' as const },
    onHandSettings: { sellingUnit: 'kit' as const, vialsPerKit: 10 },
    moqSettings: { sellingUnit: 'kit' as const, vialsPerKit: 10 },
  };

  const gbConfigA = getStoreSellingUnitConfig(productA, 'groupbuy');
  const ohConfigA = getStoreSellingUnitConfig(productA, 'onhand');
  const moqConfigA = getStoreSellingUnitConfig(productA, 'moq');

  assertEqual('Test A - GroupBuy Selling Unit', gbConfigA.sellingUnit, 'vial');
  assertEqual('Test A - OnHand Selling Unit', ohConfigA.sellingUnit, 'kit');
  assertEqual('Test A - OnHand Vials Per Kit', ohConfigA.vialsPerKit, 10);
  assertEqual('Test A - MOQ Selling Unit', moqConfigA.sellingUnit, 'kit');
  assertEqual('Test A - MOQ Vials Per Kit', moqConfigA.vialsPerKit, 10);

  // Test B: Modify GroupBuy config to Per Kit (5 Vials/Kit). Verify OnHand & MOQ remain untouched.
  const productB = {
    ...productA,
    groupBuySettings: { sellingUnit: 'kit' as const, vialsPerKit: 5 },
  };

  const gbConfigB = getStoreSellingUnitConfig(productB, 'groupbuy');
  const ohConfigB = getStoreSellingUnitConfig(productB, 'onhand');
  const moqConfigB = getStoreSellingUnitConfig(productB, 'moq');

  assertEqual('Test B - GroupBuy Selling Unit after edit', gbConfigB.sellingUnit, 'kit');
  assertEqual('Test B - GroupBuy Vials Per Kit', gbConfigB.vialsPerKit, 5);
  assertEqual('Test B - OnHand Selling Unit preserved', ohConfigB.sellingUnit, 'kit');
  assertEqual('Test B - OnHand Vials Per Kit preserved', ohConfigB.vialsPerKit, 10);
  assertEqual('Test B - MOQ Selling Unit preserved', moqConfigB.sellingUnit, 'kit');

  // Test C: Modify OnHand config to Per Vial. Verify GroupBuy & MOQ remain untouched.
  const productC = {
    ...productB,
    onHandSettings: { sellingUnit: 'vial' as const },
  };

  const gbConfigC = getStoreSellingUnitConfig(productC, 'groupbuy');
  const ohConfigC = getStoreSellingUnitConfig(productC, 'onhand');
  const moqConfigC = getStoreSellingUnitConfig(productC, 'moq');

  assertEqual('Test C - GroupBuy Selling Unit preserved', gbConfigC.sellingUnit, 'kit');
  assertEqual('Test C - GroupBuy Vials Per Kit preserved', gbConfigC.vialsPerKit, 5);
  assertEqual('Test C - OnHand Selling Unit updated to vial', ohConfigC.sellingUnit, 'vial');
  assertEqual('Test C - MOQ Selling Unit preserved', moqConfigC.sellingUnit, 'kit');
  assertEqual('Test C - MOQ Vials Per Kit preserved', moqConfigC.vialsPerKit, 10);

  // Test D: Cart with 1 GroupBuy item (5 Vials) + 1 MOQ item (5 Kits x 10 Vials/Kit)
  const cartItems = [
    {
      name: 'Semaglutide 10mg (GroupBuy)',
      quantity: 5,
      sellingUnit: gbConfigA.sellingUnit, // 'vial'
      vialsPerKit: gbConfigA.vialsPerKit,
    },
    {
      name: 'Semaglutide 10mg (MOQ)',
      quantity: 5,
      sellingUnit: moqConfigA.sellingUnit, // 'kit'
      vialsPerKit: moqConfigA.vialsPerKit, // 10
    },
  ];

  assertEqual('Test D - Total Vials in Cart (5 Vials + 5 Kits x 10)', calculateTotalVials(cartItems), 55);

  // Test E: Shipping Fee calculation based on total vials = 55
  assertEqual('Test E - Total Labels for Shipping Engine', calculateTotalLabels(cartItems), 55);

  // Test F: Placed Order retains historical snapshot (55 Vials / 55 Labels)
  const orderSnapshot = {
    orderId: 'ORD-2026-9901',
    items: JSON.parse(JSON.stringify(cartItems)),
    totalVials: calculateTotalVials(cartItems),
    totalLabels: calculateTotalLabels(cartItems),
  };

  // Admin edits product later...
  const productD = {
    ...productC,
    groupBuySettings: { sellingUnit: 'kit' as const, vialsPerKit: 10 },
  };

  assertEqual('Test F - Order Total Vials Historical Snapshot', orderSnapshot.totalVials, 55);
  assertEqual('Test F - Order Total Labels Historical Snapshot', orderSnapshot.totalLabels, 55);

  // Test G: Packing & Shipping label calculations match order snapshot (55 Labels)
  assertEqual('Test G - Packing & Shipping Labels Count', calculateTotalLabels(orderSnapshot.items), 55);

  console.log(`\nRESULTS: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) {
    throw new Error('Some test cases failed!');
  }
}

runTests();
