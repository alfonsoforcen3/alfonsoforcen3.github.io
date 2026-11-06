const installDisclosure = document.getElementById('setup');
const installToggle = document.getElementById('install-toggle');
const installSummary = installDisclosure.querySelector('summary');
const installHashes = ['#setup', '#mac-setup', '#windows-setup', '#start'];

function syncInstallToggle() {
  installToggle.setAttribute('aria-expanded', String(installDisclosure.open));
}

function openInstall(hash) {
  if (!installHashes.includes(hash)) return;
  installDisclosure.open = true;
  const target = document.querySelector(hash);
  if (target.matches('.install-platform')) target.open = true;
}

installDisclosure.dataset.enhanced = '';
installSummary.textContent = 'Close install prompts';
openInstall(window.location.hash);
syncInstallToggle();

window.addEventListener('hashchange', () => openInstall(window.location.hash));
installToggle.addEventListener('click', event => {
  event.preventDefault();
  installDisclosure.open = !installDisclosure.open;
  syncInstallToggle();
  if (installDisclosure.open) {
    installDisclosure.scrollIntoView({block: 'nearest', behavior: 'instant'});
    installSummary.focus({preventScroll: true});
  }
});
installDisclosure.addEventListener('toggle', syncInstallToggle);
installSummary.addEventListener('click', event => {
  event.preventDefault();
  installDisclosure.open = false;
  installToggle.focus();
});
installDisclosure.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !installDisclosure.open) return;
  installDisclosure.open = false;
  installToggle.focus();
});
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (link !== installToggle) openInstall(link?.getAttribute('href'));
});

for (const button of installDisclosure.querySelectorAll('[data-copy-install]')) {
  const prompt = document.getElementById(button.dataset.copyInstall);
  const status = button.closest('.install-platform').querySelector('[role="status"]');
  const label = button.querySelector('span');
  let resetLabel;
  button.hidden = false;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(prompt.textContent.trim());
      label.textContent = 'Copied';
      status.textContent = 'Install prompt copied.';
      clearTimeout(resetLabel);
      resetLabel = setTimeout(() => { label.textContent = 'Copy'; }, 1800);
    } catch {
      label.textContent = 'Copy';
      clearTimeout(resetLabel);
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(prompt);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Prompt selected. Copy it with your keyboard or touch menu.';
    }
  });
}
