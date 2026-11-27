const search = document.querySelector('[role="search"]');
const input = search.querySelector('input');
const status = search.querySelector('[role="status"]');
const sections = [...document.querySelectorAll('[data-category]')];
const categoryLinks = document.querySelectorAll('.categories a');
const popular = document.querySelector('[data-popular]');
const language = document.querySelector('[data-language]');
const alternate = language.getAttribute('href');
const spanish = document.documentElement.lang.startsWith('es');
const normalize = text => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

function filter() {
  const terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
  let total = 0;

  sections.forEach((section, index) => {
    const category = section.querySelector('h2').textContent;
    let visible = 0;
    section.querySelectorAll('.card').forEach(card => {
      const searchable = normalize(category + ' ' + card.querySelector('h3').textContent);
      card.hidden = !terms.every(term => searchable.includes(term));
      visible += Number(!card.hidden);
    });
    section.hidden = visible === 0;
    categoryLinks[index].hidden = section.hidden;
    total += visible;
  });

  popular.hidden = terms.length > 0;
  status.textContent = '';
  if (terms.length) {
    if (total === 0) {
      status.textContent = spanish ? 'Sin resultados. Prueba con otra búsqueda.' : 'No matches. Try a different search.';
    } else {
      status.textContent = spanish ? `Resultados: ${total}` : `Results: ${total}`;
    }
  }
}

function showLinkedCard() {
  const hash = location.hash;
  language.href = alternate + hash;
  const card = document.getElementById(hash.slice(1));
  const details = card?.querySelector(':scope > details');
  if (details) {
    if (card.hidden) {
      input.value = '';
      filter();
    }
    details.open = true;
    card.scrollIntoView({ block: 'start' });
  }
}

search.addEventListener('submit', event => event.preventDefault());
input.addEventListener('input', filter);
window.addEventListener('hashchange', showLinkedCard);
search.hidden = false;
filter();
showLinkedCard();
