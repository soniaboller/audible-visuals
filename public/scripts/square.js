console.log('wave loaded');

var app = app || {};
app.init = init;
app.play = false;

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
    window.addEventListener('resize', function () {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // var controls = new THREE.OrbitControls(camera, renderer.domElement);

    var PI2 = Math.PI * 2;
    particles = new Array();

    // move this into the loop??

    var material = new THREE.SpriteMaterial( {

        color: 0xffffff
        // program: function ( context ) {
        //
        //     context.beginPath();
        //     context.arc( 0, 0, 0.25, 0, PI2, true );
        //     context.fill();
        //
        // }

    } );

    var i = 0;
    for ( var iy = 0; iy < yNum; iy++ ) {
        for ( var ix = 0; ix < xNum; ix++ ) {
            var particle = particles[i++] = new THREE.Particle( material );
            particle.position.x = ix * xSeparation - ( ( xNum * xSeparation ) / 2 );
            particle.position.y = iy * ySeparation - ( ( yNum * ySeparation ) / 2 );
            scene.add( particle );
        }
    }

    var black = true;
    function onKeyDown(e) {
        switch (e.which) {
            case 32:
                if (app.play) {
                    // audio.pause();
                    source.start();
                    app.play = false;
                } else {
                    // audio.play();
                    source.stop();
                    app.play = true;
                }
                break;
            case 84:
                if (black){
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


    function onDocumentMouseMove(event) {

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function onDocumentTouchStart( event ) {

        if ( event.touches.length === 1 ) {

            event.preventDefault();

            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;

        }

    }

    function onDocumentTouchMove( event ) {

        if ( event.touches.length === 1 ) {

            event.preventDefault();

            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;

        }

    }

    document.addEventListener('mousemove', onDocumentMouseMove, false );
    document.addEventListener('touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    document.addEventListener('keydown', onKeyDown, false);

    var timeFrequencyData = new Uint8Array(analyser.fftSize);

    function animate() {
        requestAnimationFrame( animate );
        analyser.getByteTimeDomainData(timeFrequencyData);

        for (var j = 0; j <= particles.length; j++){
            particle = particles[j++];
            particle.position.z = (timeFrequencyData[j] / 10);
            particle.material.rotation += 0.00001;


            // if (particle.position.z > 12){
            //     particle.material.color.setHex(0xb798b1);
            // }
            // else {
            //     particle.material.color.setHex(0xffffff);
            // }

            // particle.position.x = particle.position.x - (mouseX * 0.00005);
            // particle.position.y = particle.position.y + (mouseY * 0.00005);


        }

        camera.position.x = ( mouseX - camera.position.x ) * 0.05;
        camera.position.y = ( - mouseY - camera.position.y ) * 0.075;
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
    }
    animate();
}