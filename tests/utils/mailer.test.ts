import { sendMail } from "../../src/utils/mailer";
import nodemailer from "nodemailer";

// Lấy lại mock để kiểm tra
const sendMailMock = (nodemailer as any).sendMailMock;

describe("sendMail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call nodemailer sendMail with correct params", async () => {
    sendMailMock.mockResolvedValueOnce({ messageId: "12345" });

    const to = "test@example.com";
    const subject = "Test Email";
    const html = "<p>Hello</p>";

    await sendMail(to, subject, html);

    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalledWith({
      from: `"Voucher App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  });

  it("should throw error if sendMail fails", async () => {
    sendMailMock.mockRejectedValueOnce(new Error("SMTP failed"));

    await expect(
      sendMail("test@example.com", "Fail", "<p>error</p>")
    ).rejects.toThrow("SMTP failed");
  });
});
