// console.log('spiral loaded');

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

    function windowResize (){
        width = window.innerWidth;
        height = window.innerHeight;
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
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
                spiral.flower = false;
                break;
            case 50:
                spiral.spiral = false;
                spiral.wavySpiral = true;
                spiral.circle = false;
                spiral.flower = false;
                break;
            case 51:
                spiral.spiral = false;
                spiral.wavySpiral = false;
                spiral.circle = false;
                spiral.flower = true;
                break;
            case 52:
                spiral.spiral = false;
                spiral.wavySpiral = false;
                spiral.circle = true;
                spiral.flower = false;
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
                if (spiral.intensity < 1){
                    spiral.intensity += 0.01;
                }
                break;
            case 189:
                if (spiral.intensity > 0.05){
                    spiral.intensity -= 0.01;
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

    window.addEventListener('resize', windowResize, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('keydown', onKeyDown, false);

    // controls = new THREE.OrbitControls( camera, renderer.domElement );

}

// GUI control panel
var GuiControls = function(){
    this.intensity = 0.18;
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
    this.aFlower = 25;
    this.bFlower = 0;
    this.flowerAngle = 2.86;
    this.spiral = false;
    this.wavySpiral = true;
    this.flower = false;
    this.circle = false;
    this.animate = true;
};

var spiral = new GuiControls();

var gui = new dat.GUI();
gui.closed = true;
gui.add(spiral, 'animate').name('ANIMATE');
gui.add(spiral, 'intensity', 0.05, 1).name('Intensity');
gui.add(spiral, 'fov', 1, 150).name('Zoom Distance');

// visualizer type checkboxes
gui.add(spiral, 'spiral').name('Spiral').listen().onChange(function(){
    spiral.spiral = true;
    spiral.wavySpiral = false;
    spiral.flower = false;
    spiral.circle = false;
    spiralFolder.open();
    wavySpiralFolder.close();
    flowerFolder.close();
    circleFolder.close();

});
gui.add(spiral, 'wavySpiral').name('Wavy Spiral').listen().onChange(function(){
    spiral.spiral = false;
    spiral.wavySpiral = true;
    spiral.flower = false;
    spiral.circle = false;
    spiralFolder.close();
    wavySpiralFolder.open();
    flowerFolder.close();
    circleFolder.close();
});
gui.add(spiral, 'flower').name('Flower').listen().onChange(function(){
    spiral.spiral = false;
    spiral.wavySpiral = false;
    spiral.flower = true;
    spiral.circle = false;
    spiralFolder.close();
    wavySpiralFolder.close();
    flowerFolder.open();
    circleFolder.close();
});
gui.add(spiral, 'circle').name('Circle').listen().onChange(function(){
    spiral.spiral = false;
    spiral.wavySpiral = false;
    spiral.flower = false;
    spiral.circle = true;
    spiralFolder.close();
    wavySpiralFolder.close();
    flowerFolder.close();
    circleFolder.open();
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

var flowerFolder = gui.addFolder('Flower Controls');
flowerFolder.add(spiral,'aFlower', 0, 50).step(0.01).name('Inner Radius');
flowerFolder.add(spiral,'bFlower', 0, 3).step(0.01).name('Outer Radius');
flowerFolder.add(spiral,'flowerAngle', 1, 4).step(0.01).name('Angle');

var circleFolder = gui.addFolder('Circle Controls');
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
    // Fast Fourier Transform (FFT) used to determine waveform
    var timeFrequencyData = new Uint8Array(analyser.fftSize);
    var timeFloatData = new Float32Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeFrequencyData);
    analyser.getFloatTimeDomainData(timeFloatData);
    for (var j = 0; j <= particles.length; j++){
        particle = particles[j++];
        if (spiral.toggleRed){
            // forces red by adding the timeFloatData rather than subtracting
            var R = spiral.R + (timeFloatData[j]);
            var G = spiral.G - (timeFloatData[j]);
            var B = spiral.B - (timeFloatData[j]);
            particle.material.color.setRGB(R, G, B);
        }
        else if (spiral.toggleGreen){
            // forces green by adding the timeFloatData rather than subtracting
            var R = spiral.R - (timeFloatData[j]);
            var G = spiral.G + (timeFloatData[j]);
            var B = spiral.B - (timeFloatData[j]);
            particle.material.color.setRGB(R, G, B);
        }
        else if (spiral.toggleBlue){
            // forces blue by adding  the timeFloatData rather than subtracting
            var R = spiral.R - (timeFloatData[j]);
            var G = spiral.G - (timeFloatData[j]);
            var B = spiral.B + (timeFloatData[j]);
            particle.material.color.setRGB(R, G, B);
        }
        else {
            particle.material.color.setHex(0xffffff);
        }
        if (spiral.spiral){
            // Archimedean Spiral
            particle.position.x = (spiral.a + spiral.b * ((spiral.angle / 100) * j ))
                                * Math.sin( ((spiral.angle / 100) * j) );
            particle.position.y = (spiral.a + spiral.b * ((spiral.angle / 100) * j ))
                                * Math.cos( ((spiral.angle / 100) * j) );
            particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);

            camera.position.y = 0;
        }
        else if(spiral.wavySpiral){
            // Archimedean Spiral with sin and cos added respectively to position to create a wavy spiral

            // * 5 for starfish?
            particle.position.x = (spiral.aWavy + spiral.bWavy * ((spiral.wavyAngle / 100) * j))
                                * Math.sin(( (spiral.wavyAngle / 100) * j))
                                + Math.sin(j / (spiral.wavyAngle / 100));
            particle.position.y = (spiral.aWavy + spiral.bWavy * ((spiral.wavyAngle / 100) * j))
                                * Math.cos(( (spiral.wavyAngle / 100) * j))
                                + Math.cos(j / (spiral.wavyAngle / 100));
            particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);

            camera.position.y = 0;
        }
        else if(spiral.flower){
            particle.position.x = (spiral.aFlower + spiral.bFlower * ((spiral.flowerAngle / 100) * j))
                                * Math.cos(( (spiral.flowerAngle / 100) * j))
                                + Math.sin(j / (spiral.flowerAngle / 100)) * 17;
            particle.position.y = (spiral.aFlower + spiral.bFlower * ((spiral.flowerAngle / 100) * j))
                                * Math.sin(( (spiral.flowerAngle / 100) * j))
                                + Math.cos(j / (spiral.flowerAngle / 100)) * 17;
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
    // if (!app.play){
    //     particle.material.color.setHex(0x000000);
    // }
    // controls.update();
    camera.fov = spiral.fov;
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
        else if (spiral.flower){
            changeFlowerAngle();
        }
        else if (spiral.circle){
            changeCircleRadius();
        }
    }
}

app.spiralCounter = true;
app.wavySpiralCounter = true;
app.circleCounter = true;
app.flowerCounter = false;

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
function changeFlowerAngle(){
    if (app.flowerCounter){
        spiral.flowerAngle += 0.0000004;
        if (spiral.flowerAngle >= 2.87){
            app.flowerCounter = false;
        }
    }
    else {
        spiral.flowerAngle -= 0.0000004;
        if (spiral.flowerAngle <= 2.85){
            app.flowerCounter = true;
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

console.log("'1', '2', '3', and '4' toggle visualizers \n'r', 'g', 'b' toggle colors \n'a' toggles animation \n'space' toggles playback \n'c' toggles controls");
