

var width = window.innerWidth,
    height = window.innerHeight,

    mouseX = 0, mouseY = 0,

    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,


    camera, scene, renderer;

init();

function init() {

    var container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera( 75, width / height, 1, 20000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();

    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    container.appendChild( renderer.domElement );

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.enableKeys = false;
    console.log('controls');
    console.log(controls);


    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    console.log('audioCtx');
    console.log(ctx);

    var audio = document.querySelector('audio');
    console.log('audio');
    console.log(audio);

    var audioSrc = ctx.createMediaElementSource(audio);
    console.log(audioSrc);

    var analyser = ctx.createAnalyser();
    // analyser.smoothingTimeConstant = 1;
    console.log('analyser');
    console.log(analyser);

    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);


    // lines
    lines = new Array();
    for (var j = 0; j <= 1024; j++) {

        var geometry = new THREE.Geometry();

        var vertex = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
        vertex.normalize();
        vertex.multiplyScalar( 150 );

        geometry.vertices.push( vertex );

        var vertex2 = vertex.clone();
        vertex2.multiplyScalar(1);
        // vertex2.multiplyScalar( Math.random() * 0.3 + 1 );

        geometry.vertices.push( vertex2 );

        var line = lines[ j ++ ] = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: Math.random() } ) );
        scene.add( line );
    }

    var play = false;
    function onKeyDown(e) {
        switch (e.which) {
            case 32:
                if (play) {
                    audio.pause();
                    play = false;
                } else {
                    audio.play();
                    play = true;
                }
                break;
        }
        return false;
    }

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    window.addEventListener("keydown", onKeyDown, false);
    //
    window.addEventListener( 'resize', onWindowResize, false );


    var uintFrequencyData = new Uint8Array(analyser.frequencyBinCount);
    var timeFrequencyData = new Uint8Array(analyser.fftSize);
    var floatFrequencyData = new Float32Array(analyser.frequencyBinCount);


    function animate() {

        requestAnimationFrame( animate );

        analyser.getByteFrequencyData(uintFrequencyData);
        analyser.getByteTimeDomainData(timeFrequencyData);
        analyser.getFloatFrequencyData(floatFrequencyData);

        for ( var j = 0; j <= 1024; j ++ ){
            line = lines[j++];
            var intensity = 5;
            line.geometry.vertices[1].z = (uintFrequencyData[j] * intensity + 50);
            if (line.geometry.vertices[1].z > (60 * intensity) && line.geometry.vertices[1].z < (100 * intensity)){
                line.material.color.r = 0;
                line.material.color.b = 0;
            }
            else if (line.geometry.vertices[1].z >= (100 * intensity)){
                line.material.color.r = 1;
                line.material.color.g = 0;
            }
            else {
                line.material.color.r = 1;
                line.material.color.g = 1;
                line.material.color.b = 1;
            }
        }

        render();

    }
    animate();

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {

    if ( event.touches.length > 1 ) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;

    }
}

function onDocumentTouchMove( event ) {

    if ( event.touches.length == 1 ) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;

    }

}


function render() {

    // camera.position.x += ( mouseX - camera.position.x ) * .005;
    // camera.position.y += ( - mouseY - camera.position.y ) * .005;
    camera.lookAt( scene.position );

    renderer.render( scene, camera );
    // controls.update();

}

