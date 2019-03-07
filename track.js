/// <reference path="webgl.d.ts" />

let track = class {
    constructor(gl,pos){
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.positionBuffer);
        this.ground_x = 2.0;
        this.ground_y = 1.0;
        this.ground_z = 1000.0;
        this.speed = 0.1;

        this.positions = [
             // Front face
             -this.ground_x, -this.ground_y, this.ground_z,
             this.ground_x, -this.ground_y, this.ground_z,
             this.ground_x, this.ground_y, this.ground_z,
             -this.ground_x, this.ground_y, this.ground_z,
             //Back Face
             -this.ground_x, -this.ground_y, -this.ground_z,
             this.ground_x, -this.ground_y, -this.ground_z,
             this.ground_x, this.ground_y, -this.ground_z,
             -this.ground_x, this.ground_y, -this.ground_z,
             //Top Face
             -this.ground_x, this.ground_y, -this.ground_z,
             this.ground_x, this.ground_y, -this.ground_z,
             this.ground_x, this.ground_y, this.ground_z,
             -this.ground_x, this.ground_y, this.ground_z,
             //Bottom Face
             -this.ground_x, -this.ground_y, -this.ground_z,
             this.ground_x, -this.ground_y, -this.ground_z,
             this.ground_x, -this.ground_y, this.ground_z,
             -this.ground_x, -this.ground_y, this.ground_z,
             //Left Face
             -this.ground_x, -this.ground_y, -this.ground_z,
             -this.ground_x, this.ground_y, -this.ground_z,
             -this.ground_x, this.ground_y, this.ground_z,
             -this.ground_x, -this.ground_y, this.ground_z,
             //Right Face
             this.ground_x, -this.ground_y, -this.ground_z,
             this.ground_x, this.ground_y, -this.ground_z,
             this.ground_x, this.ground_y, this.ground_z,
             this.ground_x, -this.ground_y, this.ground_z,
        ];

        // var  z_offset = 0;
        // for(var i = 0;i<6;++i)
        // {
        //     this.positions.push(-1,1.2,-2+z_offset);
        //     this.positions.push(1,1.2,-2+z_offset);
        //     this.positions.push(1,1.2,2+z_offset);
        //     this.positions.push(-1,1.2,2+z_offset);
        //     z_offset -= 10;            
        // }

        this.rotation = 0;
        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.positions),gl.STATIC_DRAW);

        // this.facecolors = [
        //     [Math.random(),Math.random(),Math.random(),Math.random()],
        //     [Math.random(),Math.random(),Math.random(),Math.random()],
        //     [Math.random(),Math.random(),Math.random(),Math.random()],
        //     [Math.random(),Math.random(),Math.random(),Math.random()],
        //     [Math.random(),Math.random(),Math.random(),Math.random()],
        //     [Math.random(),Math.random(),Math.random(),Math.random()],

        // ];

        // var colors = [];

        // for(var j = 0;j < this.facecolors.length;++j){
        //     const c = this.facecolors[j];

        //     colors = colors.concat([Math.random(),Math.random(),Math.random(),Math.random()],[Math.random(),Math.random(),Math.random(),Math.random()],[Math.random(),Math.random(),Math.random(),Math.random()],[Math.random(),Math.random(),Math.random(),Math.random()]);
        // }
        var colors = [];
        // const c = [160/255,82/255,45/255,1.0];
        // const c1 = [218/255,165/255,32/255,1.0];

        for(var j = 0;j<6;++j){
            colors = colors.concat(mustard,brown,brown,mustard);
        }
        // for(var j = 0;j<6;++j){
        //     colors = colors.concat(c,c,c,c);
        // }
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);

        const indices = [
            0, 1, 2,    0, 2, 3, // front
            4, 5, 6,    4, 6, 7,
            8, 9, 10,   8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ];

        // for(var i=0;i<6*6;i++)
        // {
        //     indices.push(indices[i]+24);
        // }

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        };
    }

    tick()
    {
        // this.speed += 0.0001;
        this.pos[2] = this.pos[2]-this.speed;
    }

    drawCube(gl, projectionMatrix, programInfo, deltaTime) {
        const modelViewMatrix = mat4.create();
        this.pos[2]=this.pos[2]+0.1;
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        
        // this.rotation += Math.PI / (((Math.random()) % 100) + 50);

        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.rotation,
            [1, 1, 1]);

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.color);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
};