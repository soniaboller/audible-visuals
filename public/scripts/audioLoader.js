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
        $('#notification').velocity('fadeOut', { duration: 150 });

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
            window.cancelAnimationFrame(app.animationFrame);
        }
        app.audio = document.createElement('audio');
        app.audio.src = URL.createObjectURL(data);
        app.audio.autoplay = true;
        // app.audio.play();
        app.play = true;
        document.body.appendChild(app.audio);
        app.ctx = new (window.AudioContext || window.webkitAudioContext)();
        source = app.ctx.createMediaElementSource(app.audio);
        analyser = app.ctx.createAnalyser();
        source.connect(app.ctx.destination);
        source.connect(analyser);
        console.log(app.ctx, 'context')
        console.log(analyser, '---analyser')
        console.log(source, '-------source')

        app.animate();
    }
};

