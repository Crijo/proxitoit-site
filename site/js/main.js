// Menu mobile
const btn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
if (btn && nav) {
  btn.addEventListener('click', () => {
    const ouvert = nav.classList.toggle('ouvert');
    btn.setAttribute('aria-expanded', String(ouvert));
    btn.textContent = ouvert ? 'Fermer' : 'Menu';
  });
}

// Formulaire de devis : prépare un e-mail dans la messagerie du visiteur
const form = document.getElementById('form-devis');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const retour = document.getElementById('form-retour');
    const manque = ['nom', 'tel', 'message'].filter((k) => !String(d.get(k) || '').trim());
    if (manque.length) {
      retour.textContent = 'Indiquez au moins votre nom, votre téléphone et votre projet.';
      form.querySelector(`[name="${manque[0]}"]`).focus();
      return;
    }
    const sujet = `Demande de devis – ${d.get('type')} – ${d.get('commune') || 'commune non précisée'}`;
    const corps = `Nom : ${d.get('nom')}\nTéléphone : ${d.get('tel')}\nCommune : ${d.get('commune')}\nTravaux : ${d.get('type')}\n\n${d.get('message')}`;
    window.location.href = `mailto:proxitoit@gmail.com?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
    retour.textContent = 'Votre messagerie s\'ouvre avec la demande prête à envoyer. Sinon, appelez le 03 85 80 48 41.';
  });
}
