var width = window.innerWidth,
    height = window.innerHeight,
    camera, scene, renderer;

var app = app || {};
app.init = init;
app.animate = animate;
app.play = true;

function init() {

    var container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(50, width / height, 1, 20000);
    camera.position.z = 1150;

    scene = new THREE.Scene();

    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.autoRotate = true;
    controls.enablePan = false;
    controls.enableKeys = false;

    // LINES
    lines = new Array();
    for (var j = 0; j <= 1024; j++) {

        var geometry = new THREE.Geometry();

        var vertex = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        vertex.normalize();
        vertex.multiplyScalar(125);

        geometry.vertices.push(vertex);

        var vertex2 = vertex.clone();
        vertex2.multiplyScalar(1.25);

        geometry.vertices.push(vertex2);

        var line = lines[j++] = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.65}));
        scene.add(line);

    }

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
            case 66:
                controls.reset();
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
                if (sphere.intensity < 12){
                    sphere.intensity += 0.1;
                }
                break;
            case 189:
                if (sphere.intensity > 4){
                    sphere.intensity -= 0.1;
                }
        }
        return false;
    }

    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousedown', function(){
        return false
    });
}

var GuiControls = function(){
    this.innerColor = 0xFFF000;
    this.middleColor = 0xFF0000;
    this.outerColor = 0xFF0080;
    this.intensity = 5;
    this.opacity = 0.85;
};

var sphere = new GuiControls();

var gui = new dat.GUI();
gui.closed = true;
gui.addColor(sphere, 'innerColor').name('Inner Color');
gui.addColor(sphere, 'middleColor').name('Middle Color');
gui.addColor(sphere, 'outerColor').name('Outer Color');
gui.add(sphere, 'intensity', 4, 12).name('Intensity');
gui.add(sphere, 'opacity', 0, 1).name('Opacity');

function animate() {
    app.animationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(app.animate);
    // stats.begin();
    var uintFrequencyData = new Uint8Array(analyser.frequencyBinCount);
    // var timeFrequencyData = new Uint8Array(analyser.fftSize);
    // var floatFrequencyData = new Float32Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(uintFrequencyData);
    // analyser.getByteTimeDomainData(timeFrequencyData);
    // analyser.getFloatFrequencyData(floatFrequencyData);

    for ( var j = 0; j <= 1024; j ++ ){
        line = lines[j++];
        line.geometry.vertices[1].z = (uintFrequencyData[j] * sphere.intensity + 50);
        line.geometry.vertices[0].z = -(uintFrequencyData[j]);
        if (line.geometry.vertices[1].z > (13 * sphere.intensity) && line.geometry.vertices[1].z < (90 * sphere.intensity)){
            // line.geometry.vertices[0].z = -(uintFrequencyData[j] * sphere.intensity);

            line.material.color.setHex(sphere.innerColor);
            line.material.opacity = sphere.opacity;
        }
        else if (line.geometry.vertices[1].z >= (90 * sphere.intensity) && line.geometry.vertices[1].z < (150 * sphere.intensity)){
            // line.geometry.vertices[0].z = -(uintFrequencyData[j] * sphere.intensity );
            line.material.color.setHex(sphere.middleColor);
            line.material.opacity = sphere.opacity;
        }
        else if (line.geometry.vertices[1].z >= (150 * sphere.intensity)){
            // line.geometry.vertices[0].z = -(uintFrequencyData[j] * sphere.intensity * sphere.intensity * sphere.intensity);

            line.material.color.setHex(sphere.outerColor);
            line.material.opacity = sphere.opacity;
        }
        else {
            line.material.color.r = 0;
            line.material.color.g = 0;
            line.material.color.b = 0;
            line.material.opacity = 0;
        }
    }

    render();
    // stats.end();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}
