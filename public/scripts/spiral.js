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
    console.log('init');
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
                context.arc(0, 0, 0.25, 0, PI2, true);
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

    // function onDocumentMouseMove(e) {
    //     mouseX = e.clientX - windowHalfX;
    //     mouseY = e.clientY - windowHalfY;
    // }

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

    // controls = new THREE.OrbitControls( camera, renderer.domElement );

}

var GuiControls = function(){
    this.intensity = 0.25;
    this.toggleRed = true;
    this.toggleGreen = false;
    this.toggleBlue = false;
    this.fov = 35;
    this.R = 0.7;
    this.G = 0;
    this.B = 0.7;
    this.radius = 50;
    this.a = 0.15;
    this.b = 0.20;
    this.angle = 11;
    this.aWavy = 1.20;
    this.bWavy = 0.66;
    this.wavyAngle = 2.44;
    this.spiral = false;
    this.wavySpiral = true;
    this.circle = false;
};

var spiral = new GuiControls();

var gui = new dat.GUI();
gui.closed = true;
gui.add(spiral, 'intensity', 0.05, 1).name('Intensity');
gui.add(spiral, 'fov', 1, 150).name('Zoom Distance');

// visualizer type checkboxes
gui.add(spiral, 'spiral').name('Spiral').listen().onChange(function(){
    spiral.circle = false;
    spiral.spiral = true;
    spiral.wavySpiral = false;
    spiralFolder.open();
    circleFolder.close();
    wavySpiralFolder.close();

});
gui.add(spiral, 'wavySpiral').name('Wavy Spiral').listen().onChange(function(){
    spiral.circle = false;
    spiral.spiral = false;
    spiral.wavySpiral = true;
    spiralFolder.close();
    circleFolder.close();
    wavySpiralFolder.open();
});
gui.add(spiral, 'circle').name('Circle').listen().onChange(function(){
    spiral.circle = true;
    spiral.spiral = false;
    spiral.wavySpiral = false;
    spiralFolder.close();
    circleFolder.open();
    wavySpiralFolder.close();
});

// selected visualizer controls folder
var spiralFolder = gui.addFolder('Spiral Controls');
spiralFolder.add(spiral,'a', 0, 50).step(0.01).name('Inner Radius');
spiralFolder.add(spiral,'b', 0, 5).step(0.01).name('Outer Radius');
spiralFolder.add(spiral,'angle', 0, 50).step(.01).name('Angle');
// spiralFolder.open();

var wavySpiralFolder = gui.addFolder('Wavy Spiral Controls');
wavySpiralFolder.add(spiral,'aWavy', 0, 50).step(0.01).name('Inner Radius');
wavySpiralFolder.add(spiral,'bWavy', 0, 3).step(0.01).name('Outer Radius');
wavySpiralFolder.add(spiral,'wavyAngle', 1, 4).step(0.01).name('Angle');
wavySpiralFolder.open();

var circleFolder = gui.addFolder('Cricle Controls');
circleFolder.add(spiral, 'radius', 10, 100).name('Radius');

// color emphasis checkbox
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

// color controls
var colorFolder = gui.addFolder('Colors');
colorFolder.add(spiral, 'R', 0, 1).name('Red').step(0.01);
colorFolder.add(spiral, 'G', 0, 1).name('Green').step(0.01);
colorFolder.add(spiral, 'B', 0, 1).name('Blue').step(0.01);
colorFolder.open();


console.log(spiral, 'this is the spiral')


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
            particle.position.x = (spiral.a + spiral.b * ((spiral.angle / 100) * j ))
                                * Math.sin( ((spiral.angle / 100) * j) );
            particle.position.y = (spiral.a + spiral.b * ((spiral.angle / 100) * j ))
                                * Math.cos( ((spiral.angle / 100) * j) );
            particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);
            // counter clockwise if x = cos and y = sin, clockwise if x = sin and y = cos
            camera.position.y = 0;
        }
        else if(spiral.wavySpiral){
            particle.position.x = (spiral.aWavy + spiral.bWavy * ((spiral.wavyAngle / 100) * j))
                                * Math.sin(( (spiral.wavyAngle / 100) * j))
                                + Math.sin(j / (spiral.wavyAngle / 100));
            particle.position.y = (spiral.aWavy + spiral.bWavy * ((spiral.wavyAngle / 100) * j))
                                * Math.cos(( (spiral.wavyAngle / 100) * j))
                                + Math.cos(j / (spiral.wavyAngle / 100));
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
    // controls.update();
    camera.updateProjectionMatrix();
    checkVisualizer();
}
function checkVisualizer(){
    var spiralAngle, wavyAngle, circleRadius;
    if(spiral.spiral){
        console.log('hit spiral');
        function changeAngle(){
            var spiralAngle = window.setInterval(function(){
                spiral.angle += 0.000001;
            }, 10)
        }
        changeAngle();
        clearInterval(wavyAngle);
        clearInterval(circleRadius);
    }
    else if (spiral.wavySpiral){
        function changeWavyAngle(){
            var wavyAngle = window.setInterval(function(){
                if(spiral.wavyAngle <= 2.5){
                    spiral.wavyAngle += 0.00000003;
                }
                else{
                    console.log('direction swtich');
                    spiral.wavyAngle -= 0.00000005;
                }
            }, 10)
        }
        changeWavyAngle();
        clearInterval(spiralAngle);
        clearInterval(circleRadius);
    }
    else if (spiral.circle){
        function changeCircleRadius(){
            console.log('hit circle radius');
            var circleRadius = window.setInterval(function(){
                spiral.radius += 0.001;
            },10)
        }
        changeCircleRadius();
        clearInterval(wavyAngle);
        clearInterval(spiralAngle);
    }
}