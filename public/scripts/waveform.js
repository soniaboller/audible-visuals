console.log('loaded');

$(document).ready(function() {

    var scene, camera, renderer;
    init();

    function init() {
        scene = new THREE.Scene();
        var width = window.innerWidth;
        var height = window.innerHeight;

        var fov = 60;

        renderer = new THREE.CanvasRenderer();
        renderer.setSize(width, height);
        document.body.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 2000);
        camera.position.set(0, -450, 700);

        renderer.setClearColor(0x000000, 1);
        window.addEventListener('resize', function () {
            var width = window.innerWidth;
            var height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });

        var controls = new THREE.OrbitControls(camera, renderer.domElement);

        var PI2 = Math.PI * 2;
        particles = new Array();

        for (var j = 0; j <= 2048; j++) {
            var material = new THREE.SpriteCanvasMaterial({
                color: 0xffffff, program: function (context) {
                    context.beginPath();
                    //somehow those params make it not draw weird lines on the page
                    context.arc(-0.5, 1.25, 1.25, 0, PI2, true);
                    context.fill();
                }
            });

            var particle = particles[ j ++ ] = new THREE.Particle(material);
            var particlePositionZ = -175;
            var particleSpacing = 3;
            var particleOffset = 0;
            if (j < 256){
                particle.position.x = (j - 128 - particleOffset) * (particleSpacing);
                particle.position.z = particlePositionZ;
            }
            else if (j >= 256 && j < 512){
                particle.position.x = (j - 384 - particleOffset) * (particleSpacing);
                particle.position.z = particlePositionZ + 50;
            }
            else if (j >= 512 && j < 768){
                particle.position.x = (j - 640 - particleOffset) * (particleSpacing);
                particle.position.z = particlePositionZ + 100;
            }
            else if (j >= 768 && j < 1024){
                particle.position.x = (j - 896 - particleOffset) * (particleSpacing);
                particle.position.z = particlePositionZ + 150;
            }
            else if (j >= 1024 && j < 1280){
                particle.position.x = (j - 1152 - particleOffset) * (particleSpacing);
                particle.position.z = particlePositionZ + 200;
            }
            else if (j >= 1280 && j < 1536){
                particle.position.x = (j - 1408 - particleOffset) * (particleSpacing);
                particle.position.z = particlePositionZ + 250;
            }
            else if (j >= 1536 && j < 1792){
                particle.position.x = (j - 1664 - particleOffset) * (particleSpacing);
                particle.position.z = particlePositionZ + 300;
            }
            else {
                particle.position.x = (j - 1920 - particleOffset) * (particleSpacing);
                particle.position.z = particlePositionZ + 350;
            }
            particle.position.y = 0;
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
        // analyser.smoothingTimeConstant = 1;
        console.log('analyser');
        console.log(analyser);

        audioSrc.connect(analyser);
        analyser.connect(ctx.destination);

        var play = false;
        controls.autoRotate = false;
        function onKeyDown(e) {
            switch (e.which) {
                case 32:
                    if (play) {
                        audio.pause();
                        play = false;
                        // controls.autoRotate = true;
                    } else {
                        audio.play();
                        play = true;
                        // controls.autoRotate = false;
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

        // var uintFrequencyData = new Uint8Array(analyser.frequencyBinCount);
        var timeFrequencyData = new Uint8Array(analyser.fftSize);
        // var floatFrequencyData = new Float32Array(analyser.frequencyBinCount);

        window.addEventListener("keydown", onKeyDown, false);

        function animate() {
            requestAnimationFrame(animate);
            // analyser.getByteFrequencyData(uintFrequencyData);
            analyser.getByteTimeDomainData(timeFrequencyData);
            // analyser.getFloatFrequencyData(floatFrequencyData);
            for (var j = 0; j <= 2048; j++){
                var intensity = 1;
                var particleHeight;

                    if (intensity >= 3){
                        particleHeight = 75;
                    }
                    else if (intensity >= 2){
                        particleHeight = -50;
                    }
                    else if (intensity >= 1){
                        particleHeight = -175;
                    }
                    else if (intensity < 1){
                        particleHeight = -250;
                    }

                particle = particles[j++];
                if (j < 256){
                    particle.position.y = (timeFrequencyData[j] * intensity - particleHeight);
                    particle.material.color.setHex(0xCD0000);
                }
                else if (j >= 256 && j < 512){
                    particle.position.y = (timeFrequencyData[j] * intensity  - (particleHeight + 75));
                    particle.material.color.setHex(0xFF8000);
                }
                else if (j >= 512 && j < 768){
                    particle.position.y = (timeFrequencyData[j] * intensity  - (particleHeight + 150));
                    particle.material.color.setHex(0xFFFF1a);
                }
                else if (j >= 768 && j < 1024){
                    particle.position.y = (timeFrequencyData[j] * intensity  - (particleHeight + 225));
                    particle.material.color.setHex(0x009900);
                }
                else if (j >= 1024 && j < 1280){
                    particle.position.y = (timeFrequencyData[j] * intensity  - (particleHeight + 300));
                    particle.material.color.setHex(0x00CCCC);
                }
                else if (j >= 1280 && j < 1536){
                    particle.position.y = (timeFrequencyData[j] * intensity  - (particleHeight + 375));
                    particle.material.color.setHex(0x3333FF)
                }
                else if (j >= 1536 && j < 1792){
                    particle.position.y = (timeFrequencyData[j] * intensity  - (particleHeight + 450));
                    particle.material.color.setHex(0xEE00EE)
                }
                else {
                    particle.position.y = (timeFrequencyData[j] * intensity  - (particleHeight + 525));
                    particle.material.color.setHex(0xCD3278)
                }
                // particle.material.color.setRGB(1,1 - timeFrequencyData[j]/255,1);

            }

            // camera.rotation.x += -Math.sin(1)/500;
            // camera.rotation.z += -Math.sin(1)/500;
            renderer.render(scene, camera);
            camera.lookAt(scene.position);
            // controls.target.set(0,0,0);
            // controls.autoRotate = true;
            // controls.update();
            controls.autoRotateSpeed = 1.5;
            controls.target.set(0,0,0);
            controls.update();
        }
        animate();
    }

});
