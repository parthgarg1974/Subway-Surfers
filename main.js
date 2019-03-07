var cubeRotation = 0.0;

main();

//
// Start here
//

var c;
var c1;
var trains;
var NUMBER_OF_TRAINS;

function init_objects(gl)
{
  miles = new player(gl,[0,1,4]);
  c1 = new track(gl,[0,-2.0,0]);
  rails = new Rails(gl , [1.2,-2.0,0]);
  rails1 = new Rails(gl , [0,-2.0,0]);
  rails2 = new Rails(gl , [-1.2,-2.0,0]);
  sample = new coins(gl,[0,0,2]);
  
  NUMBER_OF_TRAINS = 18;
  trains = [];
  // train = new train(gl,[0.45,-0.1,20]);
  for(var i = 0;i<NUMBER_OF_TRAINS/3;i++)
  {
    trains.push(new train(gl,[0.45,-0.1,getRandomInt(20,500)]));
  }

  for(var i = 0;i<NUMBER_OF_TRAINS/3;i++)
  {
    trains.push(new train(gl,[0,0,getRandomInt(20,1000)]));
  }

  for(var i = 0;i<NUMBER_OF_TRAINS/3;i++)
  {
    trains.push(new train(gl,[-0.45,-0.1,getRandomInt(20,1000)]));
  }

  // trains.push(new train(gl,[0.45,-0.1,getRandomInt(20,1000)]));

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function main() {


  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // c1 = new track(gl, [0, -2.0, -20.0]);
  // If we don't have a GL context, give up now
  
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  
  // Vertex shader program
  
  init_objects(gl);

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const vsSource2 = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying highp vec2 vTextureCoord;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  // Fragment shader program

  const fsSource2 = `
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;
  const shaderProgram2 = initShaderProgram(gl, vsSource2, fsSource2);
  

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  const programInfo2 = {
    program: shaderProgram2,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram2, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram2, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram2, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram2, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram2, 'uSampler'),
    },
};

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers

  const texture = loadTexture(gl,'assets/body.jpeg');

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    userinput(miles);
    tick_elements();
    drawScene(gl, programInfo,programInfo2,texture,deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function set_camera(gl)
{
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 1000.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [2, 5, 0]);
    var cameraPosition = [
      0,
      0.2,
      // cameraMatrix[14],
      0,
    ];

    var up = [0, 1, 0];

    mat4.lookAt(cameraMatrix, cameraPosition, [0,0,100], up);

    var viewMatrix = cameraMatrix;

    var viewProjectionMatrix = mat4.create();

    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

    return viewProjectionMatrix;
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, programInfo2,texture,deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  viewProjectionMatrix=set_camera(gl);

  // const fieldOfView = 60 * Math.PI / 180;   // in radians
  // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  // const zNear = 0.1;
  // const zFar = 1000.0;
  // const projectionMatrix = mat4.create();

  // // note: glmatrix.js always has the first argument
  // // as the destination to receive the result.
  // mat4.perspective(projectionMatrix,
  //                  fieldOfView,
  //                  aspect,
  //                  zNear,
  //                  zFar);

  // // Set the drawing position to the "identity" point, which is
  // // the center of the scene.
  //   var cameraMatrix = mat4.create();
  //   mat4.translate(cameraMatrix, cameraMatrix, [2, 5, 0]);
  //   var cameraPosition = [
  //     0,
  //     0,
  //     // cameraMatrix[14],
  //     0,
  //   ];

  //   var up = [0, 1, 0];

  //   mat4.lookAt(cameraMatrix, cameraPosition, c1.pos, up);

  //   var viewMatrix = cameraMatrix;//mat4.create();

  //   //mat4.invert(viewMatrix, cameraMatrix);

  //   var viewProjectionMatrix = mat4.create();

  //   mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

  // c.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  c1.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  rails.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
  rails1.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
  rails2.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
  // train.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
  for(var i = 0;i<NUMBER_OF_TRAINS;i++)
  {
    trains[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
  }
  miles.drawCube(gl,viewProjectionMatrix,programInfo,programInfo2,texture,deltaTime);
  // trains[0].drawCube(gl,projectionMatrix,programInfo,deltaTime);
  sample.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);

  

}

function tick_elements()
{
  miles.tick();
  c1.tick();
  rails.tick();
  rails1.tick();
  rails2.tick();
  // train.tick();
  for(var i = 0;i<NUMBER_OF_TRAINS;i++)
  {
    trains[i].tick();
  }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);

    const image = new Image();
    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    srcFormat, srcType, image);

      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn of mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;

    return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
