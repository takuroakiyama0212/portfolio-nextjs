const fs = require('fs');
const path = require('path');

// NT Libraries data - manually structured
const ntLibraries = [
  {
    name: "Adelaide River",
    location: "Adelaide River Primary School\nMemorial Terrace\nAdelaide River NT 0846",
    mail: "c/o Post Office\nAdelaide River NT 0846",
    phone: "08 8976 7069",
    web: "www.coomalie.nt.gov.au"
  },
  {
    name: "Alice Springs",
    location: "Corner of Leichardt Terrace and Gregory Terrace\nAlice Springs NT 0870",
    mail: "PO Box 1071\nAlice Springs NT 0871",
    phone: "08 8950 0555",
    web: "www.alicesprings.nt.gov.au"
  },
  {
    name: "Alyangula",
    location: "Alyangula Area School\nFlinders Street\nAlyangula NT 0885",
    mail: "PMB 3\nAlyangula NT 0885",
    phone: "08 8987 6120",
    web: "www.facebook.com/alyangulacommunitylibrary"
  },
  {
    name: "Angurugu",
    location: "Angurugu NT 0822",
    mail: "Community Mail Agency\nAngurugu via Darwin NT 0822",
    phone: "08 8987 7195",
    web: "www.eastarnhem.nt.gov.au/library-knowledge-centres"
  },
  {
    name: "Barunga",
    location: "Barunga School\nBagala Street\nBarunga NT 0852",
    mail: "PO Box 1321\nKatherine NT 0851",
    phone: "08 8975 4504",
    web: "ropergulf.nt.gov.au"
  },
  {
    name: "Batchelor",
    location: "Batchelor Institute\nCorner of Nurndina Street and Awilla Street\nBatchelor NT 0845",
    mail: "c/o Post Office\nBatchelor NT 0845",
    phone: "08 8939 7103",
    web: "www.batchelor.edu.au"
  },
  {
    name: "Borroloola",
    location: "167 Robinson Road\nBorroloola NT 0854",
    mail: "PO Box 421\nBorroloola NT 0851",
    phone: "08 8975 8802",
    web: "ropergulf.nt.gov.au"
  },
  {
    name: "Casuarina",
    location: "17 Bradshaw Terrace\nCasuarina NT 0810",
    mail: "GPO Box 84\nDarwin NT 0801",
    phone: "08 8930 0200",
    web: "www.darwin.nt.gov.au/libraries"
  },
  {
    name: "Coolalinga",
    location: "Litchfield Community Library\nShop T52-55\nCoolalinga Central Shopping Centre\n425 Stuart Highway\nCoolalinga NT 0839",
    mail: "PO Box 446\nHumpty Doo NT 0836",
    phone: "08 8988 1200",
    web: "litchfield.nt.gov.au/community/litchfield-community-library"
  },
  {
    name: "Darwin City",
    location: "Harry Chan Avenue\nDarwin NT 0801",
    mail: "GPO Box 84\nDarwin NT 0801",
    phone: "08 8930 0300",
    web: "www.darwin.nt.gov.au/libraries"
  },
  {
    name: "Elliott",
    location: "132 Lewis Street\nElliott NT 0862",
    mail: "c/o Post Office\nElliott NT 0862",
    phone: "08 8969 2099",
    web: "www.barkly.nt.gov.au/communities#Elliott"
  },
  {
    name: "Galiwin'ku",
    location: "Galiwin'ku NT 0822",
    mail: "Elcho Island\nvia Nhulunbuy NT 0822",
    phone: "08 8970 5129",
    web: "www.eastarnhem.nt.gov.au/library-knowledge-centres"
  },
  {
    name: "Jabiru",
    location: "11 Tasman Crescent\nJabiru NT 0886",
    mail: "PO Box 646\nJabiru NT 0886",
    phone: "08 8979 9459",
    web: "westarnhem.nt.gov.au"
  },
  {
    name: "Karama",
    location: "Karama Shopping Centre\n31 Kalymnos Drive\nKarama NT 0812",
    mail: "GPO Box 84\nDarwin NT 0801",
    phone: "08 8927 2505",
    web: "www.darwin.nt.gov.au/libraries"
  },
  {
    name: "Katherine",
    location: "First Floor - Randazzo Centre (opposite Oasis Shopping Centre)\nKatherine Terrace\nKatherine NT 0850",
    mail: "PO Box 1071\nKatherine NT 0852",
    phone: "08 8971 1188",
    web: "www.katherine.nt.gov.au/community/library/about"
  },
  {
    name: "Lajamanu",
    location: "Lajamanu Learning Centre\n485 Wampana Road\nLajamanu NT 0852",
    mail: "CMB Lajamanu\nvia Katherine NT 0852",
    phone: "08 8975 0886",
    web: "www.centraldesert.nt.gov.au/our-services"
  },
  {
    name: "Mataranka",
    location: "Roper Terrace\nMataranka NT 0852",
    mail: "PO Box 4099\nMataranka NT 0852",
    phone: "08 8975 4576",
    web: "ropergulf.nt.gov.au"
  },
  {
    name: "Milikapiti",
    location: "Milikapiti NT",
    mail: "CMB 22 Snake Bay\nMelville Island via Darwin NT 0822",
    phone: "08 8978 3958",
    web: ""
  },
  {
    name: "Milingimibi",
    location: "Milingimbi Community Education Centre\nGadapu Road\nMilingimbi NT 0822",
    mail: "Milingimbi\nvia Darwin NT 0822",
    phone: "08 8987 9975",
    web: "www.eastarnhem.nt.gov.au/library-knowledge-centres"
  },
  {
    name: "Ngukurr",
    location: "Ngukurr Road\nNgukurr NT 0852",
    mail: "CMB 6\nNgukurr via Katherine NT 0852",
    phone: "08 8975 4208",
    web: "ropergulf.nt.gov.au"
  },
  {
    name: "Nhulunbuy",
    location: "Nhulunbuy High School\nMatthew Flinders Way\nNhulunbuy NT 0880",
    mail: "PO Box 1271\nNhulunbuy NT 0881",
    phone: "08 8987 0862",
    web: "www.eastarnhem.nt.gov.au/library-knowledge-centres"
  },
  {
    name: "Nightcliff",
    location: "10-12 Pavonia Place\nNightcliff NT 0810",
    mail: "GPO Box 84\nDarwin NT 0801",
    phone: "08 8930 0480",
    web: "www.darwin.nt.gov.au/libraries"
  },
  {
    name: "Palmerston",
    location: "Goyder Square, on the Boulevard\nPalmerston NT 0832",
    mail: "PO Box 1\nPalmerston NT 0831",
    phone: "08 8935 9999",
    web: "www.palmerston.nt.gov.au/community/library"
  },
  {
    name: "Pine Creek",
    location: "Pine Creek Museum and Library\nRailway Terrace\nPine Creek NT 0847",
    mail: "PO Box 144\nPine Creek NT 0847",
    phone: "08 8976 1287",
    web: ""
  },
  {
    name: "Ramingining",
    location: "Ramingining Library and Media Centre\nRamingining NT 0822",
    mail: "CMB 10\nRamingining via Darwin NT 0822",
    phone: "08 8979 7906",
    web: "www.eastarnhem.nt.gov.au/library-knowledge-centres"
  },
  {
    name: "Tennant Creek",
    location: "Civic Centre\nPeko Road\nTennant Creek NT 0860",
    mail: "PO Box 821\nTennant Creek NT 0861",
    phone: "08 8962 0094",
    web: "www.barkly.nt.gov.au/public-library"
  },
  {
    name: "Ti Tree / Anmatjere",
    location: "Central Desert Regional Council, Service Centre\n533 Spencer Street\nTi Tree NT 0872",
    mail: "PO Box 20\nTi Tree Via Alice Springs NT 0872",
    phone: "08 8956 9933",
    web: "centraldesert.nt.gov.au/our-services"
  },
  {
    name: "Umbakumba",
    location: "Umbakumba NT 0822",
    mail: "PMB 2\nAlyangula Groote Eylandt NT 0885",
    phone: "08 8987 6723",
    web: "www.eastarnhem.nt.gov.au/library-knowledge-centres"
  },
  {
    name: "Wadeye",
    location: "Wadeye NT 0822",
    mail: "Wadeye PO\nPort Keats via Darwin NT 0822",
    phone: "08 8978 1202",
    web: "www.westdaly.nt.gov.au"
  }
];

// Known coordinates for NT locations
const knownCoordinates = {
  'Alice Springs': { lat: -23.6980, lon: 133.8807 },
  'Darwin': { lat: -12.4634, lon: 130.8456 },
  'Katherine': { lat: -14.4647, lon: 132.2636 },
  'Tennant Creek': { lat: -19.6467, lon: 134.1914 },
  'Palmerston': { lat: -12.4856, lon: 130.9833 },
  'Casuarina': { lat: -12.3681, lon: 130.8886 },
  'Nightcliff': { lat: -12.3833, lon: 130.8500 },
  'Jabiru': { lat: -12.6583, lon: 132.8364 },
  'Nhulunbuy': { lat: -12.1833, lon: 136.7833 },
  'Adelaide River': { lat: -13.2333, lon: 131.1167 },
  'Batchelor': { lat: -13.0500, lon: 131.0667 },
  'Pine Creek': { lat: -13.8167, lon: 131.8333 },
  'Coolalinga': { lat: -12.4333, lon: 131.0333 },
  'Karama': { lat: -12.3833, lon: 130.9000 },
  'Mataranka': { lat: -14.9333, lon: 133.0667 },
  'Borroloola': { lat: -16.0667, lon: 136.3000 },
  'Barunga': { lat: -14.5167, lon: 132.8833 },
  'Elliott': { lat: -17.5500, lon: 133.5333 },
  'Lajamanu': { lat: -18.3333, lon: 130.6333 },
  'Ngukurr': { lat: -14.7333, lon: 134.7333 },
  'Ti Tree': { lat: -22.1167, lon: 133.4333 },
  'Alyangula': { lat: -13.8500, lon: 136.4167 },
  'Angurugu': { lat: -13.9667, lon: 136.4500 },
  'Galiwin\'ku': { lat: -12.0167, lon: 135.5500 },
  'Milikapiti': { lat: -11.4333, lon: 130.6667 },
  'Milingimibi': { lat: -12.1000, lon: 134.9167 },
  'Ramingining': { lat: -12.3500, lon: 134.9167 },
  'Umbakumba': { lat: -13.8500, lon: 136.4167 },
  'Wadeye': { lat: -14.2333, lon: 129.5167 },
};

// Process libraries
const processedLibraries = ntLibraries.map((lib) => {
  // Find coordinates
  let lat = null;
  let lon = null;
  
  // Try to match known locations
  for (const [key, coords] of Object.entries(knownCoordinates)) {
    if (lib.name.includes(key) || lib.location.includes(key)) {
      lat = coords.lat;
      lon = coords.lon;
      break;
    }
  }
  
  // If no match, default to Darwin
  if (lat === null) {
    lat = knownCoordinates['Darwin'].lat;
    lon = knownCoordinates['Darwin'].lon;
  }
  
  // Build address from location (replace newlines with commas)
  const address = lib.location.split('\n').join(', ') + ' NT';
  
  return {
    name: lib.name,
    address,
    latitude: lat,
    longitude: lon,
    phone: lib.phone || undefined,
    web: lib.web || undefined,
  };
});

// Generate TypeScript code
const tsCode = `// Auto-generated from NT libraries data
// Generated on: ${new Date().toISOString()}
// Total libraries: ${processedLibraries.length}

import { ChargingSpot } from "./mockData";

export const NT_LIBRARIES: ChargingSpot[] = [
${processedLibraries.map((lib, idx) => {
  const id = `nt-lib-${idx + 1}`;
  
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
    source: "nt-libraries",
    ${lib.phone ? `phone: ${JSON.stringify(lib.phone)},` : ''}
    ${lib.web ? `web: ${JSON.stringify(lib.web)},` : ''}
    tips: ["Libraries typically have power outlets at study desks and seating areas"],
  }`;
}).join(',\n')}
];
`;

// Write to file
const outputPath = path.join(__dirname, '../client/data/ntLibraries.ts');
fs.writeFileSync(outputPath, tsCode, 'utf-8');

console.log(`✅ Generated ${processedLibraries.length} NT libraries`);
console.log(`📁 Output: ${outputPath}`);
