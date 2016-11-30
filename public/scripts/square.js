console.log('wave loaded');

var app = app || {};
app.init = init;
app.play = false;

var separation = 1.05, xNum = 45, yNum = 45,
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

        color: 0xffffff,
        program: function ( context ) {

            context.beginPath();
            context.arc( 0, 0, 0.25, 0, PI2, true );
            context.fill();

        }

    } );

    var i = 0;
    for ( var iy = 0; iy < yNum; iy++ ) {
        for ( var ix = 0; ix < xNum; ix++ ) {
            var particle = particles[i++] = new THREE.Particle( material );
            particle.position.x = ix * separation - ( ( xNum * separation ) / 2 );
            particle.position.y = iy * separation - ( ( yNum * separation ) / 2 );
            scene.add( particle );
        }
    }
    console.log(particles);

    var play = false;
    // controls.autoRotate = false;
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
            case 83:
                if (controls.autoRotate){
                    controls.autoRotate = false;
                }
                else{
                    controls.autoRotate = true;
                }
                break;
            case 66:
                controls.reset();

        }
        return false;
    }


    function onDocumentMouseMove(event) {

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    document.addEventListener("mousemove", onDocumentMouseMove, false );
    document.addEventListener("keydown", onKeyDown, false);

    var timeFrequencyData = new Uint8Array(analyser.fftSize);

    function animate() {
        requestAnimationFrame( animate );
        analyser.getByteTimeDomainData(timeFrequencyData);

        for (var j = 0; j <= particles.length; j++){
            particle = particles[j++];
            particle.position.z = (timeFrequencyData[j] / 8);
            particle.material.rotation += 0.00001;

            // particle.position.x = particle.position.x - (mouseX * 0.00005);
            // particle.position.y = particle.position.y + (mouseY * 0.00005);

            // if (j > 1012){
            //     particle.position.x = (timeFrequencyData[j] / 7)
            // }
            // else {
            //     particle.position.y = (timeFrequencyData[j] / 7)
            // }

        }

        camera.position.x = ( mouseX - camera.position.x ) * 0.05;
        camera.position.y = ( - mouseY - camera.position.y ) * 0.075;
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
    }
    animate();
}