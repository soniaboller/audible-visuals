var app = app || {};
var ctx;
var source;
var buffer;
var analyser;

window.onload = function () {
    app.init();
    console.log('array buffer audio loader connected');

    window.addEventListener('drop', onDrop, false);
    window.addEventListener('dragover', onDrag, false);

    function onDrag(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    function onDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        var droppedFiles = e.dataTransfer.files;
        initiateAudio(droppedFiles[0]);
    }

    function initiateAudio(data) {
        if(app.audio){
            app.audio.remove();
            cancelAnimationFrame(app.animate);
        }
        app.audio = document.createElement('audio');
        app.audio.src = URL.createObjectURL(data);
        app.audio.autoplay = true;
        app.play = true;
        document.body.appendChild(app.audio);
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        source = ctx.createMediaElementSource(app.audio);
        analyser = ctx.createAnalyser();
        source.connect(ctx.destination);
        source.connect(analyser);
        app.animate();
    }
};

