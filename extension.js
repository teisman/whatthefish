function generateRandomSeed() {
  let array = new Uint32Array(8); // Create an array of 8 elements, each 32 bits, for a total of 256 bits
  window.crypto.getRandomValues(array); // Fill the array with random values
  return Array.from(array).map(item => item.toString()).join('');
}

async function getHashArray(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer));
}

async function generateHexColor(str) {
  const hashArray = await getHashArray(str);
  const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  return `#${hashHex.substring(0, 6)}`;
}

async function generateCSS(trusted) {
  const seed = generateRandomSeed();
  const colorPrimary = await generateHexColor(`${trusted}.${seed}.primary`);
  const colorSecondary = await generateHexColor(`${trusted}.${seed}.secondary`);

  const gradientAngle = seed % 180;
  return `
  input[type="password"] {
    background-image: repeating-linear-gradient(
      ${gradientAngle}deg,
      ${colorPrimary},
      ${colorPrimary} 10px,
      ${colorSecondary} 10px,
      ${colorSecondary} 20px
    ) !important;
  }
  `;
}

async function getCSSForDomain(trusted) {
  const cssKey = trusted ? "trustedCSS" : "untrustedCSS";
  const res = await browser.storage.local.get(cssKey);
  if (cssKey in res) {
    return res[cssKey];
  }

  const newCSS = await generateCSS(trusted);
  await browser.storage.local.set({[cssKey]: newCSS});
  return newCSS;
}

function getFQDN() {
  return window.location.hostname;
}

async function isTrustedDomain(fqdn) {
  const res = await browser.storage.local.get('trustedDomains');
  const trustedDomains = new Set(res.trustedDomains || []);
  return trustedDomains.has(fqdn);
}

function applyStyles(css) {
  let styleElement = document.createElement('style');
  document.head.appendChild(styleElement);
  styleElement.sheet.insertRule(css, 0);
}

async function main() {
  const fqdn = getFQDN();
  const trusted = await isTrustedDomain(fqdn);
  const css = await getCSSForDomain(trusted);
  console.log(css);
  applyStyles(css);
}

main();

