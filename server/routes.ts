import type { Express } from "express";
import { createServer, type Server } from "node:http";
import nodemailer from "nodemailer";

const ADMIN_NOTIFICATION_EMAIL = "charge.spotter0213@gmail.com";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api
  app.post("/api/add-spot/notify", async (req, res) => {
    const {
      userEmail,
      venueName,
      venueType,
      outletCount,
      notes,
      latitude,
      longitude,
    } = req.body ?? {};

    if (
      typeof userEmail !== "string" ||
      typeof venueName !== "string" ||
      typeof venueType !== "string"
    ) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
      console.log(
        "SMTP is not configured. Skipping add spot email notification.",
      );
      return res.status(202).json({ delivered: false, skipped: true });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: ADMIN_NOTIFICATION_EMAIL,
        replyTo: userEmail,
        subject: `[Charge Spotter] New spot submission: ${venueName}`,
        text: [
          "A new spot submission was received.",
          "",
          `Submitted by: ${userEmail}`,
          `Venue: ${venueName}`,
          `Type: ${venueType}`,
          `Outlets: ${String(outletCount ?? "")}`,
          `Latitude: ${String(latitude ?? "")}`,
          `Longitude: ${String(longitude ?? "")}`,
          `Notes: ${String(notes ?? "")}`,
        ].join("\n"),
      });

      return res.json({ delivered: true });
    } catch (error) {
      console.log("Failed to send add spot notification email:", error);
      return res.status(500).json({ message: "Email send failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
