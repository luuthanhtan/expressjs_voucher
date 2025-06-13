import { emailConfig } from 'config/mail';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: Number(emailConfig.port),
    secure: Number(emailConfig.port) == 465 ? true : false,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
    },
} as SMTPTransport.Options);

export const sendMail = async (to: string, subject: string, html: string) => {
    await transporter.sendMail({
        from: `"Voucher App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};
