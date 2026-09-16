const overlay = document.querySelector('#rsvp-overlay');
const form = document.querySelector('#rsvp-form');
const status = form.querySelector('.form-status');
const submitButton = form.querySelector('.dialog-submit');
const openButtons = document.querySelectorAll('.nav-links button, .primary-button, .mobile-rsvp');

function openDialog() {
  overlay.hidden = false;
  document.body.classList.add('dialog-open');
  window.setTimeout(() => form.elements.guestName.focus(), 0);
}

function closeDialog() {
  overlay.hidden = true;
  document.body.classList.remove('dialog-open');
}

openButtons.forEach((button) => button.addEventListener('click', openDialog));
overlay.querySelector('.dialog-close').addEventListener('click', closeDialog);
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) closeDialog();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !overlay.hidden) closeDialog();
});

const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
if ('IntersectionObserver' in window) {
  revealItems.forEach((item) => item.classList.add('reveal-pending'));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -6%' },
  );
  revealItems.forEach((item) => observer.observe(item));
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const guestName = String(data.get('guestName') || '').trim();
  const attendance = data.get('attendance') === 'yes' ? 'буду с радостью' : 'не смогу прийти';
  const wish = String(data.get('wish') || '').trim();
  const message = `${guestName}: ${attendance} на свадьбе Егора и Виктории 5 сентября 2026 года.${wish ? `\n${wish}` : ''}`;

  try {
    if (navigator.share) {
      await navigator.share({ title: 'Ответ на приглашение Егора и Виктории', text: message });
      submitButton.textContent = 'Ответ отправлен';
    } else {
      await navigator.clipboard.writeText(message);
      submitButton.textContent = 'Ответ скопирован';
      status.textContent = 'Вставьте сообщение в чат с Егором или Викторией.';
      status.hidden = false;
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return;
    await navigator.clipboard.writeText(message);
    submitButton.textContent = 'Ответ скопирован';
    status.textContent = 'Вставьте сообщение в чат с Егором или Викторией.';
    status.hidden = false;
  }
});

