// console.log('square loaded');

var app = app || {};
app.init = init;
app.animate = animate;
app.play = true;
app.animateParticles = animateParticles;

var xSeparation = 1.05, ySeparation = 1.05, xNum = 45, yNum = 45,
    mouseX = 0, mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;

var camera, scene, renderer;

function init() {
    scene = new THREE.Scene();
    var width = window.innerWidth;
    var height = window.innerHeight;

    var fov = 25;
    // var fov = 60;

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(fov, width / height, 1, 10000);
    camera.position.set(0, 0, 175);
    // camera.position.set(0, 0, 75);

    renderer.setClearColor(0x000000, 1);

    var PI2 = Math.PI * 2;
    particles = new Array();

    // generates squares in a grid, left to right and top to bottom
    var i = 0;
    for (var iy = 0; iy < yNum; iy++) {
        var material = new THREE.SpriteMaterial({
            color: 0xffffff
        });
        for (var ix = 0; ix < xNum; ix++) {
            var particle = particles[i++] = new THREE.Particle(material);
            particle.position.x = ix * xSeparation - (( xNum * xSeparation ) / 2);
            particle.position.y = iy * ySeparation - (( yNum * ySeparation ) / 2);
            scene.add(particle);
        }
    }

    var black = true;

    function onKeyDown(e) {
        switch (e.which) {
            case 32:
                if (app.play) {
                    app.audio.pause();
                    // source.start();
                    app.play = false;
                } else {
                    app.audio.play();
                    // source.stop();
                    app.play = true;
                }
                break;
            case 84:
                if (black) {
                    renderer.setClearColor(0xffffff, 1);
                    for (var i = 0; i <= particles.length; i++) {
                        particle = particles[i++];
                        particle.material.color.setHex(0x000000);
                    }
                    black = false
                }
                else {
                    renderer.setClearColor(0x000000, 1);
                    for (var i = 0; i <= particles.length; i++) {
                        particle = particles[i++];
                        particle.material.color.setHex(0xffffff);
                    }
                    black = true
                }
                break;
            case 67:
                if (gui.closed){
                    gui.closed = false;
                }
                else {
                    gui.closed = true;
                }
                break;
            case 187:
                if (square.intensity < 15){
                    square.intensity += 0.1;
                }
                break;
            case 189:
                if(square.intensity > 5){
                    square.intensity -= 0.1;
                }
        }
        return false;
    }

    function windowResize (){
        width = window.innerWidth;
        height = window.innerHeight;
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    function onDocumentMouseMove(e) {
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }

    function onDocumentTouchStart(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }

    function onDocumentTouchMove(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }

    window.addEventListener('resize', windowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('keydown', onKeyDown, false);
}

var GuiControls = function(){
    this.rotation = 0.0005;
    this.intensity = 10;
    this.toggleColor = false;
    this.R = 1;
    this.B = 1;
    this.G = 1;
};

var square = new GuiControls();

var gui = new dat.GUI();
gui.closed = true;
gui.add(square, 'rotation', -0.005, 0.005).name('Rotation');
gui.add(square, 'intensity', 5, 15);
gui.add(square, 'toggleColor').name('Toggle Color');

var folder = gui.addFolder('Colors');
folder.add(square, 'R', 0, 1).name('R');
folder.add(square, 'G', 0, 1).name('G');
folder.add(square, 'B', 0, 1).name('B');
folder.open();

function animate() {
    app.animationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(app.animate);
    // stats.begin();
    animateParticles();
    camera.position.x = ( mouseX - camera.position.x ) * 0.05;
    camera.position.y = ( - mouseY - camera.position.y ) * 0.075;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
    // stats.end();
}

function animateParticles(){
    var timeFrequencyData = new Uint8Array(analyser.fftSize);
    var timeFloatData = new Float32Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeFrequencyData);
    analyser.getFloatTimeDomainData(timeFloatData);
    for (var j = 0; j <= particles.length; j++){
        particle = particles[j++];
        particle.position.z = (timeFrequencyData[j] / square.intensity);
        // particle.position.z = (timeFloatData[j] * 10);
        particle.material.rotation += square.rotation;
        if (square.toggleColor) {
            var R = square.R - (timeFloatData[j]);
            var G = square.G - (timeFloatData[j]);
            var B = square.B - (timeFloatData[j]);
            particle.material.color.setRGB(R, G, B);
        }
        else {
            particle.material.color.setHex(0xffffff);
        }
    }
}