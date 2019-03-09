var cubeRotation = 0.0;

main();

//
// Start here
//




function init_objects(gl)
{
  miles = new player(gl,[0,1,4]);
  gwen = new police(gl,[0,1,2.5]);
  c1 = new track(gl,[0,-2.0,0]);
  rails = new Rails(gl , [1.2,-2.0,0]);
  rails1 = new Rails(gl , [0,-2.0,0]);
  rails2 = new Rails(gl , [-1.2,-2.0,0]);
  // sample = new type2(gl,[0,1,5]);
  lightning = 0;
  grayscale = 0;
  now_time = Date.now();
  NUMBER_OF_TYPE2 = 12;
  NUMBER_OF_SHOES = 6;
  tumble_counter = 0;
  NUMBER_OF_BUSHES = 6;
  NUMBER_OF_SPIKES = 6;
  type2_num = [];
  spike_num = [];
  bush_num = [];
  shoe_num = [];
  jetpack_boost = false;
  shoe_boost = false;
  timer_start = 0;
  return_value = 0;
  score = 0;
  boot_powerup = false;
  to_be_removed = false;
  NUMBER_OF_TRAINS = 18;
  trains = [];

  NUMBER_OF_COIN = 24;
  coin_number = [];

  NUMBER_OF_SCENES = 5;
  NUMBER_OF_JETS = 6;
  jets = [];
  scene_num = [];
  scene_right = [];
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

  for(var i = 0;i<NUMBER_OF_COIN/3;i++)
  {
    coin_number.push(new coins(gl,[0.85,-0.5,getRandomInt(20,500)]));
    coin_number.push(new coins(gl,[0.0,-0.5,getRandomInt(20,500)]));
    coin_number.push(new coins(gl,[-0.85,-0.5,getRandomInt(20,500)]));
  }

  for(var i = 0;i<NUMBER_OF_JETS/3;i++)
  {
    jets.push(new jetpack(gl,[0.85,-0.5,getRandomInt(20,500)]));
    jets.push(new jetpack(gl,[0.0,-0.5,getRandomInt(20,500)]));
    jets.push(new jetpack(gl,[-0.85,-0.5,getRandomInt(20,500)]));
  }

  for(var i = 0;i<NUMBER_OF_SHOES/3;i++)
  {
    shoe_num.push(new shoes(gl,[0.85,-0.5,getRandomInt(20,500)]));
    shoe_num.push(new shoes(gl,[0.0,-0.5,getRandomInt(20,500)]));
    shoe_num.push(new shoes(gl,[-0.85,-0.5,getRandomInt(20,500)]));
  }

  for(var i = 0;i<NUMBER_OF_TYPE2/3;i++)
  {
    type2_num.push(new type2(gl,[0.85,-0.5,getRandomInt(20,500)]));
    type2_num.push(new type2(gl,[0.0,-0.5,getRandomInt(20,500)]));
    type2_num.push(new type2(gl,[-0.85,-0.5,getRandomInt(20,500)]));
  }

  for(var i = 0;i<NUMBER_OF_BUSHES/2;i++)
  {
    bush_num.push(new bush(gl,[0.85,-0.5,getRandomInt(20,500)]));
    // bush_num.push(new bush(gl,[0.0,-0.5,getRandomInt(20,500)]));
    bush_num.push(new bush(gl,[-0.85,-0.5,getRandomInt(20,500)]));
  }

  for(var i = 0;i<NUMBER_OF_SPIKES;i++)
  {
    // bush_num.push(new bush(gl,[0.85,-0.5,getRandomInt(20,500)]));
    spike_num.push(new spikes(gl,[0.0,-0.8,getRandomInt(20,500)]));
    // bush_num.push(new bush(gl,[-0.85,-0.5,getRandomInt(20,500)]));
  }
  var z_offset = 0;

  for(var i=0;i<NUMBER_OF_SCENES;i++)
  {
    scene_num.push(new scene(gl,[2.4,1.44,5+z_offset]));
    z_offset += 20;
  }

  z_offset = 0;

  for(var i=0;i<NUMBER_OF_SCENES;i++)
  {
    scene_right.push(new scene(gl,[-5.4,1.44,3+z_offset]));
    z_offset += 20;
  }

  // sample = new scene(gl,[2.4,1.44,5]);
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
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  // Fragment shader program

  const fsSource2 = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;
  const shaderProgram2 = initShaderProgram(gl, vsSource2, fsSource2);
  
  const fsSourcebw = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying lowp vec4 vColor;
    void main(void) {
        float gray = (vColor.r + vColor.g + vColor.b) / 3.0;
        vec3 grayscale = vec3(gray);
        gl_FragColor = vec4(grayscale, vColor.a);
    }
  `;

  const fsSourceTexbw = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;
  uniform sampler2D uSampler;
  void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    
    vec3 color = texelColor.rgb;
    float gray = (color.r + color.g + color.b) / 3.0;
    vec3 grayscale = vec3(gray);
    gl_FragColor = vec4(grayscale , texelColor.a);
  }
`;

  const shaderProgram3 = initShaderProgram(gl,vsSource,fsSourcebw);
  const shaderProgram4 = initShaderProgram(gl,vsSource2,fsSourceTexbw);

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

  const programInfo3 = {
    program: shaderProgram3,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram3, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram3, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram3, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram3, 'uModelViewMatrix'),
    },
  };

  const programInfo2 = {
    program: shaderProgram2,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram2, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram2, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram2, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram2, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram2, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram2, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram2, 'uSampler'),
    },
};

const programInfo4 = {
  program: shaderProgram4,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram4, 'aVertexPosition'),
    vertexNormal: gl.getAttribLocation(shaderProgram4, 'aVertexNormal'),
    textureCoord: gl.getAttribLocation(shaderProgram4, 'aTextureCoord'),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram4, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(shaderProgram4, 'uModelViewMatrix'),
    normalMatrix: gl.getUniformLocation(shaderProgram4, 'uNormalMatrix'),
    uSampler: gl.getUniformLocation(shaderProgram4, 'uSampler'),
  },
};

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers
  init_textures(gl);

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    userinput(miles);
    tick_elements();
    if(grayscale === 1)
      drawScene(gl, programInfo3,programInfo4,deltaTime);
    else if(grayscale === 0)
      drawScene(gl, programInfo,programInfo2,deltaTime);

    // delete_objects();

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
    var cameraPosition;
    // mat4.translate(cameraMatrix, cameraMatrix, [2, 5, 0]);
    if(jetpack_boost === false)
      cameraPosition = [0,0.2,0];
    else
      cameraPosition = [0,1.5,0];

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
function drawScene(gl, programInfo, programInfo2,deltaTime) {
  gl.clearColor(light_violet[0],light_violet[1],light_violet[2],light_violet[3]); // Clear to black, fully opaque
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
  // const texture_2 = loadTexture(gl,'assets/body.jpeg');

  miles.drawCube(gl,viewProjectionMatrix,programInfo,programInfo2,texture_2,deltaTime);
  gwen.drawCube(gl,viewProjectionMatrix,programInfo,programInfo2,texture_4,deltaTime);
  // sample.drawCube(gl,viewProjectionMatrix,programInfo,programInfo2,texture_5,deltaTime);
  // trains[0].drawCube(gl,projectionMatrix,programInfo,deltaTime);
  // sample.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i = 0;i<coin_number.length;i++)
  {
    coin_number[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
  }

  for(var i = 0;i<jets.length;i++)
  {
    jets[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
  }


  for(var i = 0;i<shoe_num.length;i++)
  {
    shoe_num[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
  }

  for(var i = 0;i<bush_num.length;i++)
  {
    bush_num[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
  }

  for(var i = 0;i<spike_num.length;i++)
  {
    spike_num[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
  }

  for(var i = 0;i<type2_num.length;i++)
  {
    type2_num[i].drawCube(gl,viewProjectionMatrix,programInfo,programInfo2,texture_5,deltaTime);
  }

  for(var i = 0;i<NUMBER_OF_SCENES;i++)
  {
    scene_num[i].drawCube(gl,viewProjectionMatrix,programInfo2,texture,deltaTime);
    // scene_num[i].drawCube(gl,viewProjectionMatrix,programInfo2,texture_3,deltaTime);
  }

  for(var i = 0;i<NUMBER_OF_SCENES;i++)
  {
    scene_right[i].drawCube(gl,viewProjectionMatrix,programInfo2,texture_3,deltaTime);
    // scene_num[i].drawCube(gl,viewProjectionMatrix,programInfo2,texture_3,deltaTime);
  }

  
  // const texture = loadTexture(gl,'assets/scene1.jpg');
  // sample.drawCube(gl,viewProjectionMatrix,programInfo2,texture_,deltaTime);


}

function init_textures(gl)
{
  texture_2 = loadTexture(gl,'assets/body.jpeg');
  texture = loadTexture(gl,'assets/building3.jpg');
  texture_3 = loadTexture(gl,"assets/try1.png");
  texture_4 = loadTexture(gl,"assets/sponge.jpg");
  texture_5 = loadTexture(gl,"assets/type2.png");

}

function tick_elements()
{
  // if(return_value!==0)
  // console.log(return_value);
  // console.log(tumble_counter);
  if(Date.now() - now_time >1000)
  {
    now_time = Date.now();
    lightning = lightning ^ 1;
  }
  if(tumble_counter>1)
  {
    // console.log("endgame");
  }
    
  
  if(Date.now()-timer_start > 10000)
  {
    jetpack_boost = false;
  }
  if(Date.now()-timer_start_shoe > 10000)
  {
    boot_powerup = false;
  }
  if(Date.now()-timer_start_tumble > 10000)
  {
    tumble_counter = 0;
  }
  miles.tick();
  gwen.tick();
  gwen.set_position(miles.pos);
  c1.tick();
  rails.tick();
  rails1.tick();
  rails2.tick();
  // train.tick();
  for(var i = 0;i<NUMBER_OF_TRAINS;i++)
  {
    trains[i].tick();
    // console.log(boot_powerup);
    if(boot_powerup === true)
      trains[i].detect_front(miles.pos,miles.body_z);
    else if(boot_powerup === false)
      trains[i].detect_without_power(miles.pos,miles.body_z);

    // console.log(return_value);
  }
  for(var i=0;i<coin_number.length;i++)
  {
    coin_number[i].tick();
    coin_number[i].coin_pickup(miles.pos,miles.body_z);

    if(to_be_removed === true)
    {
      // console.log("coin");
      score+=1;
      coin_number.splice(i,1);
      to_be_removed = false;
    }
  }

  for(var i=0;i<jets.length;i++)
  {
    jets[i].tick();
    jets[i].jet_pickup(miles.pos,miles.body_z);

    if(to_be_removed === true)
    {
      // console.log("coin");
      jetpack_boost = true;
      timer_start = Date.now();
      jets.splice(i,1);
      to_be_removed = false;
    }
  }


  for(var i=0;i<shoe_num.length;i++)
  {
    shoe_num[i].tick();
    shoe_num[i].shoe_pickup(miles.pos,miles.body_z);

    if(to_be_removed === true)
    {
      // console.log("coin");
      boot_powerup = true;
      timer_start_shoe = Date.now();
      shoe_num.splice(i,1);
      to_be_removed = false;
    }
  }

  for(var i=0;i<bush_num.length;i++)
  {
    bush_num[i].tick();
    bush_num[i].shoe_pickup(miles.pos,miles.body_z);

    if(to_be_removed === true)
    {
      // console.log("coin");
      tumble_counter += 1;
      // boot_powerup = true;
      timer_start_tumble = Date.now();
      gwen.pos[2] += 2;
      to_be_removed = false;
      bush_num.splice(i,1);
      // break;
    }
  }

  for(var i=0;i<spike_num.length;i++)
  {
    spike_num[i].tick();
    spike_num[i].shoe_pickup(miles.pos,miles.body_z);

    if(to_be_removed === true)
    {
      // console.log("coin");
      tumble_counter += 1;
      // boot_powerup = true;
      timer_start_tumble = Date.now();
      gwen.pos[2] += 2;
      to_be_removed = false;
      spike_num.splice(i,1);
      // break;
    }
  }

  for(var i=0;i<type2_num.length;i++)
  {
    type2_num[i].tick();
    type2_num[i].shoe_pickup(miles.pos,miles.body_z);

    if(to_be_removed === true)
    {
      // console.log("coin");
      tumble_counter += 1;
      // boot_powerup = true;
      timer_start_tumble = Date.now();
      gwen.pos[2] += 2;
      to_be_removed = false;
      type2_num.splice(i,1);
      // break;
    }
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

// function delete_objects()
// {
//   for(var i=0;i<NUMBER_OF_TRAINS;i++)
//   {
//     if(trains[i].pos[2] < 0)
//     {
//       trains = trains.slice(0, i).concat(trains.slice(i + 1, trains.length));
//     }
//   }

//   for(var i=0;i<NUMBER_OF_COIN;i++)
//   {
//     if(coin_number[i].pos[2] < 0)
//     {
//       coin_number = coin_number.slice(0, i).concat(coin_number.slice(i + 1, coin_number.length));
//     }
//   }
// }
