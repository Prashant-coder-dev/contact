import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("Contact backend is running ✅");
});

/* ================= CONTACT API ================= */
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  try {
    await resend.emails.send({
      from: "WealthEngine <onboarding@resend.dev>",
      to: process.env.RECEIVER_EMAIL,
      subject: "New Contact Form Message",
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });

    res.json({ success: true, message: "Message sent successfully" });

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send message" });
  }
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
