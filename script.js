<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CodePen - Fashion concept</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
  <link rel="stylesheet" href="./style.css">
</head>
<body>
<!-- partial:index.partial.html -->
<nav class="nav nav--left js-nav">
  <ul>
    <li>
      <a href="#"><span>Mens</span></a>
    </li>
    <li>
      <a href="#"><span>Womens</span></a>
    </li>
    <li>
      <a href="#" class="is-active"><span>Collections</span></a>
    </li>
  </ul>
</nav>

<figure class="logo">
  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/logo_copy_copy.svg">
</figure>

<nav class="nav nav--right">
  <ul>
    <li>
      <a href="https://twitter.com/Jesper_Landberg?lang=en" target="_blank"><span>Say hi</span></a>
    </li>
    <li>
      <a href="#">
        <span>Cart</span>
        <div class="cart-total">0</div>
      </a>
    </li>
  </ul>
</nav>

<div class="slider js-slider">
  <div class="slider__inner js-slider__inner"></div>
  
  <div class="slide js-slide">
    <div class="slide__content">
      <figure class="slide__img js-slide__img">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo1.jpg">
      </figure>
       <figure class="slide__img js-slide__img">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo2.jpg">
      </figure>
    </div>
    
    <div class="slider__text js-slider__text">
      <div class="slider__text-line js-slider__text-line"><div>Black is</div></div>
      <div class="slider__text-line js-slider__text-line"><div>timeless. Black is</div></div>
      <div class="slider__text-line js-slider__text-line"><div>the colour of</div></div>
      <div class="slider__text-line js-slider__text-line"><div>Eternity.</div></div>
    </div>
    
  </div>
  
  <div class="slide js-slide">
    <div class="slide__content">
      <figure class="slide__img js-slide__img">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo3.jpg">
      </figure>
       <figure class="slide__img js-slide__img">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo4.jpg">
      </figure>
    </div>
  </div>
  
  <div class="slide js-slide">
    <div class="slide__content">
      <figure class="slide__img js-slide__img">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo5.jpg">
      </figure>
       <figure class="slide__img js-slide__img">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo6.jpg">
      </figure>
    </div>
  </div>
  
  <nav class="slider__nav js-slider__nav">
    <div class="slider-bullet js-slider-bullet">
      <span class="slider-bullet__text js-slider-bullet__text">01</span>
      <span class="slider-bullet__line js-slider-bullet__line"></span>
    </div>
     <div class="slider-bullet js-slider-bullet">
      <span class="slider-bullet__text js-slider-bullet__text">02</span>
      <span class="slider-bullet__line js-slider-bullet__line"></span>
    </div>
     <div class="slider-bullet js-slider-bullet">
      <span class="slider-bullet__text js-slider-bullet__text">03</span>
      <span class="slider-bullet__line js-slider-bullet__line"></span>
    </div>
  </nav>
  
  <div class="scroll js-scroll">Scroll</div>
  
</div>

<div class="vert-text">
  <span>
    Wings+Horns<br>
    X Kyoto Black
  </span>
</div>
<!-- partial -->
  <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js'></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/three.js/99/three.min.js'></script>
  <script src="./script.js"></script>

</body>
</html>

<style>
html {
  font-size: 16px;
}

html, body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111;
  font-family: "helvetica neue", helvetica, sans-serif;
  overflow: hidden;
}

a {
  color: #fff;
  text-decoration: none;
}

.scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-family: "font-2";
  font-size: calc(0.5rem + 0.35vw);
  z-index: 10;
}

.logo {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0;
  margin: 0;
  z-index: 10;
}
.logo img {
  display: block;
  height: 1rem;
  width: auto;
}

ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav {
  position: absolute;
  top: 2rem;
  z-index: 10;
}
.nav--left {
  left: 1rem;
}
.nav--right {
  right: 1rem;
}
.nav ul {
  display: flex;
  align-items: center;
  height: 1rem;
}
.nav li {
  display: block;
  margin: 0 1rem;
  padding: 0;
}
.nav a {
  position: relative;
  display: flex;
  align-items: center;
  font-size: calc(0.5rem + 0.35vw);
  font-family: "helvetica neue", helvetica, sans-serif;
}
.nav a span {
  position: relative;
}
.nav a span:before {
  content: "";
  position: absolute;
  left: 0;
  bottom: -0.35rem;
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.25);
  transition: transform 0.75s ease;
  transform-origin: right;
  transform: scaleX(0);
}
.nav a:hover span:before, .nav a.is-active span:before {
  transform: scaleX(1);
  transform-origin: left;
}

.vert-text {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 15rem;
  display: flex;
  align-items: center;
  z-index: 10;
}
.vert-text span {
  display: block;
  color: #fff;
  text-transform: uppercase;
  line-height: 1.1;
  transform: rotate(-90deg) translateY(15rem);
  transform-origin: bottom left;
  font-size: 1.35rem;
}

.cart-total {
  display: block;
  height: 2rem;
  width: 2rem;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  text-align: center;
  line-height: 2rem;
  margin-left: 1rem;
}

.slider {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.slider__text {
  position: absolute;
  bottom: calc(2rem + 3vw);
  left: calc(2rem + 3vw);
  z-index: 10;
  font-size: calc(1rem + 4vw);
  text-transform: uppercase;
  transform-origin: top;
  line-height: 1.075;
  color: #fff;
  font-weight: 500;
}
.slider__text-line {
  overflow: hidden;
  height: auto;
}
.slider__text-line div {
  transform: translateY(100%);
  will-change: transform;
}
.slider__nav {
  position: absolute;
  left: 2rem;
  bottom: 2rem;
  z-index: 10;
}
.slider-bullet {
  position: relative;
  margin: 0.5rem 0;
  cursor: pointer;
}
.slider-bullet__text {
  color: #fff;
  font-size: calc(0.5rem + 0.35vw);
  display: block;
  font-family: "font-2";
  letter-spacing: 0.15em;
  white-space: nowrap;
  overflow: hidden;
  text-transform: uppercase;
}
.slider-bullet__line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.25);
  transition: transform 0.75s ease;
  transform-origin: right;
  transform: scaleX(0);
}
.slider-bullet:hover .slider-bullet__line, .slider-bullet.is-active .slider-bullet__line {
  transform: scaleX(1);
  transform-origin: left;
}

.js-slider {
  overflow: hidden;
}
.slider__inner {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.slide {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.slide__content {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}
.slide__img {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.slide__img img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

<script>
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
</script>
