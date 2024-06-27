// The MIT License (MIT)

// Copyright (c) 2024 jesper landberg (https://codepen.io/ReGGae/pen/bmyYEj)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var Framer = {

        countTicks: 360,

        frequencyData: [],

        tickSize: 10,

        PI: 360,

        index: 0,

        loadingAngle: 0,

        init: function (scene) {
            this.canvas = document.querySelector('canvas');
            this.scene = scene;
            this.context = scene.context;
            this.configure();
        },

        configure: function () {
            this.maxTickSize = this.tickSize * 9 * this.scene.scaleCoef;
            this.countTicks = 360 * Scene.scaleCoef;
        },

        draw: function () {
            this.drawTicks();
            this.drawEdging();
        },

        drawTicks: function () {
            this.context.save();
            this.context.beginPath();
            this.context.lineWidth = 1;
            this.ticks = this.getTicks(this.countTicks, this.tickSize, [0, 90]);
            for (var i = 0, len = this.ticks.length; i < len; ++i) {
                var tick = this.ticks[i];
                this.drawTick(tick.x1, tick.y1, tick.x2, tick.y2);
            }
            this.context.restore();
        },

        drawTick: function (x1, y1, x2, y2) {
            var dx1 = parseInt(this.scene.cx + x1);
            var dy1 = parseInt(this.scene.cy + y1);

            var dx2 = parseInt(this.scene.cx + x2);
            var dy2 = parseInt(this.scene.cy + y2);

            var gradient = this.context.createLinearGradient(dx1, dy1, dx2, dy2);
            gradient.addColorStop(0, '#FE4365');
            gradient.addColorStop(0.6, '#FE4365');
            gradient.addColorStop(1, '#F5F5F5');
            this.context.beginPath();
            this.context.strokeStyle = gradient;
            this.context.lineWidth = 2;
            this.context.moveTo(this.scene.cx + x1, this.scene.cx + y1);
            this.context.lineTo(this.scene.cx + x2, this.scene.cx + y2);
            this.context.stroke();
        },

        setLoadingPercent: function (percent) {
            this.loadingAngle = percent * 2 * Math.PI;
        },

        drawEdging: function () {
            this.context.save();
            this.context.beginPath();
            this.context.strokeStyle = 'rgba(254, 67, 101, 0.5)';
            this.context.lineWidth = 1;

            var offset = Tracker.lineWidth / 2;
            this.context.moveTo(this.scene.padding + 2 * this.scene.radius - Tracker.innerDelta - offset, this.scene.padding + this.scene.radius);
            this.context.arc(this.scene.cx, this.scene.cy, this.scene.radius - Tracker.innerDelta - offset, 0, this.loadingAngle, false);

            this.context.stroke();
            this.context.restore();
        },

        getTicks: function (count, size, animationParams) {
            size = 10;
            var ticks = this.getTickPoitns(count);
            var x1, y1, x2, y2, m = [], tick, k;
            var lesser = 160;
            var allScales = [];
            for (var i = 0, len = ticks.length; i < len; ++i) {
                var coef = 1 - i / (len * 2.5);
                var delta = ((this.frequencyData[i] || 0) - lesser * coef) * this.scene.scaleCoef;
                if (delta < 0) {
                    delta = 0;
                }
                tick = ticks[i];
                if (animationParams[0] <= tick.angle && tick.angle <=  animationParams[1]) {
                    k = this.scene.radius / (this.scene.radius - this.getSize(tick.angle, animationParams[0], animationParams[1]) - delta);
                } else {
                    k = this.scene.radius / (this.scene.radius - (size + delta));
                }
                x1 = tick.x * (this.scene.radius - size);
                y1 = tick.y * (this.scene.radius - size);
                x2 = x1 * k;
                y2 = y1 * k;
                m.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
                if (i < 20) {
                    var scale = delta / 50;
                    scale = scale < 1 ? 1 : scale;
                    allScales.push(scale);
                }
            }
            var sum = allScales.reduce(function(pv, cv) { return pv + cv; }, 0) / allScales.length;
            this.canvas.style.transform = 'scale('+sum+')';
            return m;
        },

        getSize: function (angle, l, r) {
            var m = (r - l) / 2;
            var x = (angle - l);
            var h;

            if (x == m) {
                return this.maxTickSize;
            }
            var d = Math.abs(m - x);
            var v = 70 * Math.sqrt(1 / d);
            if (v > this.maxTickSize) {
                h = this.maxTickSize - d;
            } else {
                h = Math.max(this.tickSize, v);
            }

            if (this.index > this.count) {
                this.index = 0;
            }

            return h;
        },

        getTickPoitns: function (count) {
            var coords = [], step = this.PI / count;
            for (var deg = 0; deg < this.PI; deg += step) {
                var rad = deg * Math.PI / (this.PI / 2);
                coords.push({ x: Math.cos(rad), y: -Math.sin(rad), angle: deg });
            }
            return coords;
        }
    };
    'use strict';

    var Tracker = {

        innerDelta: 20,

        lineWidth: 7,

        prevAngle: 0.5,

        angle: 0,

        animationCount: 10,

        pressButton: false,

        init: function (scene) {
            this.scene = scene;
            this.context = scene.context;
            this.initHandlers();
        },

        initHandlers: function () {
            var that = this;

            this.scene.canvas.addEventListener('mousedown', function (e) {
                if (that.isInsideOfSmallCircle(e) || that.isOusideOfBigCircle(e)) {
                    return;
                }
                that.prevAngle = that.angle;
                that.pressButton = true;
                that.stopAnimation();
                that.calculateAngle(e, true);
            });

            window.addEventListener('mouseup', function () {
                if (!that.pressButton) {
                    return;
                }
                var id = setInterval(function () {
                    if (!that.animatedInProgress) {
                        that.pressButton = false;
                        Player.context.currentTime = that.angle / (2 * Math.PI) * Player.source.buffer.duration;
                        clearInterval(id);
                    }
                }, 100);
            });

            window.addEventListener('mousemove', function (e) {
                if (that.animatedInProgress) {
                    return;
                }
                if (that.pressButton && that.scene.inProcess()) {
                    that.calculateAngle(e);
                }
            });
        },

        isInsideOfSmallCircle: function (e) {
            var x = Math.abs(e.pageX - this.scene.cx - this.scene.coord.left);
            var y = Math.abs(e.pageY - this.scene.cy - this.scene.coord.top);
            return Math.sqrt(x * x + y * y) < this.scene.radius - 3 * this.innerDelta;
        },

        isOusideOfBigCircle: function (e) {
            return Math.abs(e.pageX - this.scene.cx - this.scene.coord.left) > this.scene.radius ||
                    Math.abs(e.pageY - this.scene.cy - this.scene.coord.top) > this.scene.radius;
        },

        draw: function () {
            if (!Player.source.buffer) {
                return;
            }
            if (!this.pressButton) {
                this.angle = Player.context.currentTime / Player.source.buffer.duration * 2 * Math.PI || 0;
            }
            this.drawArc();
        },

        drawArc: function () {
            this.context.save();
            this.context.strokeStyle = 'rgba(254, 67, 101, 0.8)';
            this.context.beginPath();
            this.context.lineWidth = this.lineWidth;

            this.r = this.scene.radius - (this.innerDelta + this.lineWidth / 2);
            this.context.arc(
                    this.scene.radius + this.scene.padding,
                    this.scene.radius + this.scene.padding,
                    this.r, 0, this.angle, false
            );
            this.context.stroke();
            this.context.restore();
        },

        calculateAngle: function (e, animatedInProgress) {
            this.animatedInProgress = animatedInProgress;
            this.mx = e.pageX;
            this.my = e.pageY;
            this.angle = Math.atan((this.my - this.scene.cy - this.scene.coord.top) / (this.mx - this.scene.cx - this.scene.coord.left));
            if (this.mx < this.scene.cx + this.scene.coord.left) {
                this.angle = Math.PI + this.angle;
            }
            if (this.angle < 0) {
                this.angle += 2 * Math.PI;
            }
            if (animatedInProgress) {
                this.startAnimation();
            } else {
                this.prevAngle = this.angle;
            }
        },

        startAnimation: function () {
            var that = this;
            var angle = this.angle;
            var l = Math.abs(this.angle) - Math.abs(this.prevAngle);
            var step = l / this.animationCount, i = 0;
            var f = function () {
                that.angle += step;
                if (++i == that.animationCount) {
                    that.angle = angle;
                    that.prevAngle = angle;
                    that.animatedInProgress = false;
                } else {
                    that.animateId = setTimeout(f, 20);
                }
            };

            this.angle = this.prevAngle;
            this.animateId = setTimeout(f, 20);
        },

        stopAnimation: function () {
            clearTimeout(this.animateId);
            this.animatedInProgress = false;
        }
    };
    'use strict';

    var Scene = {

        padding: 120,

        minSize: 740,

        optimiseHeight: 982,

        _inProcess: false,

        init: function () {
            this.canvasConfigure();
            this.initHandlers();

            Framer.init(this);
            Tracker.init(this);
            Controls.init(this);

            this.startRender();
        },

        canvasConfigure: function () {
            this.canvas = document.querySelector('canvas');
            this.context = this.canvas.getContext('2d');
            this.context.strokeStyle = '#FE4365';
            this.calculateSize();
        },

        calculateSize: function () {
            this.scaleCoef = Math.max(0.5, 740 / this.optimiseHeight);

            var size = Math.max(this.minSize, 1/*document.body.clientHeight */);
            this.canvas.setAttribute('width', size);
            this.canvas.setAttribute('height', size);
            //this.canvas.style.marginTop = -size / 2 + 'px';
            //this.canvas.style.marginLeft = -size / 2 + 'px';

            this.width = size;
            this.height = size;

            this.radius = (size - this.padding * 2) / 2;
            this.cx = this.radius + this.padding;
            this.cy = this.radius + this.padding;
            this.coord = this.canvas.getBoundingClientRect();
        },

        initHandlers: function () {
            var that = this;
            window.onresize = function () {
                that.canvasConfigure();
                Framer.configure();
                that.render();
            };
        },

        render: function () {
            var that = this;
            requestAnimationFrame(function () {
                that.clear();
                that.draw();
                if (that._inProcess) {
                    that.render();
                }
            });
        },

        clear: function () {
            this.context.clearRect(0, 0, this.width, this.height);
        },

        draw: function () {
            Framer.draw();
            Tracker.draw();
            Controls.draw();
        },

        startRender: function () {
            this._inProcess = true;
            this.render();
        },

        stopRender: function () {
            this._inProcess = false;
        },

        inProcess: function () {
            return this._inProcess;
        }
    };
    'use strict';

    var Controls = {

        playing: false,

        init: function (scene) {
            this.scene = scene;
            this.context = scene.context;
            this.initHandlers();
            this.timeControl = document.querySelector('.time');
        },

        initHandlers: function () {
            this.initPlayButton();
            this.initPauseButton();
            this.initSoundButton();
            this.initPrevSongButton();
            this.initNextSongButton();
            this.initTimeHandler();
        },

        initPlayButton: function () {
            var that = this;
            this.playButton = document.querySelector('.play');
            this.playButton.addEventListener('mouseup', function () {
                that.playButton.style.display = 'none';
                that.pauseButton.style.display = 'inline-block';
                Player.play();
                that.playing = true;
            });
        },

        initPauseButton: function () {
            var that = this;
            this.pauseButton = document.querySelector('.pause');
            this.pauseButton.addEventListener('mouseup', function () {
                that.playButton.style.display = 'inline-block';
                that.pauseButton.style.display = 'none';
                Player.pause();
                that.playing = false;
            });
        },

        initSoundButton: function () {
            var that = this;
            this.soundButton = document.querySelector('.soundControl');
            this.soundButton.addEventListener('mouseup', function () {
                if (that.soundButton.classList.contains('disable')) {
                    that.soundButton.classList.remove('disable');
                    Player.unmute();
                } else {
                    that.soundButton.classList.add('disable');
                    Player.mute();
                }
            });
        },

        initPrevSongButton: function () {
            var that = this;
            this.prevSongButton = document.querySelector('.prevSong');
            this.prevSongButton.addEventListener('mouseup', function () {
                Player.prevTrack();
                that.playing && Player.play();
            });
        },

        initNextSongButton: function () {
            var that = this;
            this.nextSongButton = document.querySelector('.nextSong');
            this.nextSongButton.addEventListener('mouseup', function () {
                Player.nextTrack();
                that.playing && Player.play();
            });
        },

        initTimeHandler: function () {
            var that = this;
            setTimeout(function () {
                var rawTime = parseInt(Player.context.currentTime || 0);
                var secondsInMin = 60;
                var min = parseInt(rawTime / secondsInMin);
                var seconds = rawTime - min * secondsInMin;
                if (min < 10) {
                    min = '0' + min;
                }
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                var time = min + ':' + seconds;
                that.timeControl.textContent = time;
                that.initTimeHandler();
            }, 300);
        },

        draw: function () {
            this.drawPic();
        },

        drawPic: function () {
            this.context.save();
            this.context.beginPath();
            this.context.fillStyle = 'rgba(254, 67, 101, 0.85)';
            this.context.lineWidth = 1;
            var x = Tracker.r / Math.sqrt(Math.pow(Math.tan(Tracker.angle), 2) + 1);
            var y = Math.sqrt(Tracker.r * Tracker.r - x * x);
            if (this.getQuadrant() == 2) {
                x = -x;
            }
            if (this.getQuadrant() == 3) {
                x = -x;
                y = -y;
            }
            if (this.getQuadrant() == 4) {
                y = -y;
            }
            this.context.arc(this.scene.radius + this.scene.padding + x, this.scene.radius + this.scene.padding + y, 10, 0, Math.PI * 2, false);
            this.context.fill();
            this.context.restore();
        },

        getQuadrant: function () {
            if (0 <= Tracker.angle && Tracker.angle < Math.PI / 2) {
                return 1;
            }
            if (Math.PI / 2 <= Tracker.angle && Tracker.angle < Math.PI) {
                return 2;
            }
            if (Math.PI < Tracker.angle && Tracker.angle < Math.PI * 3 / 2) {
                return 3;
            }
            if (Math.PI * 3 / 2 <= Tracker.angle && Tracker.angle <= Math.PI * 2) {
                return 4;
            }
        }
    };
    'use strict';

    var Player = {

        buffer: null,

        duration: 0,

        tracks: [
            {
                artist: "Kavinsky",
                song: "Odd Look ft. The Weeknd",
                url: "https://soundcloud.com/glnymwxutvov/sets/gongmyeong?si=b6f6eba4e9134f0880f0d1daeee122c5&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
            }
        ],

        init: function () {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.context.suspend && this.context.suspend();
            this.firstLaunch = true;
            try {
                this.javascriptNode = this.context.createScriptProcessor(2048, 1, 1);
                this.javascriptNode.connect(this.context.destination);
                this.analyser = this.context.createAnalyser();
                this.analyser.connect(this.javascriptNode);
                this.analyser.smoothingTimeConstant = 0.6;
                this.analyser.fftSize = 2048;
                this.source = this.context.createBufferSource();
                this.destination = this.context.destination;
                this.loadTrack(0);

                this.gainNode = this.context.createGain();
                this.source.connect(this.gainNode);
                this.gainNode.connect(this.analyser);
                this.gainNode.connect(this.destination);

                this.initHandlers();
            } catch (e) {
                Framer.setLoadingPercent(1);
            }
            Framer.setLoadingPercent(1);
            Scene.init();
        },

        loadTrack: function (index) {
            var that = this;
            var request = new XMLHttpRequest();
            var track = this.tracks[index];
            document.querySelector('.song .artist').textContent = track.artist;
            document.querySelector('.song .name').textContent = track.song;
            this.currentSongIndex = index;

            request.open('GET', track.url, true);
            request.responseType = 'arraybuffer';

            request.onload = function() {
                that.context.decodeAudioData(request.response, function(buffer) {
                    that.source.buffer = buffer;
                });
            };

            request.send();
        },

        nextTrack: function () {
            return;
            ++this.currentSongIndex;
            if (this.currentSongIndex == this.tracks.length) {
                this.currentSongIndex = 0;
            }

            this.loadTrack(this.currentSongIndex);
        },

        prevTrack: function () {
            return;
            --this.currentSongIndex;
            if (this.currentSongIndex == -1) {
                this.currentSongIndex = this.tracks.length - 1;
            }

            this.loadTrack(this.currentSongIndex);
        },

        play: function () {
            this.context.resume && this.context.resume();
            if (this.firstLaunch) {
                this.source.start();
                this.firstLaunch = false;
            }
        },

        stop: function () {
            this.context.currentTime = 0;
            this.context.suspend();
        },

        pause: function () {
            this.context.suspend();
        },

        mute: function () {
            this.gainNode.gain.value = 0;
        },

        unmute: function () {
            this.gainNode.gain.value = 1;
        },

        initHandlers: function () {
            var that = this;

            this.javascriptNode.onaudioprocess = function() {
                Framer.frequencyData = new Uint8Array(that.analyser.frequencyBinCount);
                that.analyser.getByteFrequencyData(Framer.frequencyData);
            };
        }
    };
    Player.init();

class Slider {
  constructor() {
    this.bindAll();

    this.vert = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

    this.frag = `
    varying vec2 vUv;

    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform sampler2D disp;

    uniform float dispPower;
    uniform float intensity;

    uniform vec2 size;
    uniform vec2 res;

    vec2 backgroundCoverUv( vec2 screenSize, vec2 imageSize, vec2 uv ) {
      float screenRatio = screenSize.x / screenSize.y;
      float imageRatio = imageSize.x / imageSize.y;
      vec2 newSize = screenRatio < imageRatio 
          ? vec2(imageSize.x * (screenSize.y / imageSize.y), screenSize.y)
          : vec2(screenSize.x, imageSize.y * (screenSize.x / imageSize.x));
      vec2 newOffset = (screenRatio < imageRatio 
          ? vec2((newSize.x - screenSize.x) / 2.0, 0.0) 
          : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;
      return uv * screenSize / newSize + newOffset;
    }

    void main() {
      vec2 uv = vUv;
      
      vec4 disp = texture2D(disp, uv);
      vec2 dispVec = vec2(disp.x, disp.y);
      
      vec2 distPos1 = uv + (dispVec * intensity * dispPower);
      vec2 distPos2 = uv + (dispVec * -(intensity * (1.0 - dispPower)));
      
      vec4 _texture1 = texture2D(texture1, distPos1);
      vec4 _texture2 = texture2D(texture2, distPos2);
      
      gl_FragColor = mix(_texture1, _texture2, dispPower);
    }
    `;

    this.el = document.querySelector('.js-slider');
    this.inner = this.el.querySelector('.js-slider__inner');
    this.slides = [...this.el.querySelectorAll('.js-slide')];
    this.bullets = [...this.el.querySelectorAll('.js-slider-bullet')];

    this.renderer = null;
    this.scene = null;
    this.clock = null;
    this.camera = null;

    this.images = [
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/bg1.jpg',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/bg2.jpg',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/bg3.jpg'];


    this.data = {
      current: 0,
      next: 1,
      total: this.images.length - 1,
      delta: 0 };


    this.state = {
      animating: false,
      text: false,
      initial: true };


    this.textures = null;

    this.init();
  }

  bindAll() {
    ['render', 'nextSlide'].
    forEach(fn => this[fn] = this[fn].bind(this));
  }

  setStyles() {
    this.slides.forEach((slide, index) => {
      if (index === 0) return;

      TweenMax.set(slide, { autoAlpha: 0 });
    });

    this.bullets.forEach((bullet, index) => {
      if (index === 0) return;

      const txt = bullet.querySelector('.js-slider-bullet__text');
      const line = bullet.querySelector('.js-slider-bullet__line');

      TweenMax.set(txt, {
        alpha: 0.25 });

      TweenMax.set(line, {
        scaleX: 0,
        transformOrigin: 'left' });

    });
  }

  cameraSetup() {
    this.camera = new THREE.OrthographicCamera(
    this.el.offsetWidth / -2,
    this.el.offsetWidth / 2,
    this.el.offsetHeight / 2,
    this.el.offsetHeight / -2,
    1,
    1000);


    this.camera.lookAt(this.scene.position);
    this.camera.position.z = 1;
  }

  setup() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock(true);

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);

    this.inner.appendChild(this.renderer.domElement);
  }

  loadTextures() {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '';

    this.textures = [];
    this.images.forEach((image, index) => {
      const texture = loader.load(image + '?v=' + Date.now(), this.render);

      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      if (index === 0 && this.mat) {
        this.mat.uniforms.size.value = [
        texture.image.naturalWidth,
        texture.image.naturalHeight];

      }

      this.textures.push(texture);
    });

    this.disp = loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/rock-_disp.png', this.render);
    this.disp.magFilter = this.disp.minFilter = THREE.LinearFilter;
    this.disp.wrapS = this.disp.wrapT = THREE.RepeatWrapping;
  }

  createMesh() {
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        dispPower: { type: 'f', value: 0.0 },
        intensity: { type: 'f', value: 0.5 },
        res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        size: { value: new THREE.Vector2(1, 1) },
        texture1: { type: 't', value: this.textures[0] },
        texture2: { type: 't', value: this.textures[1] },
        disp: { type: 't', value: this.disp } },

      transparent: true,
      vertexShader: this.vert,
      fragmentShader: this.frag });


    const geometry = new THREE.PlaneBufferGeometry(
    this.el.offsetWidth,
    this.el.offsetHeight,
    1);


    const mesh = new THREE.Mesh(geometry, this.mat);

    this.scene.add(mesh);
  }

  transitionNext() {
    TweenMax.to(this.mat.uniforms.dispPower, 2.5, {
      value: 1,
      ease: Expo.easeInOut,
      onUpdate: this.render,
      onComplete: () => {
        this.mat.uniforms.dispPower.value = 0.0;
        this.changeTexture();
        this.render.bind(this);
        this.state.animating = false;
      } });


    const current = this.slides[this.data.current];
    const next = this.slides[this.data.next];

    const currentImages = current.querySelectorAll('.js-slide__img');
    const nextImages = next.querySelectorAll('.js-slide__img');

    const currentText = current.querySelectorAll('.js-slider__text-line div');
    const nextText = next.querySelectorAll('.js-slider__text-line div');

    const currentBullet = this.bullets[this.data.current];
    const nextBullet = this.bullets[this.data.next];

    const currentBulletTxt = currentBullet.querySelectorAll('.js-slider-bullet__text');
    const nextBulletTxt = nextBullet.querySelectorAll('.js-slider-bullet__text');

    const currentBulletLine = currentBullet.querySelectorAll('.js-slider-bullet__line');
    const nextBulletLine = nextBullet.querySelectorAll('.js-slider-bullet__line');

    const tl = new TimelineMax({ paused: true });

    if (this.state.initial) {
      TweenMax.to('.js-scroll', 1.5, {
        yPercent: 100,
        alpha: 0,
        ease: Power4.easeInOut });


      this.state.initial = false;
    }

    tl.
    staggerFromTo(currentImages, 1.5, {
      yPercent: 0,
      scale: 1 },
    {
      yPercent: -185,
      scaleY: 1.5,
      ease: Expo.easeInOut },
    0.075).
    to(currentBulletTxt, 1.5, {
      alpha: 0.25,
      ease: Linear.easeNone },
    0).
    set(currentBulletLine, {
      transformOrigin: 'right' },
    0).
    to(currentBulletLine, 1.5, {
      scaleX: 0,
      ease: Expo.easeInOut },
    0);

    if (currentText) {
      tl.
      fromTo(currentText, 2, {
        yPercent: 0 },
      {
        yPercent: -100,
        ease: Power4.easeInOut },
      0);
    }

    tl.
    set(current, {
      autoAlpha: 0 }).

    set(next, {
      autoAlpha: 1 },
    1);

    if (nextText) {
      tl.
      fromTo(nextText, 2, {
        yPercent: 100 },
      {
        yPercent: 0,
        ease: Power4.easeOut },
      1.5);
    }

    tl.
    staggerFromTo(nextImages, 1.5, {
      yPercent: 150,
      scaleY: 1.5 },
    {
      yPercent: 0,
      scaleY: 1,
      ease: Expo.easeInOut },
    0.075, 1).
    to(nextBulletTxt, 1.5, {
      alpha: 1,
      ease: Linear.easeNone },
    1).
    set(nextBulletLine, {
      transformOrigin: 'left' },
    1).
    to(nextBulletLine, 1.5, {
      scaleX: 1,
      ease: Expo.easeInOut },
    1);

    tl.play();
  }

  prevSlide() {

  }

  nextSlide() {
    if (this.state.animating) return;

    this.state.animating = true;

    this.transitionNext();

    this.data.current = this.data.current === this.data.total ? 0 : this.data.current + 1;
    this.data.next = this.data.current === this.data.total ? 0 : this.data.current + 1;
  }

  changeTexture() {
    this.mat.uniforms.texture1.value = this.textures[this.data.current];
    this.mat.uniforms.texture2.value = this.textures[this.data.next];
  }

  listeners() {
    window.addEventListener('wheel', this.nextSlide, { passive: true });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  init() {
    this.setup();
    this.cameraSetup();
    this.loadTextures();
    this.createMesh();
    this.setStyles();
    this.render();
    this.listeners();
  }}


// Toggle active link
const links = document.querySelectorAll('.js-nav a');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    links.forEach(other => other.classList.remove('is-active'));
    link.classList.add('is-active');
  });
});

// Init classes
const slider = new Slider();
