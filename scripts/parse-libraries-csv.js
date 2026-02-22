const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../../plconnect-directory-branches-2024-05-29.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.split('\n');
const headers = lines[0].split(',').map(h => h.trim());

// Find column indices
const getIndex = (name) => headers.findIndex(h => h.includes(name));

const nameIdx = getIndex('Branch Name');
const latIdx = getIndex('Latitude');
const lonIdx = getIndex('Longitude');
const addr1Idx = getIndex('Address Line 1');
const addr2Idx = getIndex('Address Line 2');
const localityIdx = getIndex('Address Locality');
const postcodeIdx = getIndex('Address Postcode');
const phoneIdx = getIndex('Phone');
const hoursIdx = getIndex('Monday'); // We'll use Monday as a sample

// Parse CSV rows
const libraries = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Simple CSV parsing (handles quoted fields)
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  if (values.length < headers.length) continue;

  const name = values[nameIdx]?.trim();
  const latStr = values[latIdx]?.trim();
  const lonStr = values[lonIdx]?.trim();
  const addr1 = values[addr1Idx]?.trim() || '';
  const addr2 = values[addr2Idx]?.trim() || '';
  const locality = values[localityIdx]?.trim() || '';
  const postcode = values[postcodeIdx]?.trim() || '';
  const phone = values[phoneIdx]?.trim() || '';
  const mondayHours = values[hoursIdx]?.trim() || '';

  if (!name || !latStr || !lonStr) continue;

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  if (isNaN(lat) || isNaN(lon)) continue;

  // Build address
  const addressParts = [addr1, addr2, locality, postcode].filter(Boolean);
  const address = addressParts.join(', ') + ' QLD';

  // Build hours string (simplified - just use Monday as example)
  const hours = mondayHours ? `Mon: ${mondayHours}` : undefined;

  libraries.push({
    name,
    address,
    latitude: lat,
    longitude: lon,
    phone: phone || undefined,
    hours,
  });
}

// Generate TypeScript code
const tsCode = `// Auto-generated from QLD libraries CSV
// Generated on: ${new Date().toISOString()}
// Total libraries: ${libraries.length}

import { ChargingSpot } from "./mockData";

export const QLD_LIBRARIES: ChargingSpot[] = [
${libraries.map((lib, idx) => {
  const id = `qld-lib-${idx + 1}`;
  return `  {
    id: "${id}",
    name: ${JSON.stringify(lib.name)},
    address: ${JSON.stringify(lib.address)},
    venueType: "library",
    latitude: ${lib.latitude},
    longitude: ${lib.longitude},
    outletCount: 0, // Unknown - libraries typically have outlets
    outletTypes: ["standard", "usb-a"],
    hasOutlets: null, // Not verified
    powerConfidence: 0.7, // Libraries often have power outlets
    communityYesVotes: 0,
    communityNoVotes: 0,
    source: "qld-libraries",
    ${lib.phone ? `phone: ${JSON.stringify(lib.phone)},` : ''}
    ${lib.hours ? `hours: ${JSON.stringify(lib.hours)},` : ''}
    tips: ["Libraries typically have power outlets at study desks and seating areas"],
  }`;
}).join(',\n')}
];
`;

// Write to file
const outputPath = path.join(__dirname, '../client/data/qldLibraries.ts');
fs.writeFileSync(outputPath, tsCode, 'utf-8');

console.log(`✅ Generated ${libraries.length} QLD libraries`);
console.log(`📁 Output: ${outputPath}`);


