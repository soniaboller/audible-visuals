var app = app || {};
var ctx;
var source;
var buffer;
var analyser;

window.onload = function () {
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
        console.log('dropped files var');
        console.log(droppedFiles);

        var fileReader = new FileReader();

        fileReader.onload = function (fileEvent) {
            console.log('fileEvent variable');
            console.log(fileEvent);
            var data = fileEvent.target.result;
            console.log('data (fileEvent.target.result) -- base64');
            // console.log(data);
            // var formData = new FormData();
            // formData.append('url', data);
            // var url = formData.get('url');
            // console.log(url);
            // $('body').append('<audio src="'+ url + '" controls="controls"></audio>');
            // app.init();

            initiateAudio(data);
        };
        fileReader.readAsArrayBuffer(droppedFiles[0]);
    }

    function initiateAudio(data) {
        ctx = new AudioContext();
        source = ctx.createBufferSource();
        console.log('this the the buffer source');
        //yoooo you can change the speed of the song!!!
        source.playbackRate.value = 1;
        console.log(source);
        ctx.decodeAudioData(data, function (buffer) {
            source.buffer = buffer;
            createAudio();
        }, function (e) {
            console.log(e);
        });

        function createAudio() {
            analyser = ctx.createAnalyser();
            source.connect(ctx.destination);
            source.connect(analyser);
            source.start();
            console.log(app);
            app.init();

        }

    }
};

