const fs = require('fs');
const path = require('path');

// TAS Libraries data from images
const tasLibraries = [
  "Allport Library and Museum of Fine Arts",
  "Beaconsfield Library",
  "Bicheno Library",
  "Bothwell Library",
  "Bridgewater Library",
  "Bridport Library",
  "Bruny Online",
  "Burnie Library",
  "Campbell Town Library",
  "Currie Library",
  "Cygnet Library",
  "Deloraine Library",
  "Devonport Library",
  "Exeter Library",
  "Geeveston Library",
  "Glenorchy Library",
  "Hobart Library",
  "Huonville Library",
  "Kingston Library",
  "Kinimathatakinta/Georgetown Library",
  "Latrobe Library",
  "Launceston Library",
  "Lilydale Library",
  "Longford Library",
  "New Norfolk Library",
  "Oatlands Library",
  "Orford Library",
  "Penguin Library",
  "Queenstown Library",
  "Ravenswood Library",
  "Ringarooma Library",
  "Rosebery Library",
  "Rosny Library",
  "Scottsdale Library",
  "Sheffield Library",
  "Smithton Library",
  "Sorell Library",
  "St Helens Library",
  "St Marys Library",
  "State Library and Archives of Tasmania, Hobart",
  "State Library and Archives of Tasmania, Launceston",
  "Strahan Library",
  "Swansea Library",
  "Tasman Library",
  "Ulverstone Library",
  "Westbury Library",
  "Whitemark Library",
  "Wynyard Library",
  "Zeehan Library"
];

// Known coordinates for TAS locations
const knownCoordinates = {
  'Hobart': { lat: -42.8821, lon: 147.3272 },
  'Launceston': { lat: -41.4332, lon: 147.1441 },
  'Burnie': { lat: -41.0556, lon: 145.9031 },
  'Devonport': { lat: -41.1772, lon: 146.3514 },
  'Ulverstone': { lat: -41.1600, lon: 146.1667 },
  'Penguin': { lat: -41.1167, lon: 146.0667 },
  'Wynyard': { lat: -40.9833, lon: 145.7167 },
  'Smithton': { lat: -40.8333, lon: 145.1167 },
  'Currie': { lat: -39.9333, lon: 143.8500 },
  'Kingston': { lat: -42.9667, lon: 147.3000 },
  'Glenorchy': { lat: -42.8333, lon: 147.2833 },
  'Rosny': { lat: -42.8667, lon: 147.3667 },
  'Sorell': { lat: -42.7833, lon: 147.5667 },
  'Huonville': { lat: -43.0333, lon: 147.0500 },
  'Cygnet': { lat: -43.3000, lon: 147.0667 },
  'Geeveston': { lat: -43.1667, lon: 146.9167 },
  'New Norfolk': { lat: -42.7833, lon: 147.0667 },
  'Bridgewater': { lat: -42.7333, lon: 147.2333 },
  'Brighton': { lat: -42.7000, lon: 147.2500 },
  'Exeter': { lat: -41.2833, lon: 146.9500 },
  'Lilydale': { lat: -41.2500, lon: 147.2167 },
  'Scottsdale': { lat: -41.1500, lon: 147.5167 },
  'Bridport': { lat: -41.0000, lon: 147.3833 },
  'St Helens': { lat: -41.3167, lon: 148.2333 },
  'St Marys': { lat: -41.5833, lon: 148.1833 },
  'Swansea': { lat: -42.1167, lon: 148.0833 },
  'Bicheno': { lat: -41.8667, lon: 148.3000 },
  'Orford': { lat: -42.5667, lon: 147.8833 },
  'Campbell Town': { lat: -41.9333, lon: 147.4000 },
  'Oatlands': { lat: -42.3000, lon: 147.3667 },
  'Bothwell': { lat: -42.3833, lon: 147.0000 },
  'Hamilton': { lat: -42.5500, lon: 146.8167 },
  'Longford': { lat: -41.6000, lon: 147.1167 },
  'Deloraine': { lat: -41.5333, lon: 146.6667 },
  'Westbury': { lat: -41.5167, lon: 146.8500 },
  'Sheffield': { lat: -41.3833, lon: 146.3333 },
  'Latrobe': { lat: -41.2333, lon: 146.4167 },
  'Ravenswood': { lat: -41.3833, lon: 147.2500 },
  'Ringarooma': { lat: -41.2333, lon: 147.7333 },
  'Queenstown': { lat: -42.0833, lon: 145.5500 },
  'Zeehan': { lat: -41.8833, lon: 145.3333 },
  'Rosebery': { lat: -41.7833, lon: 145.5333 },
  'Strahan': { lat: -42.1500, lon: 145.3167 },
  'Beaconsfield': { lat: -41.2000, lon: 146.8167 },
  'Tasman': { lat: -43.1167, lon: 147.8167 },
  'Whitemark': { lat: -40.1167, lon: 148.0167 },
  'Georgetown': { lat: -41.1000, lon: 146.8167 },
};

// Process libraries
const processedLibraries = tasLibraries.map((libName) => {
  // Find coordinates
  let lat = null;
  let lon = null;
  
  // Try to match known locations
  for (const [key, coords] of Object.entries(knownCoordinates)) {
    if (libName.includes(key)) {
      lat = coords.lat;
      lon = coords.lon;
      break;
    }
  }
  
  // Special cases
  if (libName.includes('State Library') && libName.includes('Hobart')) {
    lat = knownCoordinates['Hobart'].lat;
    lon = knownCoordinates['Hobart'].lon;
  } else if (libName.includes('State Library') && libName.includes('Launceston')) {
    lat = knownCoordinates['Launceston'].lat;
    lon = knownCoordinates['Launceston'].lon;
  } else if (libName.includes('Georgetown')) {
    lat = knownCoordinates['Georgetown'].lat;
    lon = knownCoordinates['Georgetown'].lon;
  }
  
  // If no match, try to extract location name from library name
  if (lat === null) {
    const nameParts = libName.split(' ');
    for (const part of nameParts) {
      const cleanPart = part.replace(/[^a-zA-Z]/g, '');
      for (const [key, coords] of Object.entries(knownCoordinates)) {
        if (cleanPart.toLowerCase() === key.toLowerCase()) {
          lat = coords.lat;
          lon = coords.lon;
          break;
        }
      }
      if (lat !== null) break;
    }
  }
  
  // If still no match, default to Hobart
  if (lat === null) {
    lat = knownCoordinates['Hobart'].lat;
    lon = knownCoordinates['Hobart'].lon;
  }
  
  // Build address
  const locationName = libName.replace(' Library', '').replace(' and Museum of Fine Arts', '').replace('State Library and Archives of Tasmania, ', '');
  const address = `${locationName}, TAS`;
  
  return {
    name: libName,
    address,
    latitude: lat,
    longitude: lon,
  };
});

// Generate TypeScript code
const tsCode = `// Auto-generated from TAS libraries data
// Generated on: ${new Date().toISOString()}
// Total libraries: ${processedLibraries.length}

import { ChargingSpot } from "./mockData";

export const TAS_LIBRARIES: ChargingSpot[] = [
${processedLibraries.map((lib, idx) => {
  const id = `tas-lib-${idx + 1}`;
  
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
    source: "tas-libraries",
    tips: ["Libraries typically have power outlets at study desks and seating areas"],
  }`;
}).join(',\n')}
];
`;

// Write to file
const outputPath = path.join(__dirname, '../client/data/tasLibraries.ts');
fs.writeFileSync(outputPath, tsCode, 'utf-8');

console.log(`✅ Generated ${processedLibraries.length} TAS libraries`);
console.log(`📁 Output: ${outputPath}`);


