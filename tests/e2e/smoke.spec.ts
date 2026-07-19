import { expect, test } from "@playwright/test";

test("landing page communicates the product and opens the demo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("AI drafts customer replies");
  await page.getByRole("link", { name: /try the live demo/i }).first().click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole("heading", { name: /four simple steps/i })).toBeVisible();
});

test("sample scenario fills the support form", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: /delayed delivery/i }).click();
  await expect(page.getByLabel(/Customer name/)).toHaveValue("John Venancio");
  await expect(page.getByLabel(/How can we help/)).toHaveValue(/tracking has not changed/);
});

test("dashboard loads redacted support operations data", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Support overview" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Support queue" })).toBeVisible();
  await expect(page.getByText("Customer details are redacted in the public view.")).toBeVisible();
  const firstTicket = page.getByRole("list", { name: "Support ticket queue" }).getByRole("listitem").first();
  await expect(firstTicket).toBeVisible();
  await expect(firstTicket).toContainText(/[A-Z][a-z]+ [A-Z]\./);
});
