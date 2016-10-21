console.log('windlow loaded');

var scene, camera, renderer;
init();

function init(){
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.005);
    var width = window.innerWidth;
    var height = window.innerHeight;

    var fov = 50;

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(width,height);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(fov, width/height, 0.1, 2000);
    camera.position.set(0,37,250);

    renderer.setClearColor(0x000000, 1);
    window.addEventListener('resize', function(){
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
    });

    var group = new THREE.Group();
    scene.add( group );
    var group2 = new THREE.Group();
    scene.add( group2 );
    var group3 = new THREE.Group();
    scene.add( group3 );
    var group4 = new THREE.Group();
    scene.add( group4 );

    // function randomColorGenerator(){
    //     return Math.floor((Math.random() * 150) + 106);
    // }
    // randomly generate color shades in hex
    // use different color for each quadrent

    var PI2 = Math.PI * 2;
    for (var i = 0; i < 2500; i++){
        // var color = new THREE.Color(0,0,randomColorGenerator());
        var material = new THREE.SpriteCanvasMaterial({color: 0xff00ff, program: function ( context ) {
            context.beginPath();
            context.arc( 0, 0, 0.5, 0, PI2, true );
            context.fill();

        }});
        var particle = new THREE.Particle( material );
        particle.position.x = Math.random() * 250;
        particle.position.y = Math.random() * 150 - 75;
        particle.position.z = Math.random() * 250;
        group.add( particle )
    }

    for (var j = 0; j < 2500; j++){
        var material2 = new THREE.SpriteCanvasMaterial({color: 0xffff00, program: function ( context ) {
            context.beginPath();
            context.arc( 0, 0, 0.5, 0, PI2, true );
            context.fill();

        }});
        var particle2 = new THREE.Particle( material2 );
        particle2.position.x = Math.random() * 250 - 250;
        particle2.position.y = Math.random() * 150 - 75;
        particle2.position.z = Math.random() * 250;
        group2.add( particle2 )
    }

    for (var k = 0; k < 2500; k++){
        var material3 = new THREE.SpriteCanvasMaterial({color: 0x0000ff, program: function ( context ) {
            context.beginPath();
            context.arc( 0, 0, 0.5, 0, PI2, true );
            context.fill();

        }});
        var particle3 = new THREE.Particle( material3 );
        particle3.position.x = Math.random() * 250;
        particle3.position.y = Math.random() * 150 - 75;
        particle3.position.z = Math.random() * 250 - 250;
        group3.add( particle3 )
    }

    for (var l = 0; l < 2500; l++){
        var material4 = new THREE.SpriteCanvasMaterial({color: 0xfffff, program: function ( context ) {
            context.beginPath();
            context.arc( 0, 0, 0.5, 0, PI2, true );
            context.fill();

        }});
        var particle4 = new THREE.Particle( material4 );
        particle4.position.x = Math.random() * 250 - 250;
        particle4.position.y = Math.random() * 150 - 75;
        particle4.position.z = Math.random() * 250 - 250;
        group4.add( particle4 )
    }

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    function animate(){
        requestAnimationFrame(animate);
        group.rotation.y += 0.025;
        group2.rotation.y += 0.025;
        group3.rotation.y += 0.025;
        group4.rotation.y += 0.025;
        // group.rotation.z += 0.01;
        // group2.rotation.z += 0.01;
        // group3.rotation.z += 0.01;
        // group4.rotation.z += 0.01;
        renderer.render(scene,camera);
        controls.update();
    }
    animate();
}