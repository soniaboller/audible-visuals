console.log('loaded');

$(document).ready(function() {

    var scene, camera, renderer;
    init();

    // particleSpace = 0.67
    // particleHeight = 0.67
    // cameraZ = 450
    // cameraY = 150

    function init() {
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x202020, 0.005);
        var width = window.innerWidth;
        var height = window.innerHeight;

        var fov = 50;

        renderer = new THREE.CanvasRenderer();
        renderer.setSize(width, height);
        document.body.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 2000);
        camera.position.set(0, -50, 750);

        renderer.setClearColor(0x000000, 1);
        window.addEventListener('resize', function () {
            var width = window.innerWidth;
            var height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });

        particles = new Array();

        var PI2 = Math.PI * 2;
        for (var i = 0; i <= 1024; i++) {

            var material = new THREE.SpriteCanvasMaterial({
                color: 0xffffff, program: function (context) {
                    context.beginPath();
                    context.arc(0, 0, 1, 0, PI2, true);
                    context.fill();
                }
            });
            var particle = particles[ i ++ ] = new THREE.Particle(material);
            if (i <= 1024){
                particle.position.x = (i - 512) * 1.1;
                particle.position.y = 0;
                particle.position.z = 0;

            }
            scene.add(particle)
        }
        particles2 = new Array();
        for (var j = 0; j <= 1024; j++) {

            var material2 = new THREE.SpriteCanvasMaterial({
                color: 0x00ffff, program: function (context2) {
                    context2.beginPath();
                    context2.arc(0, 0, 1, 0, PI2, true);
                    context2.fill();
                }
            });
            var particle2 = particles2[ j ++ ] = new THREE.Particle(material2);
            if (j <= 1024){
                particle2.position.x = (j - 512) * 1.1;
                particle2.position.y = 0;
                particle2.position.z = 0;

            }
            scene.add(particle2)
        }

        particles3 = new Array();
        for (var k = 0; k <= 1024; k++) {

            var material3 = new THREE.SpriteCanvasMaterial({
                color: 0xffffff, program: function (context3) {
                    context3.beginPath();
                    context3.arc(0, 0, 1, 0, PI2, true);
                    context3.fill();
                }
            });
            var particle3 = particles3[ k ++ ] = new THREE.Particle(material3);
            if (k <= 1024){
                particle3.position.x = -(k - 512) * 1.1;
                particle3.position.y = 0;
                particle3.position.z = 0;

            }
            scene.add(particle3)
        }

        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        console.log('audioCtx');
        console.log(ctx);

        var audio = document.querySelector('audio');
        console.log('audio');
        console.log(audio);

        var audioSrc = ctx.createMediaElementSource(audio);
        console.log(audioSrc);

        var analyser = ctx.createAnalyser();
        console.log('analyser');
        console.log(analyser);

        audioSrc.connect(analyser);
        analyser.connect(ctx.destination);

        var play = true;
        function onKeyDown(event) {
            switch (event.keyCode) {
                case 32:
                    console.log(event.keyCode);
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

        window.addEventListener("keydown", onKeyDown, false);

        // var controls = new THREE.OrbitControls(camera, renderer.domElement);

        var uintFrequencyData = new Uint8Array(analyser.frequencyBinCount);
        var timeFrequencyData = new Uint8Array(analyser.frequencyBinCount);
        var floatFrequencyData = new Float32Array(analyser.frequencyBinCount);

        function animate() {
            requestAnimationFrame(animate);
            analyser.getByteFrequencyData(uintFrequencyData);
            analyser.getByteTimeDomainData(timeFrequencyData);
            analyser.getFloatFrequencyData(floatFrequencyData);
            for (var i = 0; i <= 1024; i++){
                particle = particles[i++];
                particle.position.y = (uintFrequencyData[i]);

            }
            for (var j = 0; j <= 1024; j++){
                particle2 = particles2[j++];
                particle2.position.y = (timeFrequencyData[j] - 178);

            }
            for (var k = 0; k <= 1024; k++){
                particle3 = particles3[k++];
                particle3.position.y = -(uintFrequencyData[k] + 100);

            }
            // camera.rotation.y += 0.01;
            renderer.render(scene, camera);
            // controls.update();
        }
        animate();
    }
});


// if (i <= 512){
//     particle.position.x = Math.random() * 256 - 256;
//     particle.position.y = 0;
//     particle.position.z = Math.random() * 150;
// }
// else{
//     particle.position.x = Math.random() * 256;
//     particle.position.y = 0;
//     particle.position.z = Math.random() * 150;
// }