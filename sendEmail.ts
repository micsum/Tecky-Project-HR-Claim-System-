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
