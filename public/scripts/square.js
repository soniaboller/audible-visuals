console.log('wave loaded');

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
    console.log('init')
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

    var i = 0;
    for (var iy = 0; iy < yNum; iy++) {
        var material = new THREE.SpriteMaterial({
            color: 0xffffff
            // program: function ( context ) {
            //
            //     context.beginPath();
            //     context.arc( 0, 0, 0.25, 0, PI2, true );
            //     context.fill();
            //
            // }
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

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('keydown', onKeyDown, false);
}

function animate() {
    requestAnimationFrame(animate);
    // console.log(timeFloatData);
    // console.log(timeFrequencyData);
    animateParticles();
    camera.position.x = ( mouseX - camera.position.x ) * 0.05;
    camera.position.y = ( - mouseY - camera.position.y ) * 0.075;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

function animateParticles(){
    // requestAnimationFrame(animateParticles);
    var timeFrequencyData = new Uint8Array(analyser.fftSize);
    var timeFloatData = new Float32Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeFrequencyData);
    analyser.getFloatTimeDomainData(timeFloatData);
    for (var j = 0; j <= particles.length; j++){
        particle = particles[j++];
        particle.position.z = (timeFrequencyData[j] / 10);
        // particle.position.z = (timeFloatData[j] * 10);

        // for when material is generated outside of loop
        // particle.material.rotation += 0.00001;

        // for when material is generated within first part of loop
        particle.material.rotation += 0.0003;

        // for when material is generated within second part of loop
        // particle.material.rotation += 0.005;


        // var R = 1 - (timeFloatData[j]);
        // var G = 1 - (timeFloatData[j]);
        // var B = 1 - (timeFloatData[j]);
        // particle.material.color.setRGB(R, G, B);


        // particle.position.x = particle.position.x - (mouseX * 0.00005);
        // particle.position.y = particle.position.y + (mouseY * 0.00005);


    }
}