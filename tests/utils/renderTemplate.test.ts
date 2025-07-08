import { renderTemplate } from "../../src/utils/renderTemplate";
import fs from "fs";

jest.mock("fs");

describe("renderTemplate", () => {
  const fakeTemplate = `
    <html>
      <body>
        <p>Code: \${code}</p>
        <p>Title: \${title}</p>
        <p>Description: \${description}</p>
        <p>Status: \${status}</p>
        <p>Start: \${startDate}</p>
        <p>End: \${expireDate}</p>
        <p>Value: \${value}</p>
      </body>
    </html>
  `;

  const mockVoucher: any = {
    code: "VC123",
    title: "Test Voucher",
    description: "This is a test",
    status: true,
    startDate: new Date("2025-07-01T00:00:00Z"),
    expireDate: new Date("2025-08-01T00:00:00Z"),
    value: 10,
    isPercent: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.readFileSync as jest.Mock).mockReturnValue(fakeTemplate);
  });

  it("should replace all placeholders with voucher data", () => {
    const html = renderTemplate(mockVoucher);

    expect(fs.readFileSync).toHaveBeenCalled();
    expect(html).toContain("VC123");
    expect(html).toContain("Test Voucher");
    expect(html).toContain("This is a test");
    expect(html).toContain("Active");
    expect(html).toContain("10%");

    expect(html).toMatch(/Start: .*2025/);
    expect(html).toMatch(/End: .*2025/);
  });

  it("should fallback description to '-' if null", () => {
    const v = { ...mockVoucher, description: null };
    const html = renderTemplate(v);
    expect(html).toContain("<p>Description: -</p>");
  });

  it("should show 'Inactive' if status is false", () => {
    const v = { ...mockVoucher, status: false };
    const html = renderTemplate(v);
    expect(html).toContain("<p>Status: Inactive</p>");
  });

  it("should use $ suffix if not percent", () => {
    const v = { ...mockVoucher, isPercent: false };
    const html = renderTemplate(v);
    expect(html).toContain("<p>Value: 10$</p>");
  });
});
