import Navigo from 'navigo';
import 'devtools-detect';
import background from './background/background';
import pages from './pages';
import ps from 'perfect-scrollbar';

if (window.location.hash.length) {
  window.location.hash = '';
}

const router = new Navigo(null, true);

window.addEventListener('devtoolschange', function (e) {
  document.getElementById('watching-you').classList.toggle('open');
});

document.getElementById('nav-toggle').addEventListener('click', () => {
  if (document.body.classList.contains('nav-open')) {
    document.body.classList.add('nav-close');
    document.body.classList.remove('nav-open');
  } else {
    document.body.classList.add('nav-open');
    document.body.classList.remove('nav-close');
  }
});

ps.initialize(document.getElementById('projects-scroll'), {
});
// router.navigate('');

router
  .on('/', () => {
    background.resumeMouseMovement();
    pages.animate('home');
    pages.setCurrentRoute();
  })
  .on('about', () => {
    background.pauseMouseMovement();
    pages.animate('about');
    pages.setCurrentRoute();
  })
  .on('projects', () => {
    background.pauseMouseMovement();
    pages.animate('projects');
    pages.setCurrentRoute();
    // Ps.update(document.getElementById('projects'));
  })
  .resolve();

