document.addEventListener('DOMContentLoaded', async () => {
  const trustedStylesTextarea = document.getElementById('trustedStyles');
  const untrustedStylesTextarea = document.getElementById('untrustedStyles');

  // Load initial values from storage
  const trustedStyles = await browser.storage.local.get('trustedCSS');
  const untrustedStyles = await browser.storage.local.get('untrustedCSS');
  trustedStylesTextarea.value = trustedStyles.trustedCSS || '';
  untrustedStylesTextarea.value = untrustedStyles.untrustedCSS || '';

  document.getElementById('updateTrustedStyles').addEventListener('click', async () => {
    await browser.storage.local.set({'trustedCSS': trustedStylesTextarea.value});
    alert('Trusted styles updated!');
  });

  document.getElementById('updateUntrustedStyles').addEventListener('click', async () => {
    await browser.storage.local.set({'untrustedCSS': untrustedStylesTextarea.value});
    alert('Untrusted styles updated!');
  });

  document.getElementById('importTrustedDomains').addEventListener('click', async () => {
    const domains = document.getElementById('trustedDomains').value.split('\n');
    for (let fqdn of domains) {
      await addToStorage(fqdn.trim());
    }
    alert('Trusted domains imported!');
  });
});

async function addToStorage(fqdn) {
  if (!fqdn) return; // Skip empty lines
  const res = await browser.storage.local.get('trustedDomains');
  const trustedDomains = new Set(res.trustedDomains || []);
  trustedDomains.add(fqdn);
  await browser.storage.local.set({'trustedDomains': Array.from(trustedDomains)});
}
