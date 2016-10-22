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
        camera.position.set(0, 0, 750);

        renderer.setClearColor(0xffffff, 1);
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
                color: 0x000000, program: function (context) {
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

        // var controls = new THREE.OrbitControls(camera, renderer.domElement);

        var frequencyData = new Uint8Array(analyser.frequencyBinCount);

        function animate() {
            requestAnimationFrame(animate);
            analyser.getByteFrequencyData(frequencyData);
            for (var i = 0; i <= 1024; i++){
                particle = particles[i++];
                particle.position.y = (frequencyData[i] * 1.25) - 250;

            }
            camera.rotation.x = 0;
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