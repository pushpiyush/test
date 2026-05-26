const headerNode = document.getElementsByTagName("header")[0];
const menuModalNode = document.getElementById("menu-modal");
let menuOpen = false;
let themeModalOpen = false;

headerNode.innerHTML = `<span class="material-symbols-outlined" id="header-menu" onclick="openMenu()" title="menu">menu</span>
  <h1 id="header-title" title="test" onclick="window.location.assign('index.html')">PYQ<em>test</em></h1>
  <span class="material-symbols-outlined" id="profile" onclick="" title="profile">account_circle</span>
  `;
  
  /*<img id="header-menu" src="icons/menu.svg" onclick="openMenu()" title="menu">
  <img id="profile" src="icons/account_circle.svg" title="profile">*/
  
menuModalNode.innerHTML = `<div id="menu">
    <div class="option">
      <p>Language</p>
      <p>en</p>
    </div>
    <div class="option" onclick="openThemeModal()">
      <p>Theme</p>
    </div>
    <div class="option">
      <div>Buy Me A Coffee</div>
    </div>
    <div class="option last-option" id="menu-about">
      <p>ABOUT US</p>
      <p>FAQs</p>
      <p>T&C</p>
    </div>
    <div id="theme-modal">
      <div class="option" onclick="theme.changeTheme('light')">Light</div>
      <div class="option" onclick="theme.changeTheme('dark')">Dark</div>
      <div class="option" onclick="theme.changeTheme('light2')">Light 2</div>
      <div class="option" onclick="theme.changeTheme('dark2')">Dark 2</div>
      <div class="option" onclick="theme.changeTheme('light3')">Light 3</div>
      <div class="option" onclick="theme.changeTheme('dark3')">Dark 3</div>
      <div class="option" onclick="theme.changeTheme('light4')">Light 4</div>
      <div class="option" onclick="theme.changeTheme('dark4')">Dark 4</div>
      <div class="option" onclick="theme.changeTheme('light5')">Light 5</div>
      <div class="option" onclick="theme.changeTheme('dark5')">Dark 5</div>
    </div>
  </div>`;
  
const menuNode = document.getElementById("menu");
const headerMenuNode = document.getElementById("header-menu");
const themeModalNode = document.getElementById("theme-modal");

function openMenu() {
  const c = menuModalNode.classList;
  menuAnimation();
  if (menuOpen) {
    menuNode.style.animation = "slideleft 0.5s ease-in-out";
    setTimeout((() => c.add("hide")), 500);
    if (themeModalOpen) openThemeModal();
    menuOpen = !menuOpen;
  } else if (!menuOpen) {
    if (c.contains("hide")) {
      c.remove("hide");
      menuNode.style.animation = "slideright 0.5s ease-in-out";
      menuOpen = !menuOpen;
    }
  }
}

function menuModalClick(event) {
  if (!event.target.closest("#menu")) {
    openMenu();
  }
}

function menuAnimation() {
  if (menuOpen) {
    headerMenuNode.style.animation = "rotate-clock 0.25s ease-in";
    setTimeout((() => {
      /*headerMenuNode.src="icons/menu.svg";*/
      headerMenuNode.innerHTML = "menu";
      headerMenuNode.style.animation = "rotate-clock2 0.25s ease-out";
    }), 200);
  } else {
    headerMenuNode.style.animation = "rotate-anticlock 0.25s ease-in";
    setTimeout((() => {
      /*headerMenuNode.src="icons/close.svg";*/
      headerMenuNode.innerHTML = "close";
      headerMenuNode.style.animation = "rotate-anticlock2 0.25s ease-out";
    }), 200);
  }
}

const theme = {
  get getTheme() {
    return localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
  },
  get newTheme() {
    return this.getTheme === "dark"?"light":"dark";
  },
  changeTheme(themeName) {
    document.documentElement.setAttribute("data-theme" , `${themeName}`);
    localStorage.setItem("theme", themeName);
  }
}

function openThemeModal() {
  themeModalNode.classList.toggle('open');
  themeModalOpen = themeModalNode.classList.contains('open');
  console.log(themeModalOpen);
}

theme.changeTheme(theme.getTheme);