console.log('spiral loaded');

// add a modal that tells user to upload a song

var app = app || {};
app.init = init;
app.animate = animate;
// app.play = true;
app.animateParticles = animateParticles;


var mouseX = 0, mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;

var camera, scene, renderer;

function init() {
    scene = new THREE.Scene();
    var width = window.innerWidth;
    var height = window.innerHeight;

    var fov = 20;

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(fov, width / height, 1, 10000);
    camera.position.set(0, 0, 175);

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

    for (var i = 0; i <=2048; i++) {
        var material = new THREE.SpriteCanvasMaterial({
            color: 0xffffff,
            program: function (context) {
                context.beginPath();
                context.arc(0, 0, 0.33, 0, PI2);
                context.fill();
            }
        });
        var particle = particles[i++] = new THREE.Particle(material);
        scene.add(particle);
    }


    function onKeyDown(e) {
        switch (e.which) {
            case 32:
                if (app.play) {
                    app.audio.pause();
                    app.play = false;
                } else {
                    app.audio.play();
                    app.play = true;
                }
                break;
            case 67:
                if (gui.closed){
                    gui.closed = false;
                }
                else {
                    gui.closed = true;
                }
        }
        return false;
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

    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('keydown', onKeyDown, false);

    controls = new THREE.OrbitControls( camera, renderer.domElement );

}

var GuiControls = function(){
};

var test = new GuiControls();

var gui = new dat.GUI();
gui.closed = true;

function animate() {
    app.animationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(app.animate);
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
    for (var j = 0; j < 2048; j++){
        particle = particles[j++];
        particle.position.x = timeFrequencyData[j];
        particle.position.y = timeFloatData[j];
        particle.position.z = (app.ctx.currentTime/100);
    }
    // camera.position.z = app.ctx.currentTime;
    controls.update();
    camera.updateProjectionMatrix();
}

