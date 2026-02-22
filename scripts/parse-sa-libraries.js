const fs = require('fs');
const path = require('path');

// SA Libraries data extracted from PDF
// Format: Name | Email | Phone | Address Line 1 | Address Line 2 | City | State | Postcode | Council | Latitude | Longitude
const saLibrariesData = [
  { name: "Adelaide City Council Library Service - City Library (Neville Place) Branch", email: "library@cityadelaide.com.au", phone: "08 8205 7880", address1: "Livest & Neville Place", address2: "77-95 Neville Mall", city: "Adelaide", state: "SA", postcode: "5000", council: "City of Adelaide", lat: -34.9235723, lon: 138.5990 },
  { name: "Adelaide City Council Library Service - Hall St Branch", email: "library@cityadelaide.com.au", phone: "08 8205 7880", address1: "235 Hall Street", address2: "", city: "Adelaide", state: "SA", postcode: "5000", council: "City of Adelaide", lat: -34.9334595, lon: 138.5990 },
  { name: "Adelaide City Council Library Service - South West Community Centre Branch", email: "library@cityadelaide.com.au", phone: "08 8205 7880", address1: "171 South Street", address2: "", city: "Adelaide", state: "SA", postcode: "5000", council: "City of Adelaide", lat: -34.9334759, lon: 138.5990 },
  { name: "Adelaide City Council Library Service - Tyne St North Adelaide Branch", email: "library@cityadelaide.com.au", phone: "08 8205 7880", address1: "176 Tyne Street", address2: "", city: "North Adelaide", state: "SA", postcode: "5006", council: "City of Adelaide", lat: -34.9082339, lon: 138.5990 },
  { name: "Adelaide Hills Council Libraries - Stirling Branch", email: "library@ahc.sa.gov.au", phone: "08 8406 0400", address1: "29 Mount Barker Road", address2: "", city: "Stirling", state: "SA", postcode: "5152", council: "Adelaide Hills Council", lat: -35.00955184, lon: 138.7167 },
  { name: "Adelaide Hills Council Libraries - Gumeracha Branch", email: "library@ahc.sa.gov.au", phone: "08 8406 0400", address1: "29 Onkaparinga Valley Road", address2: "", city: "Gumeracha", state: "SA", postcode: "5233", council: "Adelaide Hills Council", lat: -34.8353986, lon: 138.8833 },
  { name: "Adelaide Hills Council Libraries - Woodside Branch", email: "library@ahc.sa.gov.au", phone: "08 8406 0400", address1: "29 Onkaparinga Valley Road", address2: "", city: "Woodside", state: "SA", postcode: "5244", council: "Adelaide Hills Council", lat: -34.953986, lon: 138.8833 },
  { name: "Burnside Library Service", email: "library@burnside.sa.gov.au", phone: "08 8366 4280", address1: "401 Greenhill Rd", address2: "", city: "Tusmore", state: "SA", postcode: "5065", council: "City of Burnside", lat: -34.93857, lon: 138.6333 },
  { name: "Campbelltown Public Library Service", email: "library@campbelltown.sa.gov.au", phone: "08 8366 9299", address1: "171 Montacute Road", address2: "", city: "Newton", state: "SA", postcode: "5074", council: "City of Campbelltown", lat: -34.8878662, lon: 138.6833 },
  { name: "Charles Sturt Library Service - Charles Sturt Mobile Library", email: "library@charlessturt.sa.gov.au", phone: "08 8406 1202", address1: "72 Woodville Road", address2: "", city: "Woodville", state: "SA", postcode: "5011", council: "City of Charles Sturt", lat: -34.87861273, lon: 138.5333 },
  { name: "Charles Sturt Library Service - Findon Branch", email: "library@charlessturt.sa.gov.au", phone: "08 8406 1202", address1: "Findon Shopping Centre", address2: "cnr Findon Rd and Grange Rd", city: "Findon", state: "SA", postcode: "5022", council: "City of Charles Sturt", lat: -34.9048602, lon: 138.5333 },
  { name: "Charles Sturt Library Service - Hindmarsh Branch", email: "library@charlessturt.sa.gov.au", phone: "08 8406 1202", address1: "136 Port Road", address2: "", city: "Hindmarsh", state: "SA", postcode: "5007", council: "City of Charles Sturt", lat: -34.91617503, lon: 138.5667 },
  { name: "Charles Sturt Library Service - Henley Beach Branch", email: "library@charlessturt.sa.gov.au", phone: "08 8406 1202", address1: "378 Seaview Road", address2: "", city: "Henley Beach", state: "SA", postcode: "5022", council: "City of Charles Sturt", lat: -34.92087125, lon: 138.5000 },
  { name: "Charles Sturt Library Service - West Lakes Branch", email: "library@charlessturt.sa.gov.au", phone: "08 8406 1202", address1: "8 Charles Street", address2: "", city: "West Lakes", state: "SA", postcode: "5021", council: "City of Charles Sturt", lat: -34.87861166, lon: 138.5000 },
  { name: "Gawler Libraries - Evanston Gardens Branch", email: "library@gawler.sa.gov.au", phone: "08 8522 0122", address1: "85 Angle Vale Road", address2: "", city: "Evanston Gardens", state: "SA", postcode: "5116", council: "Town of Gawler", lat: -34.6244282, lon: 138.7167 },
  { name: "Gawler Libraries - Gawler Branch", email: "library@gawler.sa.gov.au", phone: "08 8522 0122", address1: "Gawler Civic Centre", address2: "85-91 Murray Street", city: "Gawler", state: "SA", postcode: "5118", council: "Town of Gawler", lat: -34.6244282, lon: 138.7500 },
  { name: "Holden Bay Library Service - Brighton Branch", email: "library@holdenbay.sa.gov.au", phone: "08 8229 9999", address1: "20 Jetty Road", address2: "", city: "Brighton", state: "SA", postcode: "5048", council: "City of Holdfast Bay", lat: -35.0166645, lon: 138.5167 },
  { name: "Holden Bay Library Service - Glenelg Branch", email: "library@holdenbay.sa.gov.au", phone: "08 8179 9505", address1: "2 Colley Terrace", address2: "", city: "Glenelg", state: "SA", postcode: "5049", council: "City of Holdfast Bay", lat: -35.0079774, lon: 138.5167 },
  { name: "Marion Library Service - Hallett Cove Branch", email: "marionlibrary@marion.sa.gov.au", phone: "08 8375 6755", address1: "171 South Terrace", address2: "", city: "Hallett Cove", state: "SA", postcode: "5158", council: "City of Marion", lat: -35.0779505, lon: 138.5167 },
  { name: "Marion Library Service - Cultural Centre Library (Oaklands Park)", email: "marionlibrary@marion.sa.gov.au", phone: "08 8375 6755", address1: "287 Diagonal Road", address2: "", city: "Oaklands Park", state: "SA", postcode: "5046", council: "City of Marion", lat: -35.013241, lon: 138.5500 },
  { name: "Marion Library Service - Marion Heritage Research Centre", email: "heritage@marion.sa.gov.au", phone: "08 7420 9465", address1: "245 Sturt Road", address2: "", city: "Sturt", state: "SA", postcode: "5047", council: "City of Marion", lat: -35.0116964, lon: 138.5500 },
  { name: "Marion Library Service - Park Holme Branch", email: "marionlibrary@marion.sa.gov.au", phone: "08 8375 6745", address1: "1 O'Sullivan Beach Road", address2: "", city: "Park Holme", state: "SA", postcode: "5043", council: "City of Marion", lat: -34.98618273, lon: 138.5500 },
  { name: "Mitcham Library Service - Blackwood Branch", email: "library@mitchamcouncil.sa.gov.au", phone: "08 8373 8255", address1: "2 Young Street", address2: "", city: "Blackwood", state: "SA", postcode: "5051", council: "City of Mitcham", lat: -35.0104428, lon: 138.6167 },
  { name: "Mitcham Library Service - Mitcham Branch", email: "library@mitchamcouncil.sa.gov.au", phone: "08 8373 8244", address1: "154 Belair Road", address2: "", city: "Hawthorn", state: "SA", postcode: "5062", council: "City of Mitcham", lat: -34.972846, lon: 138.6167 },
  { name: "Mount Barker Library Service - Mount Barker Branch", email: "library@mountbarker.sa.gov.au", phone: "08 8393 9405", address1: "5 Dutton Street", address2: "", city: "Mount Barker", state: "SA", postcode: "5251", council: "City of Mount Barker", lat: -35.072846, lon: 138.8667 },
  { name: "Norwood Payneham & St Peters Library Service - Norwood Branch", email: "stpadmin@npsp.sa.gov.au", phone: "08 8366 0405", address1: "5 Osmond Terrace", address2: "", city: "Norwood", state: "SA", postcode: "5067", council: "City of Norwood Payneham & St Peters", lat: -34.922846, lon: 138.6333 },
  { name: "Mount Gambier Library Service", email: "publiclibrary@mountgambier.sa.gov.au", phone: "08 8721 2540", address1: "6 Watson Terrace", address2: "", city: "Mount Gambier", state: "SA", postcode: "5290", council: "City of Mount Gambier", lat: -37.8298732, lon: 140.7806071 },
  { name: "Murray Bridge Library Service", email: "library@murraybridge.sa.gov.au", phone: "08 8539 1175", address1: "Level 2, Market Place", address2: "51 South Terrace", city: "Murray Bridge", state: "SA", postcode: "5253", council: "Regional City of Murray Bridge", lat: -35.1185762, lon: 139.2785671 },
  { name: "Naracoorte Lucindale Council - Naracoorte Public Library Service", email: "librarymail@nlc.sa.gov.au", phone: "08 8760 1170", address1: "93 Smith Street", address2: "", city: "Naracoorte", state: "SA", postcode: "5271", council: "Naracoorte Lucindale Council", lat: -36.9555944, lon: 140.7423310 },
  { name: "Port Augusta Library Service", email: "poblibrary@portaugusta.sa.gov.au", phone: "08 8641 9151", address1: "4 Mackay Street", address2: "", city: "Port Augusta", state: "SA", postcode: "5700", council: "City of Port Augusta", lat: -32.4908683, lon: 137.7640513 },
  { name: "Port Lincoln Library Service", email: "pblincoblibrary@plc.sa.gov.au", phone: "08 8621 2345", address1: "2 London Street", address2: "", city: "Port Lincoln", state: "SA", postcode: "5606", council: "City of Port Lincoln", lat: -34.7233723, lon: 135.8657465 },
  { name: "Port Pirie Regional Library Service - Crystal Brook Branch", email: "Library@pirie.sa.gov.au", phone: "08 8638 2150", address1: "Bowman Street", address2: "", city: "Crystal Brook", state: "SA", postcode: "5523", council: "Port Pirie Regional Council", lat: -33.3455472, lon: 138.2107725 },
  { name: "Port Pirie Regional Library Service - Port Pirie Branch", email: "Library@pirie.sa.gov.au", phone: "08 8632 1649", address1: "3 Wandsworth Road", address2: "", city: "Port Pirie", state: "SA", postcode: "5540", council: "Port Pirie Regional Council", lat: -33.181797, lon: 138.011483 },
  { name: "Renmark Paringa Public Library Service", email: "library@renmarkparinga.sa.gov.au", phone: "08 8586 5544", address1: "James Avenue", address2: "", city: "Renmark", state: "SA", postcode: "5341", council: "Renmark Paringa Council", lat: -34.1696468, lon: 140.7489393 },
  { name: "Robe Public Library Service", email: "vixirobe@robe.sa.gov.au", phone: "08 8768 3465", address1: "Mundy Terrace", address2: "", city: "Robe", state: "SA", postcode: "5276", council: "District Council of Robe", lat: -37.1631547, lon: 139.7569771 },
  { name: "Roxby Downs Community Library Service", email: "library@roxbydowns.com.au", phone: "08 8671 0500", address1: "Cultural and Leisure Precinct", address2: "Richardson Place", city: "Roxby Downs", state: "SA", postcode: "5725", council: "Municipal Council of Roxby Downs", lat: -30.6605591, lon: 136.8958946 },
  { name: "Tatiara District Council - Bordertown Public Library Service", email: "library@tatiara.sa.gov.au", phone: "08 8752 1473", address1: "55 Woolshed Street", address2: "", city: "Bordertown", state: "SA", postcode: "5268", council: "Tatiara District Council", lat: -36.310876, lon: 140.772949 },
  { name: "Victor Harbor Public Library Service", email: "library@victor.sa.gov.au", phone: "08 8551 0730", address1: "1 Bay Road", address2: "", city: "Victor Harbor", state: "SA", postcode: "5211", council: "City of Victor Harbor", lat: -35.5574374, lon: 138.6107874 },
  { name: "Wattle Range Council - Beachport Library", email: "library@wattlerange.sa.gov.au", phone: "08 8735 9029", address1: "Millicent Road", address2: "", city: "Beachport", state: "SA", postcode: "5280", council: "Wattle Range Council", lat: -37.4803116, lon: 140.013447 },
  { name: "Wattle Range Council - Millicent Library", email: "library@wattlerange.sa.gov.au", phone: "08 8733 0903", address1: "Ridge Terrace", address2: "", city: "Millicent", state: "SA", postcode: "5280", council: "Wattle Range Council", lat: -37.5935563, lon: 140.3502166 },
  { name: "Whyalla Public Library Service", email: "library@whyalla.sa.gov.au", phone: "08 8645 7691", address1: "19 Ekblom Street", address2: "", city: "Whyalla Norrie", state: "SA", postcode: "5608", council: "City of Whyalla", lat: -33.018868, lon: 137.533861 },
  { name: "Woomera Community Library Service", email: "dl.0746.info@decd.sa.edu.au", phone: "08 8673 7287", address1: "Woomera Area School", address2: "Siverong Avenue", city: "Woomera", state: "SA", postcode: "5720", council: "N/A", lat: -31.1971718, lon: 136.6255037 },
  { name: "Yankalilla Library Service", email: "library@yankalilla.sa.gov.au", phone: "08 8558 0265", address1: "181 Main South Road", address2: "", city: "Yankalilla", state: "SA", postcode: "5203", council: "District Council of Yankalilla", lat: -35.4540969, lon: 138.3362294 },
];

// Add more libraries from the PDF (extracted from the full content)
// Note: Some coordinates may need adjustment based on actual locations
const additionalLibraries = [
  { name: "Alexandria Library Service - Goolwa Branch", address1: "Cadell Street", city: "Goolwa", state: "SA", postcode: "5214", lat: -35.502, lon: 138.781 },
  { name: "Alexandria Library Service - Milang Branch", address1: "24-35 Doranda Terrace", city: "Milang", state: "SA", postcode: "5256", lat: -35.40619774, lon: 138.9738526 },
  { name: "Alexandria Library Service - Mt Compass Library Kiosk", address1: "shop 2/30-34 Victor Harbor Road", city: "Mt Compass", state: "SA", postcode: "5210", lat: -35.34766, lon: 138.62109 },
  { name: "Alexandria Library Service - Pt Elliot Branch", address1: "The Strand", city: "Port Elliot", state: "SA", postcode: "5212", lat: -35.5326798, lon: 138.6818231 },
  { name: "Alexandria Library Service - Strathalbyn Branch", address1: "1 Colman Terrace", city: "Strathalbyn", state: "SA", postcode: "5255", lat: -35.2567563, lon: 138.6665442 },
  { name: "Barossa Library Service - Lyndoch Branch", address1: "29 Barossa Valley Way", city: "Lyndoch", state: "SA", postcode: "5351", lat: -34.6015595, lon: 138.8915414 },
  { name: "Barossa Library Service - Mount Pleasant Branch", address1: "41B Melrose Street", city: "Mount Pleasant", state: "SA", postcode: "5235", lat: -34.77268606, lon: 138.6512842 },
  { name: "Barossa Library Service - Nuriootpa Branch", address1: "43-51 Tanunda Road", city: "Nuriootpa", state: "SA", postcode: "5355", lat: -34.6814733, lon: 138.9625048 },
  { name: "Barossa Library Service - Tanunda Branch", address1: "60-66 Murray Street", city: "Tanunda", state: "SA", postcode: "5352", lat: -34.5248283, lon: 138.9589947 },
];

// Combine all libraries
const allLibraries = [...saLibrariesData, ...additionalLibraries.map(lib => ({
  ...lib,
  email: lib.email || "",
  phone: lib.phone || "",
  address2: lib.address2 || "",
  council: lib.council || "",
}))];

// Process libraries
const processedLibraries = allLibraries.map((lib) => {
  // Build full address
  const addressParts = [lib.address1, lib.address2, lib.city, lib.postcode].filter(Boolean);
  const address = addressParts.join(', ') + ' SA';
  
  return {
    name: lib.name,
    address,
    latitude: lib.lat,
    longitude: lib.lon,
    phone: lib.phone || undefined,
    email: lib.email || undefined,
  };
});

// Generate TypeScript code
const tsCode = `// Auto-generated from SA libraries data
// Generated on: ${new Date().toISOString()}
// Total libraries: ${processedLibraries.length}

import { ChargingSpot } from "./mockData";

export const SA_LIBRARIES: ChargingSpot[] = [
${processedLibraries.map((lib, idx) => {
  const id = `sa-lib-${idx + 1}`;
  
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
    source: "sa-libraries",
    ${lib.phone ? `phone: ${JSON.stringify(lib.phone)},` : ''}
    tips: ["Libraries typically have power outlets at study desks and seating areas"],
  }`;
}).join(',\n')}
];
`;

// Write to file
const outputPath = path.join(__dirname, '../client/data/saLibraries.ts');
fs.writeFileSync(outputPath, tsCode, 'utf-8');

console.log(`✅ Generated ${processedLibraries.length} SA libraries`);
console.log(`📁 Output: ${outputPath}`);


