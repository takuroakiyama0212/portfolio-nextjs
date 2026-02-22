/**
 * Bulk upload libraries from CSV to Firestore.
 *
 * Requirements (per request):
 * - Uses firebase-admin and csv-parser
 * - Service account key filename: ./serviceAccountKey.json
 * - CSV filename: plconnect-directory-branches-2024-05-29.csv
 * - Collection: libraries
 *
 * Run:
 *   node scripts/upload-libraries-to-firestore.js
 *
 * Optional:
 *   DRY_RUN=1 node scripts/upload-libraries-to-firestore.js
 */

/* eslint-disable no-console */
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var csvParser = require("csv-parser");
var admin = require("firebase-admin");

var KEY_PATH = path.resolve(process.cwd(), "./serviceAccountKey.json");
var CSV_PATH = path.resolve(process.cwd(), "plconnect-directory-branches-2024-05-29.csv");
var COLLECTION = "libraries";

var DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

function requireServiceAccount(p) {
  if (!fs.existsSync(p)) {
    throw new Error(
      "serviceAccountKey.json not found. Place it at: " +
        p +
        "\n(Example: copy your downloaded Firebase Admin SDK JSON and rename it to serviceAccountKey.json in the project root.)",
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(p);
}

function parseDecimal(value) {
  if (value === null || value === undefined) return null;
  var s = String(value).trim();
  if (!s || s === "-") return null;
  var n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function parseDMY(dmy) {
  // CSV uses e.g. "11/04/2008" (d/m/yyyy). Return ISO string for Firestore.
  if (!dmy) return null;
  var s = String(dmy).trim();
  var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  var day = Number(m[1]);
  var month = Number(m[2]);
  var year = Number(m[3]);
  var dt = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  return Number.isFinite(dt.getTime()) ? dt.toISOString() : null;
}

function compactObject(obj) {
  var out = {};
  Object.keys(obj).forEach(function (k) {
    var v = obj[k];
    if (v === undefined || v === null) return;
    if (typeof v === "string" && v.trim() === "") return;
    out[k] = v;
  });
  return out;
}

function stableDocId(row) {
  // Idempotent docId: hash of (Branch Name + Address + Lat + Lon)
  var name = (row["Branch Name"] || "").trim().toLowerCase();
  var addr1 = (row["Address Line 1"] || "").trim().toLowerCase();
  var locality = (row["Address Locality"] || "").trim().toLowerCase();
  var lat = String(row["Latitude (Decimal)"] || "").trim();
  var lon = String(row["Longitude (Decimal)"] || "").trim();
  var raw = [name, addr1, locality, lat, lon].join("::");
  return crypto.createHash("sha1").update(raw).digest("hex").slice(0, 24);
}

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(
      "CSV not found. Place it at: " + CSV_PATH + "\nExpected filename: plconnect-directory-branches-2024-05-29.csv",
    );
  }

  var serviceAccount = requireServiceAccount(KEY_PATH);

  console.log("Initializing Firebase Admin with project:", serviceAccount.project_id);
  console.log("Service account email:", serviceAccount.client_email);

  try {
    // Check if app is already initialized
    if (admin.apps.length > 0) {
      admin.app().delete();
    }
  } catch (e) {
    // Ignore if no app exists
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }

  var db = admin.firestore();
  
  // Test connection with a simple read operation
  try {
    console.log("Testing Firestore connection...");
    var testRef = db.collection("_test").doc("connection");
    await testRef.set({ test: true, timestamp: admin.firestore.FieldValue.serverTimestamp() });
    await testRef.delete();
    console.log("Firestore connection test successful");
  } catch (error) {
    console.error("Firestore connection test failed:", error.message);
    console.error("This might indicate:");
    console.error("1. Service account lacks Firestore write permissions");
    console.error("2. Firestore API is not enabled for this project");
    console.error("3. Service account key is invalid or expired");
    throw error;
  }
  var bulkWriter = db.bulkWriter();

  var stats = {
    read: 0,
    queued: 0,
    written: 0,
    skippedNoCoords: 0,
    failed: 0,
  };

  bulkWriter.onWriteResult(function () {
    stats.written += 1;
    if (stats.written % 500 === 0) {
      console.log("Progress:", stats.written, "written");
    }
  });
  bulkWriter.onWriteError(function (err) {
    stats.failed += 1;
    console.error("Write error:", err.documentRef && err.documentRef.path, err.message);
    // Retry a couple times on transient errors
    return err.failedAttempts < 3;
  });

  console.log("Uploading to Firestore collection:", COLLECTION);
  console.log("CSV:", CSV_PATH);
  console.log("DRY_RUN:", DRY_RUN ? "YES" : "NO");

  await new Promise(function (resolve, reject) {
    fs.createReadStream(CSV_PATH)
      .pipe(csvParser())
      .on("data", function (row) {
        stats.read += 1;

        var lat = parseDecimal(row["Latitude (Decimal)"]);
        var lon = parseDecimal(row["Longitude (Decimal)"]);
        if (lat === null || lon === null) {
          stats.skippedNoCoords += 1;
          return;
        }

        var addressParts = [
          row["Address Line 1"],
          row["Address Line 2"],
          row["Address Locality"],
          row["Address Postcode"],
        ]
          .map(function (v) {
            return (v || "").trim();
          })
          .filter(Boolean);

        var doc = compactObject({
          directoryUrl: row["Directory URL"],
          branchName: row["Branch Name"],
          branchType: row["Branch Type"],
          libraryServiceName: row["Name of Library Service"],
          libraryServiceType: row["Library Service Type"],
          wifiAvailability: row["WiFi Availability"],
          addressLine1: row["Address Line 1"],
          addressLine2: row["Address Line 2"],
          addressLocality: row["Address Locality"],
          addressPostcode: row["Address Postcode"],
          address: addressParts.join(", "),
          phone: row["Phone"],
          phoneAfterHours: row["Phone (after hours)"],
          mobile: row["Mobile"],
          email: row["Email"],
          openingHours: compactObject({
            monday: row["Monday"],
            tuesday: row["Tuesday"],
            wednesday: row["Wednesday"],
            thursday: row["Thursday"],
            friday: row["Friday"],
            saturday: row["Saturday"],
            sunday: row["Sunday"],
          }),
          latitude: lat,
          longitude: lon,
          dateCreated: parseDMY(row["Date Created"]),
          dateLastUpdated: parseDMY(row["Date Last Updated"]),
          source: "plconnect-directory-branches-2024-05-29.csv",
          importedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        var id = stableDocId(row);
        var ref = db.collection(COLLECTION).doc(id);

        if (DRY_RUN) {
          stats.queued += 1;
          return;
        }

        stats.queued += 1;
        bulkWriter.set(ref, doc, { merge: true });
      })
      .on("end", resolve)
      .on("error", reject);
  });

  if (!DRY_RUN) {
    await bulkWriter.close();
  }

  console.log("Done.");
  console.log(
    JSON.stringify(
      {
        read: stats.read,
        queued: stats.queued,
        written: stats.written,
        skippedNoCoords: stats.skippedNoCoords,
        failed: stats.failed,
      },
      null,
      2,
    ),
  );
}

main().catch(function (err) {
  console.error("Upload failed:", err);
  process.exitCode = 1;
});



