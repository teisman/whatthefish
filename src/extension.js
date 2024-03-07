function getRandomRgbColor() {
    // Generate three random numbers between 0 and 255
    const r = Math.floor(Math.random() * 256); // Red
    const g = Math.floor(Math.random() * 256); // Green
    const b = Math.floor(Math.random() * 256); // Blue
    
    // Construct an RGB color string
    const rgbColor = `rgb(${r},${g},${b})`;
    
    return rgbColor;
}

function generateCSS() {
  const colorPrimary = getRandomRgbColor();
  const colorSecondary = getRandomRgbColor();
  const gradientAngle = Math.floor(Math.random() * 180);

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

  const newCSS = generateCSS();
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
  applyStyles(css);
}

main();

