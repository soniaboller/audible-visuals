console.log('spiral loaded');

// add a modal that tells user to upload a song

var app = app || {};
app.init = init;
app.animate = animate;
// app.play = true;
app.animateParticles = animateParticles;


var xSeparation = 1.05, ySeparation = 1.05, xNum = 64, yNum = 32,
    mouseX = 0, mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;

var camera, scene, renderer;

function init() {
    console.log('init');
    scene = new THREE.Scene();
    var width = window.innerWidth;
    var height = window.innerHeight;

    var fov = 20;
    // var fov = 60;

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(fov, width / height, 1, 10000);
    camera.position.set(0, 0, 175);
    // camera.position.set(0, 0, 75);

    renderer.setClearColor(0x000000, 1);
    // CHANGE THIS into a function with an event lisenter instead
    window.addEventListener('resize', function () {
        width = window.innerWidth;
        height = window.innerHeight;
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    var PI2 = Math.PI * 2;
    particles = new Array();

    // move this into the particle generating loop for color changing, but prevents bottom tiles from being accessed for rotation

    // for (var i = 0; i <= 2048; i++) {
    //     var material = new THREE.SpriteCanvasMaterial({
    //         color: 0xffffff,
    //         program: function (context) {
    //
    //             context.beginPath();
    //             context.arc(0, 0, 0.25, 0, PI2, true);
    //             context.fill();
    //
    //         }
    //     });
    //     var particle = particles[i++] = new THREE.Particle(material);
    //     particle.position.x = Math.sin(i) * (i / 75);
    //     particle.position.y = Math.cos(i) * (i / 75);
    //     scene.add(particle);
    // }

    for (var i = 0; i <=2048; i++) {
        var a = 1;
        var b = 1;
        var material = new THREE.SpriteCanvasMaterial({
            color: 0xffffff,
            program: function (context) {

                context.beginPath();
                context.arc(0, 0, 0.25, 0, PI2, true);
                context.fill();

            }
        });
        // var angle = 0.03;
        var particle = particles[i++] = new THREE.Particle(material);
        // particle.position.x = (a + b * (angle * i)) * Math.cos((angle * i));
        // particle.position.y = (a + b * (angle * i)) * Math.sin((angle * i));
        scene.add(particle);

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
        }
        return false;
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

    // document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('keydown', onKeyDown, false);
}

var GuiControls = function(){
    this.intensity = 0.25;
    // this.toggleColor = false;
    // this.emphasis = {Red: true, Green: true, Blue: true};
    this.toggleRed = true;
    this.toggleGreen = false;
    this.toggleBlue = false;
    this.fov = 35;
    this.R = 0.7;
    this.G = 0;
    this.B = 0.7;
    this.radius = 50;
    this.a = 0.15;
    this.b = 0.2;
    this.angle = 0.11;
    this.circle = false;
    this.spiral = true;
};

var spiral = new GuiControls();

var gui = new dat.GUI();
console.log(gui);
gui.closed = true;
gui.add(spiral, 'spiral').name('Spiral').listen().onChange(function(){
    spiral.circle = false;
    spiral.spiral = true;
    spiralFolder.open();
    circleFolder.close();

});
gui.add(spiral, 'circle').name('Circle').listen().onChange(function(){
    spiral.circle = true;
    spiral.spiral = false;
    spiralFolder.close();
    circleFolder.open();
});
gui.add(spiral, 'intensity', 0.05, 1).name('Intensity');
gui.add(spiral, 'fov', 1, 150).name('Zoom Distance');
var spiralFolder = gui.addFolder('Spiral Controls');
spiralFolder.add(spiral,'a', 0, 50).step(0.01).name('Inner Radius');
spiralFolder.add(spiral,'b', 0, 5).step(0.01).name('Outer Radius');
spiralFolder.add(spiral,'angle', 0.001, 0.5).step(0.001).name('Angle');
spiralFolder.open();

var circleFolder = gui.addFolder('Cricle Controls');
circleFolder.add(spiral, 'radius', 10, 100).name('Radius');
// gui.add(spiral,'a', 0, 50).step(0.01).name('Spiral Inner Radius');
// gui.add(spiral,'b', 0, 5).step(0.01).name('Spiral Diameter');
// gui.add(spiral,'angle', 0.001, 0.5).step(0.001).name('Spiral Angle');
// gui.add(spiral, 'toggleColor').name('Toggle Colors');
// gui.add(spiral, 'emphasis', {Red: true, Green: true, Blue: true});
gui.add(spiral, 'toggleRed').name('Red Emphasis').listen().onChange(function(){
    spiral.toggleRed = true;
    spiral.toggleGreen = false;
    spiral.toggleBlue = false;
});

gui.add(spiral, 'toggleGreen').name('Green Emphasis').listen().onChange(function(){
    spiral.toggleRed = false;
    spiral.toggleGreen = true;
    spiral.toggleBlue = false;
});

gui.add(spiral, 'toggleBlue').name('Blue Emphasis').listen().onChange(function(){
    spiral.toggleRed = false;
    spiral.toggleGreen = false;
    spiral.toggleBlue = true;
});

var folder = gui.addFolder('Colors');
folder.add(spiral, 'R', 0, 1).name('Red').step(0.01);
folder.add(spiral, 'G', 0, 1).name('Green').step(0.01);
folder.add(spiral, 'B', 0, 1).name('Blue').step(0.01);
folder.open();

function animate() {
    requestAnimationFrame(app.animate);
    stats.begin();
    animateParticles();
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
    stats.end();
}

function animateParticles(){
    var timeFrequencyData = new Uint8Array(analyser.fftSize);
    var timeFloatData = new Float32Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeFrequencyData);
    analyser.getFloatTimeDomainData(timeFloatData);
    for (var j = 0; j <= particles.length; j++){
        particle = particles[j++];
        if (spiral.toggleRed){
            var R = spiral.R + (timeFloatData[j]);
            var G = spiral.G - (timeFloatData[j]);
            var B = spiral.B - (timeFloatData[j]);
            particle.material.color.setRGB(R, G, B);
        }
        else if (spiral.toggleGreen){
            var R = spiral.R - (timeFloatData[j]);
            var G = spiral.G + (timeFloatData[j]);
            var B = spiral.B - (timeFloatData[j]);
            particle.material.color.setRGB(R, G, B);
        }
        else if (spiral.toggleBlue){
            var R = spiral.R - (timeFloatData[j]);
            var G = spiral.G - (timeFloatData[j]);
            var B = spiral.B + (timeFloatData[j]);
            particle.material.color.setRGB(R, G, B);
        }
        else {
            particle.material.color.setHex(0xffffff);
        }
        // if (!app.play){
        //     particle.material.color.setHex(0x000000);
        // }
        if (spiral.circle){
            particle.position.x = Math.sin(j) * (j / (j/spiral.radius));
            particle.position.y = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);
            particle.position.z = Math.cos(j) * (j / (j/spiral.radius));
            camera.fov = 35;
            camera.position.y = 100;
        }
        else if (spiral.spiral){
            // counter clockwise if x = cos and y = sin, clockwise if x = sin and y = cos
            particle.position.x = (spiral.a + spiral.b * (spiral.angle * j)) * Math.sin((spiral.angle * j));
            particle.position.y = (spiral.a + spiral.b * (spiral.angle * j)) * Math.cos((spiral.angle * j));
            particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);
            camera.position.y = 0;
        }
        else {
            particle.position.x = Math.sin(j) * (j / spiral.radius);
            particle.position.y = Math.cos(j) * (j / spiral.radius);
            particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);
            camera.position.y = 0;
        }

    }
    camera.fov = spiral.fov;
    camera.updateProjectionMatrix();
}