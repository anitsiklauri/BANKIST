'use strict';

// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function(item) {
  item.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function(e) {
  /*
  const s1coords = section1.getBoundingClientRect();
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth'
  });
  */
 section1.scrollIntoView({behavior: 'smooth'});
});

/*document.querySelectorAll('.nav__link').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  })
});*/

document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  // Matching
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');
  if(!clicked) return;
  tabs.forEach(function(btn) {
    btn.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(function(content) {
    content.classList.remove('operations__content--active');
  })
  clicked.classList.add('operations__tab--active');

  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
});

const nav = document.querySelector('.nav');
const navItems = document.querySelectorAll('.nav__link');
const logo = document.querySelector('.nav__logo');

nav.addEventListener('mouseover', function(event) {
  if (event.target.classList.contains('nav__link')) {
    navItems.forEach(function(link) {
      if (link !== event.target) {
        link.classList.add('op');
      }
    });
    logo.classList.add('op');
  }
});

nav.addEventListener('mouseout', function() {
  navItems.forEach(function(link) {
    link.classList.remove('op');
  });
  logo.classList.remove('op');
});
/*
const initialCords = section1.getBoundingClientRect();
window.addEventListener('scroll', function() {
  if(window.scrollY > initialCords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
*/

/*
const obsCallback = function(entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  })
};
const obsOptions = {
  root: null,
  threshold: 0.1
}
const observer = new IntersectionObserver();
observer.observe(section1)
*/


const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')

};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
})
allSections.forEach(function(section) {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

// lazy-loading images
const allImgs = document.querySelectorAll('img[data-src]');
const revealImage = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(revealImage, {
  root: null,
  threshold: 0,
  rootMargin: '-200px'
});

allImgs.forEach(function(img) {
  imgObserver.observe(img);
}); 

// slider

const slider = function() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  
  let currSlide = 0;
  const maxSlide = slides.length;
  /*const slider = document.querySelector('.slider');
  slider.style.transform = 'scale(0.4) translateX(-1300px)';
  slider.style.overflow = 'visible';*/
  
  // 0% 100% 200% 300%
  //next slide
  
  const createDots = function() {
    slides.forEach(function(s, i) {
      dotContainer.insertAdjacentHTML('beforeend', 
      `<button class = "dots__dot" data-slide = "${i}"></button>`
      );
    })
  };
  createDots();
  
  const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };
  
  activateDot(0);
  
  const goToSlide = function(slide) {
    slides.forEach(function(s, i) {
      s.style.transform = `translateX(${(i - slide)*100}%)`
    })
  }
  
  goToSlide(0);
  
  const nextSlide = function() {
    if(currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };
  
  btnRight.addEventListener('click', nextSlide);
  
  //previous slide
  
  const prevSlide = function() {
    if(currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }
    
    goToSlide(currSlide);
    activateDot(currSlide);
  }
  
  btnLeft.addEventListener('click', prevSlide);
  
  document.addEventListener('keydown', function(e) {
    if(e.key === 'ArrowLeft') {
      prevSlide();
    }
    e.key === 'ArrowRight' && nextSlide();
  });
  
  dotContainer.addEventListener('click', function(e) {
    if(e.target.classList.contains('dots__dot')) {
      const {slide} = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
}

slider();

window.addEventListener('beforeunload', function(e) {
  e.preventDefault();
  e.returnValue = '';
});



//API

const url = 'https://api.coincap.io/v2/assets';

async function fetchData() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('დაფიქსირდა პრობლემა სერვერთან.');
    const data = await response.json();

    // მონაცემების ჩვენება HTML-ში
    const container = document.querySelector('.crypto-data');
    container.innerHTML = data.data
      .slice(0, 12) // აჩვენებს მხოლოდ 12 კრიპტოვალუტას
      .map(
        (item) =>
          `<div class="crypto-item">
            <p><strong>${item.name}</strong> (${item.symbol})</p>
            <span>Price: $${parseFloat(item.priceUsd).toFixed(2)}</span>
          </div>`
      )
      .join('');
  } catch (error) {
    console.error('შეცდომა:', error.message);
  }
}

fetchData();







