import express, { Router } from "express";
import { sessionMiddleware } from "./login";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
export let emailRouter = Router();

emailRouter.use(express.json());
emailRouter.use(sessionMiddleware);

let senderEmail = "cpky216@gmail.com";

export let transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: "cpky216@gmail.com",
    pass: "qlefhklcekgupfif",
  },
});

export async function sendClaimEmail( //send Claim submission confirm email
  email: string,
  employeeName: string,
  claimId: number,
  claimTypeText: string,
  claimDesVal: string,
  amount: number
) {
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "KEUNG TWO INC.",
      link: "https://mailgen.js/",
      copyright: "Copyright © 2023 KEUNG TWO INC. All rights reserved.",
    },
  });
  let emailMessage = {
    body: {
      signature: "Sincerely",
      title: `Hi ${employeeName}, your claim has been successfully submitted.`,
      table: {
        data: [
          {
            "Claim Id": claimId,
            "Claim Type": claimTypeText,
            Description: claimDesVal,
            Amount: amount,
          },
        ],
        columns: {
          customWidth: {
            "Claim Id": "20%",
          },

          customAlignment: {
            "Claim Id": "center",
            "Claim Type": "center",
            Description: "center",
            Amount: "center",
          },
        },
      },
      action: {
        instructions:
          "You can check the status of your claim and more in your dashboard:",
        button: {
          color: "#49a5e3",
          text: "Go to Dashboard",
          link: "http://localhost:8000/dashboard",
        },
      },
    },
  };
  let mail = mailGenerator.generate(emailMessage);
  let message = await transporter.sendMail({
    from: senderEmail, //from here set the main sender email
    to: email, //receiver email from formdata - field email
    subject: "Your Claim has been submitted.",
    //text: "testingemail",
    html: mail, //mail message need refer to formdata info
  });
  console.log("claim submit message sent:", message.messageId);
}

export async function forgotPwEmail(
  email: string,
  employeeName: string,
  link: string
) {
  //send forgot password email to update
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "KEUNG TWO INC.",
      link: "https://mailgen.js/",
      copyright: "Copyright © 2023 KEUNG TWO INC. All rights reserved.",
    },
  });
  let emailMessage = {
    body: {
      name: `${employeeName}`,
      signature: "Sincerely",
      intro:
        "You have received this email because a password reset request for your account was received.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#DC4D2F",
          text: "Reset Your Password",
          link: link,
        },
      },
      outro:
        "If you did not request a password reset, please contact the admin.",
    },
  };
  let mail = mailGenerator.generate(emailMessage);
  let message = await transporter.sendMail({
    from: senderEmail, //from here set the main sender email
    to: email, //receiver email from body - body email
    subject: "Password Reset",
    //text: "testingemail",
    html: mail, //mail message need refer to formdata info
  });
  console.log("reset password message sent:", message.messageId);
}

export async function statusEmail( //send Claim status update email
  email: string,
  employeeName: string,
  claimId: number,
  claimTypeText: string,
  amount: number,
  status: string
) {
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "KEUNG TWO INC.",
      link: "https://mailgen.js/",
      copyright: "Copyright © 2023 KEUNG TWO INC. All rights reserved.",
    },
  });
  let emailMessage = {
    body: {
      signature: "Sincerely",
      title: `Hi ${employeeName}, your claim has been ${status}.`,
      table: {
        data: [
          {
            "Claim Id": claimId,
            "Claim Type": claimTypeText,
            Amount: amount,
            Status: status,
          },
        ],
        columns: {
          customWidth: {
            "Claim Id": "20%",
          },

          customAlignment: {
            "Claim Id": "center",
            "Claim Type": "center",
            Amount: "center",
            Status: "center",
          },
        },
      },
      action: {
        instructions: "You can check the status and details of your claim:",
        button: {
          color: "#29A0B1",
          text: `Check Details`,
          link: `http://localhost:8000/claiminfo.html?id=${claimId}`,
        },
      },
    },
  };
  let mail = mailGenerator.generate(emailMessage);
  let message = await transporter.sendMail({
    from: senderEmail, //from here set the main sender email
    to: email, //receiver email from formdata - field email
    subject: "Your Claim status has been updated.",
    //text: "testingemail",
    html: mail, //mail message need refer to formdata info
  });
  console.log("status message sent:", message.messageId);
}
