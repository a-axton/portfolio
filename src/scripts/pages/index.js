import background from '../background/background';
const setCurrentRoute = () => {
  currentRoute = window.location.hash;
  currentRoute = currentRoute === '' ? '/' : currentRoute;
  console.log(currentRoute)
}
let currentRoute = window.location.hash;
setCurrentRoute();
let routes = {
  '/': 'home',
  '#about': 'about',
  '#projects': 'projects'
};
let pages = {
  home: document.getElementById('home'),
  about: document.getElementById('about'),
  projects: document.getElementById('projects')
};
const getCurrentRoute = (route) => routes[currentRoute];
const getRouteName = (route) => routes[route];
const getPage = (name) => pages[name];

const animate = (direction, currentPage, nextPage) => {
  document.body.className = '';
  document.body.classList.add(`from-${currentPage}-to-${nextPage}`);
  background.animate(direction, currentPage, nextPage);
  setCurrentRoute();
}

export default {
  setCurrentRoute: () => {
    setCurrentRoute();
  },
  animate: (nextPage) => {
    let currentPage = getCurrentRoute();

    if (currentPage === 'home') {
      if (nextPage === 'projects') {
        animate('left', currentPage, nextPage);
      } else if (nextPage === 'about') {
        animate('down', currentPage, nextPage);
      }
    } else if (currentPage === 'about') {
      if (nextPage === 'home') {
        animate('up', currentPage, nextPage);
      } else if (nextPage === 'projects') {
        animate('left', currentPage, nextPage);
      }
    } else if (currentPage === 'projects') {
      if (nextPage === 'home') {
        animate('right', currentPage, nextPage);
      } else if (nextPage === 'about') {
        animate('right', currentPage, nextPage);
      }
    }
  }
}
