console.log('loaded');

$(document).ready(function() {
    var scene, camera, renderer;
    init();

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
        camera.position.set(0, 100, 450);

        renderer.setClearColor(0xffffff, 1);
        window.addEventListener('resize', function () {
            var width = window.innerWidth;
            var height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });

        particles = new Array();
        // particles2 = new Array();

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
            if (i <= 256){
                particle.position.x = Math.random() * 128 - 252;
                particle.position.y = 0;
                particle.position.z = Math.random() * 150;
            }
            else if (i > 256 && i <= 512) {
                particle.position.x = Math.random() * 128 - 124;
                particle.position.y = 0;
                particle.position.z = Math.random() * 150;
            }
            else if (i > 512 && i <= 768){
                particle.position.x = Math.random() * 128;
                particle.position.y = 0;
                particle.position.z = Math.random() * 150;
            }
            else{
                particle.position.x = Math.random() * 128 + 124;
                particle.position.y = 0;
                particle.position.z = Math.random() * 150;
            }
            scene.add(particle)
        }
        // for (var j = 0; j < 1024; j++) {
        //     var material2 = new THREE.SpriteCanvasMaterial({
        //         color: 0xffffff, program: function (context) {
        //             context.beginPath();
        //             context.arc(0, 0, 0.5, 0, PI2, true);
        //             context.fill();
        //
        //         }
        //     });
        //     var particle2 = particles2[ i ++ ] = new THREE.Particle(material2);
        //     particle2.position.x = Math.random() * 150 - 150;
        //     particle2.position.y = 0;
        //     particle2.position.z = Math.random() * 250;
        //     scene.add(particle2)
        // }

        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        console.log('audioCtx');
        console.log(ctx);

        var audio = document.querySelector('audio');
        console.log('audio');
        console.log(audio);

        var audioSrc = ctx.createMediaElementSource(myAudio);
        console.log(audioSrc);

        var analyser = ctx.createAnalyser();
        console.log('analyser');
        console.log(analyser);

        audioSrc.connect(analyser);
        analyser.connect(ctx.destination);

        var controls = new THREE.OrbitControls(camera, renderer.domElement);

        var frequencyData = new Uint8Array(analyser.frequencyBinCount);

        function animate() {
            requestAnimationFrame(animate);
            // update data in frequencyData
            analyser.getByteFrequencyData(frequencyData);
            // render frame based on values in frequencyData
            for (var i = 0; i <= 1024; i++){
                particle = particles[i++];
                particle.position.y = frequencyData[i];
            }
            camera.rotation.x = 0.05;
            renderer.render(scene, camera);
            controls.update();
        }

        animate();
    }
});