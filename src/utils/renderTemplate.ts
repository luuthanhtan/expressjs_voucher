import fs from "fs";
import path from "path";
import { voucherDocument } from "models/voucher.model";

export const renderTemplate = (
  voucher: voucherDocument
): string => {
  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    "voucher-detail.html"
  );
  let html = fs.readFileSync(templatePath, "utf-8");
  const data: Record<string, any> = {
    code: voucher.code,
    title: voucher.title,
    description: voucher.description ?? "-",
    status: voucher.status ? "Active" : "Inactive",
    startDate: new Date(voucher.startDate).toLocaleString(),
    expireDate: new Date(voucher.expireDate).toLocaleString(),
    value: voucher.isPercent ? `${voucher.percentage}%` : `$${voucher.value}`,
  };
  for (const key in data) {
    html = html.replace(new RegExp(`\\$\\{${key}\\}`, "g"), data[key]);
  }
  return html;
};
