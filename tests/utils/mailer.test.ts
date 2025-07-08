import { sendMail } from "../../src/utils/mailer";
import nodemailer from "nodemailer";

// Mock nodemailer
jest.mock("nodemailer");
const sendMailMock = jest.fn();
(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: sendMailMock,
});

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

    expect(nodemailer.createTransport).toHaveBeenCalled(); // optional
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
