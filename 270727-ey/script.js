const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  revealObserver.observe(item);
});

const eventDate = new Date('2027-07-27T16:00:00+03:00');
const daysNode = document.querySelector('[data-days]');
const hoursNode = document.querySelector('[data-hours]');
const minutesNode = document.querySelector('[data-minutes]');

function updateCountdown() {
  const distance = Math.max(0, eventDate.getTime() - Date.now());
  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  daysNode.textContent = Math.floor(distance / day);
  hoursNode.textContent = String(Math.floor((distance % day) / hour)).padStart(2, '0');
  minutesNode.textContent = String(Math.floor((distance % hour) / 60000)).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 60000);

const modal = document.querySelector('[data-rsvp-modal]');
const form = document.querySelector('[data-rsvp-form]');
const status = document.querySelector('[data-form-status]');

document.querySelector('[data-open-rsvp]').addEventListener('click', () => {
  modal.showModal();
  document.body.classList.add('modal-open');
});

document.querySelector('[data-close-rsvp]').addEventListener('click', () => modal.close());
modal.addEventListener('close', () => document.body.classList.remove('modal-open'));
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const guest = data.get('guest').trim();
  const attendance = data.get('attendance');
  const note = data.get('note').trim();
  const message = [
    'Ответ на приглашение Евгения и Юлии — 27.07.2027',
    `Имя: ${guest}`,
    `Ответ: ${attendance}`,
    note ? `Комментарий: ${note}` : ''
  ].filter(Boolean).join('\n');

  try {
    if (navigator.share) {
      await navigator.share({ title: 'Ответ на приглашение', text: message });
      status.textContent = 'Спасибо! Осталось отправить выбранное сообщение.';
    } else {
      await navigator.clipboard.writeText(message);
      status.textContent = 'Ответ скопирован. Отправьте его Евгению или Юлии в мессенджере.';
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      status.textContent = 'Не удалось открыть отправку. Сделайте снимок экрана с вашим ответом.';
    }
  }
});
