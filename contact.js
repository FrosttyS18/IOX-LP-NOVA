const leadForm = document.querySelector('#lead-form');
const formHeading = document.querySelector('.form-heading');
const contactNext = document.querySelector('#form-success');
const contactName = leadForm.elements.namedItem('name');
const contactPhone = leadForm.elements.namedItem('phone');
const submitContact = leadForm.querySelector('[type="submit"]');

function validateContactName() {
  contactName.setCustomValidity(contactName.value.trim().length >= 3 ? '' : 'Informe seu nome com pelo menos 3 caracteres.');
}

function validateContactPhone() {
  const digits = contactPhone.value.replace(/\D/g, '');
  contactPhone.setCustomValidity(digits.length >= 10 && digits.length <= 15 ? '' : 'Informe um telefone com DDD, incluindo de 10 a 15 dígitos.');
}

contactName.addEventListener('input', validateContactName);
contactPhone.addEventListener('input', validateContactPhone);

leadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  validateContactName();
  validateContactPhone();
  if (!leadForm.reportValidity()) return;

  document.querySelector('#success-copy').textContent = leadForm.elements.namedItem('qualified').value === 'yes'
    ? 'Para conversar com a equipe do Grupo IOX, escreva para contato@iox.com.vc.'
    : 'Tire suas dúvidas sobre crédito privado e os critérios de acesso ao IOX 90 pelo e-mail contato@iox.com.vc.';
  leadForm.hidden = true;
  formHeading.hidden = true;
  contactNext.hidden = false;
  contactNext.focus({ preventScroll: true });
});

document.querySelector('#form-reset').addEventListener('click', () => {
  leadForm.reset();
  contactName.setCustomValidity('');
  contactPhone.setCustomValidity('');
  contactNext.hidden = true;
  formHeading.hidden = false;
  leadForm.hidden = false;
  contactName.focus({ preventScroll: true });
});

submitContact.disabled = false;
