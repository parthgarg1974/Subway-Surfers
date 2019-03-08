/// <reference path="webgl.d.ts" />

let police = class {
    constructor(gl,pos)
    {
        this.positionBuffer = gl.createBuffer();
        this.positionBuffer3 = gl.createBuffer();
        // this.positionBuffer3 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.positionBuffer);
        
        this.body_x = 0.15;
        this.body_y = 0.15;
        this.body_z = 0.25;
        
        this.face_x = 0.10;
        this.face_y = 0.15;
        this.face_z = 0.24;
        
        this.bottom_x = 0.15;
        this.bottom_y = 0.15;
        this.bottom_z = 0.24;
        this.acceleration = 0.1;
        this.acceleration_z = 0;
        
        this.positions = this.generate_coordinates2();
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.positions),gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,this.positionBuffer3);
        this.positions2 = this.generate_coordinates3();
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.positions2),gl.STATIC_DRAW);

        this.rotation = 0;
        this.pos = pos;

        const colorBuffer = gl.createBuffer();
        var colors = this.generate_colors();
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);

        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        this.textureCoordinates = this.generate_texture();
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates),gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
        
        const indices = this.generate_indices2();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
        
        
        const indexBuffer3 = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer3);
        const indices2 = this.generate_indices2();
        
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices2),gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ARRAY_BUFFER,this.positionBuffer3);
        // this.positions3 = this.generate_coordinates3();
        // gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.positions3),gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        };

        this.buffer3 = {
            position: this.positionBuffer3,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer3,
        };
        
    }

    generate_colors()
    {
        var colors = [];
        for(var i=0;i<6;i++)
        {
            colors = colors.concat(brown,brown,brown,brown);
        }
        for(var i=0;i<6;i++)
        {
            colors = colors.concat(brown,brown,brown,brown);
        }
        return colors;
    }

    drawCube(gl,projectionMatrix,programInfo,programInfo2,texture,deltaTime)
    {
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );

        mat4.rotate(modelViewMatrix,modelViewMatrix,this.rotation,[1,1,1]);

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

        this.drawCube3(gl,projectionMatrix,programInfo,programInfo2,texture,deltaTime);
    }

    drawCube3(gl, projectionMatrix, programInfo,programInfo2,texture,deltaTime) {
        const modelViewMatrix = mat4.create();
        // this.pos[2]=this.pos[2]-0.1;
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        
        // this.rotation += Math.PI / (((Math.random()) % 100) + 50);

        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            0,
            [1, 1, 1]);

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer3.position);
            gl.vertexAttribPointer(
                programInfo2.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo2.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer3.textureCoord);
            gl.vertexAttribPointer(
                programInfo2.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo2.attribLocations.textureCoord);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer3.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo2.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo2.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo2.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        gl.activeTexture(gl.TEXTURE0);

            // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);
          
            // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo2.uniformLocations.uSampler, 0);

        {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }

    set_position(pos)
    {
        this.pos[0] = pos[0];
        // this.pos[1] = pos[1];
    }

    tick()
    {
        this.acceleration_z -= 0.000009;
        if(this.pos[1]>-0.6125)
        {
            this.pos[1] -= this.acceleration/10;
        }

        if(this.pos[2] > 0)
        {
            this.pos[2] += this.acceleration_z;
        }
    }


    generate_texture()
    {
        var texture = [
             // Front
             0.0,  0.0,
             1.0,  0.0,
             1.0,  1.0,
             0.0,  1.0,
             // Back
             0.0,  0.0,
             1.0,  0.0,
             1.0,  1.0,
             0.0,  1.0,
             // Top
             0.0,  0.0,
             1.0,  0.0,
             1.0,  1.0,
             0.0,  1.0,
             // Bottom
             0.0,  0.0,
             1.0,  0.0,
             1.0,  1.0,
             0.0,  1.0,
             // Right
             0.0,  0.0,
             1.0,  0.0,
             1.0,  1.0,
             0.0,  1.0,
             // Left
             0.0,  0.0,
             1.0,  0.0,
             1.0,  1.0,
             0.0,  1.0,
        ];

        return texture;
    }

    generate_indices2()
    {
        var indices = [];

        for(var i=0;i<6;i++)
        {
            indices.push(4*i);
            indices.push(4*i+1);
            indices.push(4*i+2);
            indices.push(4*i);
            indices.push(4*i+2);
            indices.push(4*i+3);
        }
        return indices;
    }


    generate_coordinates3()
    {
        var positions = [
            -this.body_x,-this.body_y,this.body_z,
            this.body_x,-this.body_y,this.body_z,
            this.body_x,this.body_y,this.body_z,
            -this.body_x,this.body_y,this.body_z,
            
            -this.body_x,-this.body_y,-this.body_z,
            this.body_x,-this.body_y,-this.body_z,
            this.body_x,this.body_y,-this.body_z,
            -this.body_x,this.body_y,-this.body_z,

            -this.body_x,this.body_y,-this.body_z,
            this.body_x,this.body_y,-this.body_z,
            this.body_x,this.body_y,this.body_z,
            -this.body_x,this.body_y,this.body_z,

            -this.body_x,-this.body_y,-this.body_z,
            this.body_x,-this.body_y,-this.body_z,
            this.body_x,-this.body_y,this.body_z,
            -this.body_x,-this.body_y,this.body_z,

            -this.body_x,-this.body_y,-this.body_z,
            -this.body_x,this.body_y,-this.body_z,
            -this.body_x,this.body_y,this.body_z,
            -this.body_x,-this.body_y,this.body_z,

            this.body_x,-this.body_y,-this.body_z,
            this.body_x,this.body_y,-this.body_z,
            this.body_x,this.body_y,this.body_z,
            this.body_x,-this.body_y,this.body_z,
        ];

        return positions;
    }

    generate_coordinates2()
    {
        var positions = [
            -this.bottom_x,-this.body_y-this.bottom_y,this.bottom_z,
            this.bottom_x,-this.body_y-this.bottom_y,this.bottom_z,
            this.bottom_x,this.body_y-this.bottom_y,this.bottom_z,
            -this.bottom_x,this.body_y-this.bottom_y,this.bottom_z,
            
            -this.bottom_x,-this.body_y-this.bottom_y,-this.bottom_z,
            this.bottom_x,-this.body_y-this.bottom_y,-this.bottom_z,
            this.bottom_x,this.body_y-this.bottom_y,-this.bottom_z,
            -this.bottom_x,this.body_y-this.bottom_y,-this.bottom_z,

            -this.bottom_x,this.body_y-this.bottom_y,-this.bottom_z,
            this.bottom_x,this.body_y-this.bottom_y,-this.bottom_z,
            this.bottom_x,this.body_y-this.bottom_y,this.bottom_z,
            -this.bottom_x,this.body_y-this.bottom_y,this.bottom_z,

            -this.bottom_x,-this.body_y-this.bottom_y,-this.bottom_z,
            this.bottom_x,-this.body_y-this.bottom_y,-this.bottom_z,
            this.bottom_x,-this.body_y-this.bottom_y,this.bottom_z,
            -this.bottom_x,-this.body_y-this.bottom_y,this.bottom_z,

            -this.bottom_x,-this.body_y-this.bottom_y,-this.bottom_z,
            -this.bottom_x,this.body_y-this.bottom_y,-this.bottom_z,
            -this.bottom_x,this.body_y-this.bottom_y,this.bottom_z,
            -this.bottom_x,-this.body_y-this.bottom_y,this.bottom_z,

            this.bottom_x,-this.body_y-this.bottom_y,-this.bottom_z,
            this.bottom_x,this.body_y-this.bottom_y,-this.bottom_z,
            this.bottom_x,this.body_y-this.bottom_y,this.bottom_z,
            this.bottom_x,-this.body_y-this.bottom_y,this.bottom_z,

        ];

        return positions;
    }
};