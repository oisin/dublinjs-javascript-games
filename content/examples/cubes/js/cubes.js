var camera, scene, renderer;
var geometry, material, mesh1, mesh2, mesh3;
var camera_movement, controls;
var clock = new THREE.Clock();
var orbits = 0;

init();
animate();

function orbit(satellite, body, distance, speed) {
  if (satellite.angle === undefined) {
    satellite.angle = 0;
  }

  if (satellite.orbits === undefined) {
    satellite.orbits = 0;
  }

  satellite.position.x = body.position.x + distance * Math.sin(satellite.angle);
  satellite.position.z = body.position.z + distance * Math.cos(satellite.angle);
  satellite.position.y = body.position.y

  satellite.angle += Math.PI / speed;
  if (satellite.angle > (Math.PI * 2)) {
    satellite.angle = 0;
    satellite.orbits += 1;
  }
}

function cube(x, y, z, color, wf) {
  geometry = new THREE.CubeGeometry(x, y, z);
  material = new THREE.MeshBasicMaterial( { color: color, wireframe: wf } );
  mesh = new THREE.Mesh( geometry, material );
  return mesh;
}

function init() {

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 700;

  ///  THIS BIT FROM HERE

  controls = new THREE.FlyControls( camera );

  controls.movementSpeed = 1000;
  controls.domElement = container;
  controls.rollSpeed = Math.PI / 12;
  controls.autoForward = false;
  controls.dragToLook = false;

  /// TO HERE 

  scene = new THREE.Scene();

  mesh1 = cube(100, 100, 100, 0xffff00, true);
  scene.add( mesh1 );

  mesh2 = cube(20, 20, 20, 0xF846FC, true);
  mesh2.position.x = mesh1.position.x - 500;
  scene.add( mesh2 );

  mesh3 = cube(20, 20, 20, 0x0000ff, true);
  mesh3.position.x = mesh1.position.x - 300;
  scene.add( mesh3 );

  label = createLabel("HELLO WORLD", 0, 0, 0, 40, "black", "#666");
  scene.add(label);
  
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  //renderer = new THREE.CanvasRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  $("#container").append( renderer.domElement );
  
}

function createLabel(text, x, y, z, size, color, backGroundColor, backgroundMargin) {
  if(!backgroundMargin)
    backgroundMargin = 50;

  var canvas = document.createElement("canvas");

  var context = canvas.getContext("2d");
  context.font = size + "pt Arial";

  var textWidth = context.measureText(text).width;

  canvas.width = textWidth + backgroundMargin;
  canvas.height = size + backgroundMargin;
  context = canvas.getContext("2d");
  context.font = size + "pt Arial";

  if(backGroundColor) {
    context.fillStyle = backGroundColor;
    context.fillRect(canvas.width / 2 - textWidth / 2 - backgroundMargin / 2, canvas.height / 2 - size / 2 - +backgroundMargin / 2, textWidth + backgroundMargin, size + backgroundMargin);
  }

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // context.strokeStyle = "black";
  // context.strokeRect(0, 0, canvas.width, canvas.height);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  var material = new THREE.MeshBasicMaterial({
    map : texture
  });

  var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
  // mesh.overdraw = true;
  mesh.doubleSided = true;
  mesh.position.x = x - canvas.width;
  mesh.position.y = y - canvas.height;
  mesh.position.z = z;

  return mesh;
}

function animate() {

  // note: three.js includes requestAnimationFrame shim
  requestAnimationFrame( animate );

  var delta = clock.getDelta();

  mesh1.rotation.y += 0.02;
  mesh2.rotation.x -= 0.05;
  mesh2.rotation.y -= 0.02;
  mesh3.rotation.y += 0.07;

  orbit(mesh2, mesh1, 500, 200);
  orbit(mesh3, mesh1, 300, 100)
  

  $("#orbit1").text("Orbit 1 = " + mesh2.orbits);
  $("#orbit2").text("Orbit 2 = " + mesh3.orbits);

  $("#camera_x").text(camera.position.x);
  $("#camera_y").text(camera.position.y);
  $("#camera_z").text(camera.position.z);

  controls.update( delta );
  renderer.render( scene, camera ); 
}