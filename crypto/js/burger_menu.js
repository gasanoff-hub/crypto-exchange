const elb = {
  burgerMenu: document.querySelector(".btn-burger__menu"),
  menu: document.querySelector(".header__menu"),
  navToggle: document.querySelector(".nav__toggle"),
  body: document.querySelector("body"),
  languageBtn: document.querySelector(".header__language--selected"),
};

elb.burgerMenu.addEventListener("click", () => {
  const isOpen = elb.menu.classList.toggle("nav-toggle__active");
  elb.navToggle.classList.toggle("nav-toggle__active");
  elb.body.classList.toggle("menu__open");

  isOpen
    ? elb.languageBtn.classList.add("inactive")
    : elb.languageBtn.classList.remove("inactive");
});