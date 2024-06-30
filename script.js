class Slider {
  constructor(element) {
    this.element = element;
    this.innerElement = this.element.querySelector('.js-slider__inner');
    this.slides = Array.from(this.element.querySelectorAll('.js-slide'));
    this.bullets = Array.from(this.element.querySelectorAll('.js-slider-bullet'));
    this.textLines = Array.from(this.element.querySelectorAll('.js-slider__text-line'));
    this.textLineDivs = Array.from(this.element.querySelectorAll('.js-slider__text-line div'));
    
    this.currentSlide = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.showSlide(this.currentSlide);

    this.bullets.forEach((bullet, index) => {
      bullet.addEventListener('click', () => this.showSlide(index));
    });

    this.innerElement.addEventListener('touchstart', (e) => this.onTouchStart(e));
    this.innerElement.addEventListener('touchmove', (e) => this.onTouchMove(e));
    this.innerElement.addEventListener('touchend', (e) => this.onTouchEnd(e));
  }

  onTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  onTouchMove(e) {
    this.touchEndX = e.changedTouches[0].screenX;
  }

  onTouchEnd() {
    if (this.touchStartX - this.touchEndX > 50) {
      this.nextSlide();
    } else if (this.touchEndX - this.touchStartX > 50) {
      this.prevSlide();
    }
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prevIndex);
  }

  showSlide(index) {
    this.slides[this.currentSlide].classList.remove('is-active');
    this.slides[index].classList.add('is-active');
    this.bullets[this.currentSlide].classList.remove('is-active');
    this.bullets[index].classList.add('is-active');
    this.currentSlide = index;

    // Animate text lines
    this.textLineDivs.forEach((lineDiv, i) => {
      const delay = (i * 0.1) + 0.1;
      lineDiv.style.transitionDelay = `${delay}s`;
      lineDiv.style.transform = `translateY(${index === this.currentSlide ? '0' : '100%'})`;
    });

    // Set opacity for the slide content
    this.slides.forEach((slide, i) => {
      slide.querySelector('.slide__content').style.opacity = i === index ? '1' : '0';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sliderElement = document.querySelector('.js-slider');
  new Slider(sliderElement);
});
