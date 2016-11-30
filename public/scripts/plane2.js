var container, stats;

var camera, scene, renderer;

var mesh;

init();
animate();

function init() {

    var container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.z = 3200;

    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );


    scene.add( new THREE.AmbientLight( 0x444444 ) );

    var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light1.position.set( 1, 1, 1 );
    scene.add( light1 );

    var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light2.position.set( 0, -1, 0 );
    scene.add( light2 );

    var triangles = 2048; // 2048 * 108 (rows)

    var geometry = new THREE.BufferGeometry();

    var positions = new Float32Array( triangles * 3 * 3 );
    var normals = new Float32Array( triangles * 3 * 3 );
    var colors = new Float32Array( triangles * 3 * 3 );

    var color = new THREE.Color();

    var n = 800, n2 = n/2;	// triangles spread in the cube
    var d = 12, d2 = d/2;	// individual triangle size

    var pA = new THREE.Vector3();
    var pB = new THREE.Vector3();
    var pC = new THREE.Vector3();

    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();

    for ( var i = 0; i < positions.length; i += 9 ) {

        // positions

        var x = (i/6) - 1500;

        var y = 1;
        var z = Math.random() * n - n2;

        var ax = x + Math.random() * d - d2;
        var ay = y + Math.random() * d - d2;

        var bx = x + Math.random() * d - d2;
        var by = y + Math.random() * d - d2;

        var cx = x + Math.random() * d - d2;
        var cy = y + Math.random() * d - d2;

        positions[ i ]     = ax;
        positions[ i + 1 ] = ay;

        positions[ i + 3 ] = bx;
        positions[ i + 4 ] = by;

        positions[ i + 6 ] = cx;
        positions[ i + 7 ] = cy;

        // flat face normals

        pA.set( ax, ay);
        pB.set( bx, by);
        pC.set( cx, cy);

        cb.subVectors( pC, pB );
        ab.subVectors( pA, pB );
        cb.cross( ab );

        cb.normalize();

        var nx = cb.x;
        var ny = cb.y;

        normals[ i ]     = nx;
        normals[ i + 1 ] = ny;

        normals[ i + 3 ] = nx;
        normals[ i + 4 ] = ny;

        normals[ i + 6 ] = nx;
        normals[ i + 7 ] = ny;

        // colors

        var vx = ( x / n ) + 0.5;
        var vy = ( y / n ) + 0.5;
        var vz = ( z / n ) + 0.5;

        color.setRGB( vx, vy, vz );

        colors[ i ]     = color.r;
        colors[ i + 1 ] = color.g;
        colors[ i + 2 ] = color.b;

        colors[ i + 3 ] = color.r;
        colors[ i + 4 ] = color.g;
        colors[ i + 5 ] = color.b;

        colors[ i + 6 ] = color.r;
        colors[ i + 7 ] = color.g;
        colors[ i + 8 ] = color.b;

    }

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

    geometry.computeBoundingSphere();

    var material = new THREE.MeshPhongMaterial( {
        color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
        side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    //

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    // renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    container.appendChild( renderer.domElement );

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    var time = Date.now() * 0.001;

    // mesh.rotation.x = time * 0.25;
    // mesh.rotation.y = time * 0.5;

    renderer.render( scene, camera );

}


function findDivisible (){
    for (var i = 100; i < 500; i++){
        var number = (2048 * i);
        if (number % 9 === 0){
            var divisble = number;
            console.log(i, divisble);
            console.log(9 * divisble);
        }
    }
}