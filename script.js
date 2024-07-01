class Slider {
  constructor() {
    this.bindAll();

    // 나머지 코드는 이전과 동일하게 유지됩니다.

    this.init();
  }

  // 나머지 메서드는 이전과 동일하게 유지됩니다.

  prevSlide() {
    if (this.state.animating) return;

    this.state.animating = true;

    TweenMax.to(this.mat.uniforms.dispPower, 2.5, {
      value: 1,
      ease: Expo.easeInOut,
      onUpdate: this.render,
      onComplete: () => {
        this.mat.uniforms.dispPower.value = 0.0;
        this.changeTexture();
        this.render.bind(this);
        this.state.animating = false;
      }
    });

    const current = this.slides[this.data.current];
    const prev = this.data.current === 0 ? this.slides[this.data.total] : this.slides[this.data.current - 1];

    const currentImages = current.querySelectorAll('.js-slide__img');
    const prevImages = prev.querySelectorAll('.js-slide__img');

    const currentText = current.querySelectorAll('.js-slider__text-line div');
    const prevText = prev.querySelectorAll('.js-slider__text-line div');

    const currentBullet = this.bullets[this.data.current];
    const prevBullet = this.bullets[this.data.current === 0 ? this.data.total : this.data.current - 1];

    const currentBulletTxt = currentBullet.querySelectorAll('.js-slider-bullet__text');
    const prevBulletTxt = prevBullet.querySelectorAll('.js-slider-bullet__text');

    const currentBulletLine = currentBullet.querySelectorAll('.js-slider-bullet__line');
    const prevBulletLine = prevBullet.querySelectorAll('.js-slider-bullet__line');

    const tl = new TimelineMax({ paused: true });

    if (this.state.initial) {
      TweenMax.to('.js-scroll', 1.5, {
        yPercent: 100,
        alpha: 0,
        ease: Power4.easeInOut
      });

      this.state.initial = false;
    }

    tl
      .staggerFromTo(currentImages, 1.5, {
        yPercent: 0,
        scale: 1
      }, {
        yPercent: 150,
        scaleY: 1.5,
        ease: Expo.easeInOut
      }, 0.075)
      .to(currentBulletTxt, 1.5, {
        alpha: 0.25,
        ease: Linear.easeNone
      }, 0)
      .set(currentBulletLine, {
        transformOrigin: 'right'
      }, 0)
      .to(currentBulletLine, 1.5, {
        scaleX: 0,
        ease: Expo.easeInOut
      }, 0);

    if (currentText) {
      tl
        .fromTo(currentText, 2, {
          yPercent: 0
        }, {
          yPercent: 100,
          ease: Power4.easeInOut
        }, 0);
    }

    tl
      .set(current, {
        autoAlpha: 0
      })
      .set(prev, {
        autoAlpha: 1
      }, 1);

    if (prevText) {
      tl
        .fromTo(prevText, 2, {
          yPercent: -100
        }, {
          yPercent: 0,
          ease: Power4.easeOut
        }, 1.5);
    }

    tl
      .staggerFromTo(prevImages, 1.5, {
        yPercent: -185,
        scaleY: 1.5
      }, {
        yPercent: 0,
        scaleY: 1,
        ease: Expo.easeInOut
      }, 0.075, 1)
      .to(prevBulletTxt, 1.5, {
        alpha: 1,
        ease: Linear.easeNone
      }, 1)
      .set(prevBulletLine, {
        transformOrigin: 'left'
      }, 1)
      .to(prevBulletLine, 1.5, {
        scaleX: 1,
        ease: Expo.easeInOut
      }, 1);

    tl.play();
    this.data.current = this.data.current === 0 ? this.data.total : this.data.current - 1;
    this.data.next = this.data.current === 0 ? this.data.total : this.data.current - 1;
  }

  nextSlide() {
    if (this.state.animating) return;

    this.state.animating = true;

    this.transitionNext();

    this.data.current = this.data.current === this.data.total ? 0 : this.data.current + 1;
    this.data.next = this.data.current === this.data.total ? 0 : this.data.current + 1;
  }

  touchMove = (event) => {
    this.deltaX = event.touches[0].clientX - this.startX;
    this.deltaY = event.touches[0].clientY - this.startY;
  }

  touchEnd = () => {
    if (Math.abs(this.deltaY) > 50) {
      this.deltaY > 0 ? this.nextSlide() : this.prevSlide();
    }
  }

  // 나머지 메서드는 이전과 동일하게 유지됩니다.
}
