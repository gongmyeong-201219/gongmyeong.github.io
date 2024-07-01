class Slider {
  constructor() {
    this.bindAll();

    // 이미지 경로 설정
    this.images = [
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo1.jpg',
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo2.jpg',
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/photo3.jpg'
    ];

    // 슬라이드 정보 설정
    this.data = {
      current: 0,
      total: this.images.length - 1
    };

    // 기타 초기화
    this.state = {
      animating: false,
      initial: true
    };

    // 기타 설정
    this.setup();
    this.cameraSetup();
    this.loadTextures();
    this.createMesh();
    this.setStyles();
    this.render();
    this.listeners();
  }

  bindAll() {
    ['render', 'nextSlide', 'prevSlide', 'handleTouchStart', 'handleTouchMove', 'handleTouchEnd']
      .forEach(fn => this[fn] = this[fn].bind(this));
  }

  setup() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock(true);

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.querySelector('.js-slider__inner').appendChild(this.renderer.domElement);
  }

  cameraSetup() {
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 400;
  }

  loadTextures() {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '';

    this.textures = [];
    this.images.forEach((image, index) => {
      const texture = loader.load(image + '?v=' + Date.now(), this.render);
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      this.textures.push(texture);
    });

    this.disp = loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/rock-_disp.png', this.render);
    this.disp.magFilter = this.disp.minFilter = THREE.LinearFilter;
    this.disp.wrapS = this.disp.wrapT = THREE.RepeatWrapping;
  }

  createMesh() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        dispPower: { type: 'f', value: 0.0 },
        intensity: { type: 'f', value: 0.5 },
        res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        size: { value: new THREE.Vector2(1, 1) },
        texture1: { type: 't', value: this.textures[0] },
        texture2: { type: 't', value: this.textures[1] },
        disp: { type: 't', value: this.disp }
      },
      transparent: true,
      vertexShader: document.getElementById('vertexshader').textContent,
      fragmentShader: document.getElementById('fragmentshader').textContent
    });

    const geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight, 1);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  setStyles() {
    const slides = document.querySelectorAll('.js-slide');
    slides.forEach((slide, index) => {
      if (index !== 0) {
        slide.style.opacity = 0;
      }
    });

    const bullets = document.querySelectorAll('.js-slider-bullet');
    bullets.forEach((bullet, index) => {
      const text = bullet.querySelector('.js-slider-bullet__text');
      const line = bullet.querySelector('.js-slider-bullet__line');
      text.style.opacity = 0.25;
      line.style.transformOrigin = 'left';
      line.style.transform = 'scaleX(0)';
    });
  }

  listeners() {
    window.addEventListener('wheel', this.nextSlide, { passive: true });
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);
  }

  render() {
    const delta = this.clock.getDelta();
    this.material.uniforms.dispPower.value = Math.sin(delta / 2);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  }

  nextSlide() {
    if (this.state.animating) return;
    this.state.animating = true;

    const currentSlide = document.querySelector(`.js-slide[data-index="${this.data.current}"]`);
    const nextIndex = this.data.current === this.data.total ? 0 : this.data.current + 1;
    const nextSlide = document.querySelector(`.js-slide[data-index="${nextIndex}"]`);

    const tl = new TimelineMax({
      onComplete: () => {
        this.state.animating = false;
        this.data.current = nextIndex;
      }
    });

    tl.to(currentSlide, 1, { opacity: 0 })
      .to(nextSlide, 1, { opacity: 1 }, 0);

    tl.play();
  }

  prevSlide() {
    if (this.state.animating) return;
    this.state.animating = true;

    const currentSlide = document.querySelector(`.js-slide[data-index="${this.data.current}"]`);
    const prevIndex = this.data.current === 0 ? this.data.total : this.data.current - 1;
    const prevSlide = document.querySelector(`.js-slide[data-index="${prevIndex}"]`);

    const tl = new TimelineMax({
      onComplete: () => {
        this.state.animating = false;
        this.data.current = prevIndex;
      }
    });

    tl.to(currentSlide, 1, { opacity: 0 })
      .to(prevSlide, 1, { opacity: 1 }, 0);

    tl.play();
  }

  handleTouchStart(event) {
    event.preventDefault();
    this.touchStartY = event.touches[0].clientY;
  }

  handleTouchMove(event) {
    event.preventDefault();
    this.touchEndY = event.touches[0].clientY;
  }

  handleTouchEnd() {
    if (this.touchStartY - this.touchEndY > 50) {
      // 아래로 스와이프 했을 때
      this.prevSlide();
    } else if (this.touchEndY - this.touchStartY > 50) {
      // 위로 스와이프 했을 때
      this.nextSlide();
    }
  }
}

// Toggle active link
const links = document.querySelectorAll('.js-nav a');
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    links.forEach(other => other.classList.remove('is-active'));
    link.classList.add('is-active');
  });
});

// Initialize Slider
const slider = new Slider();
