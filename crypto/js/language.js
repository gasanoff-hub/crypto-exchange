document.addEventListener('DOMContentLoaded', () => {
  const elLang = {
    selected: document.querySelector('.header__language--selected'),
    selectedIcon: document.querySelector('.header__selected--flag'),
    optionsContainer: document.querySelector('.header__language--options'),
    options: document.querySelectorAll('.header__language--option'),
    overlay: document.querySelector('.header__language--overlay'),
  };

  elLang.selected.addEventListener('click', () => {
    elLang.optionsContainer.classList.toggle('hidden');
    elLang.overlay.classList.toggle('hidden');
  });

  elLang.overlay.addEventListener('click', () => {
    elLang.optionsContainer.classList.add('hidden');
    elLang.overlay.classList.add('hidden');
  });

  elLang.options.forEach(option => option.addEventListener('click', () => {
    elLang.selectedIcon.src = option.querySelector('img').src;
    elLang.optionsContainer.classList.add('hidden');
    elLang.overlay.classList.add('hidden');
  }));
});