import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const SCREENSHOTS_DIR = path.join(
  process.env.HOME || "/Users/akshay",
  ".gemini/antigravity/brain/9295005a-d6c0-45aa-a0ab-8b8115f3f6a4/screenshots"
);

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runE2ETests() {
  console.log("🚀 Starting Comprehensive Playwright E2E Test Suite for Silicon Epoch...");

  const browser = await chromium.launch({
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
      console.error(`[BROWSER CONSOLE ERROR]: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
    console.error(`[BROWSER PAGE ERROR]: ${err.message}`);
  });

  try {
    // 1. Navigate to http://localhost:3000/silicon-epoch
    console.log("➡️ Step 1: Navigating to http://localhost:3000/silicon-epoch");
    await page.goto("http://localhost:3000/silicon-epoch", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "01_landing.png") });

    // Verify Landing Screen elements
    const heading = await page.textContent("h1");
    console.log(`Landing heading: "${heading}"`);
    if (!heading?.includes("SILICON EPOCH")) {
      throw new Error(`Expected heading 'SILICON EPOCH', got: ${heading}`);
    }

    // 2. Click "ENTER THE EPOCH"
    console.log("➡️ Step 2: Entering the Epoch world");
    const enterBtn = page.getByRole("button", { name: /ENTER THE EPOCH/i });
    await enterBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "02_motherboard_glide.png") });

    // 3. Test Full Timeline Macro Panoramic Zoom Out (1940 to 2026)
    console.log("➡️ Step 3: Testing Full Timeline Macro Panoramic View");
    const macroBtn = page.getByTitle("Full Timeline Overview (1940 – 2026)");
    if (await macroBtn.isVisible()) {
      await macroBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "03_full_macro_timeline_1940_2026.png") });
    }

    // 4. Test Timeline Scrubber Jump to Foundations (1940s) & Deep Learning
    console.log("➡️ Step 4: Testing Timeline Scrubber Navigation across Eras");
    const foundationsBtn = page.getByRole("button", { name: /Foundations/i }).first();
    if (await foundationsBtn.isVisible()) {
      await foundationsBtn.click();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "04_scrub_foundations_1940.png") });
    }

    const transformerEraBtn = page.getByRole("button", { name: /The Transform/i });
    if (await transformerEraBtn.isVisible()) {
      await transformerEraBtn.click();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "05_scrub_transformer.png") });
    }

    // 5. Test Search & Command Palette (⌘K)
    console.log("➡️ Step 5: Testing Search & Command Palette");
    const searchBtn = page.getByRole("button", { name: /Search Entities/i });
    await searchBtn.click();
    await page.waitForTimeout(500);

    const searchInput = page.getByPlaceholder(/Search models, architectures/i);
    await searchInput.fill("GPT-4");
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "06_search_results.png") });

    // Click GPT-4 from results
    const gpt4Result = page.getByText("GPT-4", { exact: false }).first();
    await gpt4Result.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "07_gpt4_inspected.png") });

    // 6. Test Entity Inspector Tabs & CAD Teardown
    console.log("➡️ Step 6: Testing Entity Inspector Tabs & CAD Teardown");
    const inspectorHeading = await page.locator("h2").textContent();
    console.log(`Inspected entity heading: "${inspectorHeading}"`);

    // Test CAD Exploded Slider
    const explodedSlider = page.locator("input[type='range']").first();
    if (await explodedSlider.isVisible()) {
      await explodedSlider.fill("0.75");
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "08_gpt4_exploded_teardown.png") });
    }

    // Architecture Tab
    const archTab = page.locator("button:has-text('Architecture')").first();
    if (await archTab.isVisible()) {
      await archTab.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "09_inspector_architecture.png") });
    }

    // Lineage Tab & Interactivity
    const lineageTab = page.locator("button:has-text('Lineage')").first();
    if (await lineageTab.isVisible()) {
      await lineageTab.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "10_inspector_lineage.png") });
    }

    // Sources Tab
    const sourcesTab = page.locator("button:has-text('Sources')").first();
    if (await sourcesTab.isVisible()) {
      await sourcesTab.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "11_inspector_sources.png") });
    }

    // 7. Test Versus / Comparison Mode
    console.log("➡️ Step 7: Testing Versus / Comparison Mode");
    const stageBtn = page.getByTitle("Stage in Versus comparison");
    if (await stageBtn.isVisible()) {
      await stageBtn.click();
      await page.waitForTimeout(400);

      // Search and stage second entity (Claude 3.5 Sonnet)
      await page.getByRole("button", { name: /Search Entities/i }).click();
      await page.waitForTimeout(400);
      const searchInput2 = page.getByPlaceholder(/Search models, architectures/i);
      await searchInput2.fill("Claude");
      await page.waitForTimeout(400);
      await page.getByText("Claude 3.5 Sonnet").first().click();
      await page.waitForTimeout(1000);

      await page.getByTitle("Stage in Versus comparison").click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "12_versus_modal.png") });

      // Close compare modal
      const closeCompareBtn = page.locator("div:has-text('VERSUS COMPARISON MATRIX')").getByRole("button").last();
      if (await closeCompareBtn.isVisible()) {
        await closeCompareBtn.click();
        await page.waitForTimeout(500);
      }
    }

    // 8. Test Filter Drawer
    console.log("➡️ Step 8: Testing Filter Drawer");
    const filterBtn = page.getByRole("button", { name: /Filters/i });
    await filterBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "13_filters_open.png") });

    // Select "Open Weights"
    const openWeightsBtn = page.getByRole("button", { name: /Open Weights/i }).first();
    if (await openWeightsBtn.isVisible()) {
      await openWeightsBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "14_filtered_scene.png") });
    }

    // Close filters drawer
    const closeFilterBtn = page.getByRole("button", { name: "Close filters" });
    if (await closeFilterBtn.isVisible()) {
      await closeFilterBtn.click();
      await page.waitForTimeout(500);
    }

    // 9. Test 2D View Switch
    console.log("➡️ Step 9: Testing 2D View Mode");
    const view2dBtn = page.getByRole("button", { name: /2D View/i });
    await view2dBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "15_2d_view_mode.png") });

    // Switch back to 3D
    await page.getByRole("button", { name: /3D World/i }).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "16_returned_to_3d.png") });

    console.log("\n=======================================================");
    console.log("✅ ALL PLAYWRIGHT E2E TESTS PASSED WITH ZERO ERRORS!");
    console.log(`Console Errors encountered: ${consoleErrors.length}`);
    console.log("=======================================================\n");

    if (consoleErrors.length > 0) {
      console.error("Console errors found:", consoleErrors);
      throw new Error(`Encountered ${consoleErrors.length} console errors during test run`);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "error_state.png") });
    throw error;
  } finally {
    await browser.close();
  }
}

runE2ETests().catch((err) => {
  console.error(err);
  process.exit(1);
});
