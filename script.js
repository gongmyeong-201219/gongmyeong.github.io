document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.js-slider');
  const sliderInner = slider.querySelector('.js-slider__inner');
  const slides = Array.from(slider.querySelectorAll('.js-slide'));
  const texts = Array.from(slider.querySelectorAll('.js-slider__text'));
  const navBullets = Array.from(slider.querySelectorAll('.js-slider-bullet'));

  let currentSlide = 0;
  let isAnimating = false;

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;

    isAnimating = true;
    const prevSlide = currentSlide;
    currentSlide = index;

    const prevSlideEl = slides[prevSlide];
    const currentSlideEl = slides[currentSlide];

    navBullets[prevSlide].classList.remove('is-active');
    navBullets[currentSlide].classList.add('is-active');

    TweenMax.fromTo(
      currentSlideEl,
      1,
      { zIndex: 1, opacity: 0 },
      { zIndex: 2, opacity: 1, ease: Power2.easeInOut }
    );

    TweenMax.fromTo(
      prevSlideEl,
      1,
      { zIndex: 2, opacity: 1 },
      {
        zIndex: 1,
        opacity: 0,
        ease: Power2.easeInOut,
        onComplete: () => {
          isAnimating = false;
        }
      }
    );

    texts.forEach((text, i) => {
      TweenMax.to(text, 1, {
        y: i === currentSlide ? '0%' : '100%',
        ease: Power2.easeInOut,
      });
    });
  };

  navBullets.forEach((bullet, index) => {
    bullet.addEventListener('click', () => goToSlide(index));
  });

  goToSlide(0);
});
