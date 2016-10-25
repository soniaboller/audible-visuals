console.log('connected');

$(document).ready(function() {
    $('body').append('<canvas></canvas>');
    $('canvas').prop('id', 'canvas-id');
    var canvas = $('#canvas-id');
    var canvasctx = canvas.getContext('2d');

});