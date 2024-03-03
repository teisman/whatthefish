document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('toggleTrust');
  const currentState = document.getElementById('currentState');
  const settingsLink = document.getElementById('settings');

  // Ensure that the settings link opens the settings page
  settingsLink.addEventListener('click', function() {
    browser.runtime.openOptionsPage();
  });
  
  // Function to check if FQDN is in the list of trusted domains
  async function checkFQDN() {
    const tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (tabs.length === 0) return; // No active tab found
    const url = new URL(tabs[0].url);
    const fqdn = url.hostname;
    
    const res = await browser.storage.local.get('trustedDomains');
    const trustedDomains = new Set(res.trustedDomains || []);
    
    if (trustedDomains.has(fqdn)) {
      button.textContent = 'Untrust it';
      currentState.textContent = 'You have marked this domain as trusted.';
      button.onclick = () => removeFromStorage(fqdn, trustedDomains);
    } else {
      button.textContent = 'Trust it';
      currentState.textContent = 'You have not marked this domain as trusted.';
      button.onclick = () => addToStorage(fqdn, trustedDomains);
    }
  }

  // Add FQDN to the list of trusted domains in storage
  async function addToStorage(fqdn) {
    const res = await browser.storage.local.get('trustedDomains');
    const trustedDomains = new Set(res.trustedDomains || []);
    trustedDomains.add(fqdn);
    await browser.storage.local.set({'trustedDomains': Array.from(trustedDomains)});
    checkFQDN(); // Refresh button state
  }

  // Remove FQDN from the list of trusted domains in storage
  async function removeFromStorage(fqdn) {
    const res = await browser.storage.local.get('trustedDomains');
    const trustedDomains = new Set(res.trustedDomains || []);
    trustedDomains.delete(fqdn);
    await browser.storage.local.set({'trustedDomains': Array.from(trustedDomains)});
    checkFQDN(); // Refresh button state
  }

  checkFQDN();
});


