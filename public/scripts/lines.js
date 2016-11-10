console.log('connected');

$(document).ready(function() {
    scene = new THREE.Scene();
    var width = window.innerWidth;
    var height = window.innerHeight;

    var fov = 50;

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 2000);
    camera.position.set(0, -50, 750);

    renderer.setClearColor(0xffffff, 1);
    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

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

    var play = false;

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

    var timeFrequencyData = new Uint8Array(analyser.fftSize);
    console.log(timeFrequencyData.length);

    $('canvas').prop('id', 'canvas-id');
    var canvas = document.getElementById('canvas-id');
    var canvasctx = canvas.getContext('2d');
    console.log(canvasctx);
    canvasctx.fillStyle = 'white';
    canvasctx.lineJoin = 'round';
    canvasctx.beginPath();
    canvasctx.moveTo(0, 50);
    canvasctx.lineTo(0, 300);
    canvasctx.stroke();

    // function animate() {
    //     requestAnimationFrame(animate);
    //     analyser.getByteTimeDomainData(timeFrequencyData);
    //     for (var i = 0; i < 2048; i++) {
    //         console.log(timeFrequencyData[1]);
    //         canvasctx.lineTo(i++, (timeFrequencyData[i] + 100));
    //     }
    //     animate();
    // }
    // canvasctx.stroke();
    // canvasctx.restore();
});