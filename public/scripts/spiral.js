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
                break;
            case 49:
                spiral.spiral = true;
                spiral.wavySpiral = false;
                spiral.circle = false;
                break;
            case 50:
                spiral.spiral = false;
                spiral.wavySpiral = true;
                spiral.circle = false;
                break;
            case 51:
                spiral.spiral = false;
                spiral.wavySpiral = false;
                spiral.circle = true;
                break;
            case 82:
                spiral.toggleRed = true;
                spiral.toggleGreen = false;
                spiral.toggleBlue = false;
                break;
            case 71:
                spiral.toggleRed = false;
                spiral.toggleGreen = true;
                spiral.toggleBlue = false;
                break;
            case 66:
                spiral.toggleRed = false;
                spiral.toggleGreen = false;
                spiral.toggleBlue = true;
                break;
            case 65:
                spiral.animate = !spiral.animate;
                break;
            case 187:
                spiral.intensity += 0.01;
                break;
            case 189:
                spiral.intensity -= 0.01;

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
    this.bWavy = 0.76;
    this.wavyAngle = 2.44;
    this.spiral = true;
    this.wavySpiral = false;
    this.circle = false;
    this.animate = false;
};

var spiral = new GuiControls();

var gui = new dat.GUI();
gui.closed = true;
gui.add(spiral, 'animate').name('ANIMATE');
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
spiralFolder.open();

var wavySpiralFolder = gui.addFolder('Wavy Spiral Controls');
wavySpiralFolder.add(spiral,'aWavy', 0, 50).step(0.01).name('Inner Radius');
wavySpiralFolder.add(spiral,'bWavy', 0, 3).step(0.01).name('Outer Radius');
wavySpiralFolder.add(spiral,'wavyAngle', 1, 4).step(0.01).name('Angle');
// wavySpiralFolder.open();

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


function animate() {
    app.animationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(app.animate);
    // stats.begin();
    animateParticles();
    checkVisualizer();
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
        if (spiral.spiral){
            particle.position.x = (spiral.a + spiral.b * ((spiral.angle / 100) * j ))
                                * Math.sin( ((spiral.angle / 100) * j) );
            particle.position.y = (spiral.a + spiral.b * ((spiral.angle / 100) * j ))
                                * Math.cos( ((spiral.angle / 100) * j) );
            particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);

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
        else if (spiral.circle){
            particle.position.x = Math.sin(j) * (j / (j/spiral.radius));
            particle.position.y = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);
            particle.position.z = Math.cos(j) * (j / (j/spiral.radius));
            camera.fov = 35;
            camera.position.y = 100;
        }
    }
    camera.fov = spiral.fov;
    // controls.update();
    camera.updateProjectionMatrix();
}

function checkVisualizer(){
    if(spiral.animate){
        if(spiral.spiral){
            changeAngle();
        }
        else if (spiral.wavySpiral){
            changeWavyAngle();
        }
        else if (spiral.circle){
            changeCircleRadius();
        }
    }
}

app.spiralCounter = true;
app.wavySpiralCounter = true;
app.circleCounter = true;

function changeAngle(){
        if (app.spiralCounter){
            spiral.angle += 0.0008;
            if (spiral.angle >= 13){
                app.spiralCounter = false;
            }
        }
        else {
            spiral.angle -= 0.0008;
            if(spiral.angle <= 9){
                app.spiralCounter = true;
            }
        }
}
function changeWavyAngle(){
        if (app.wavySpiralCounter){
            spiral.wavyAngle += 0.000004;
            if (spiral.wavyAngle >= 2.48){
                app.wavySpiralCounter = false;
            }
        }
        else {
            spiral.wavyAngle -= 0.000006;
            if (spiral.wavyAngle <= 2.43){
                app.wavySpiralCounter = true;
            }
        }
}
function changeCircleRadius(){
        if (app.circleCounter){
            spiral.radius += 0.05;
            if (spiral.radius >= 65){
                app.circleCounter = false;
            }
        }
        else {
            spiral.radius -= 0.05;
            if (spiral.radius <= 35){
                console.log('hit');
                app.circleCounter = true;
            }
        }
}
