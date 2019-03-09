/// <reference path="webgl.d.ts" />

let type2 = class {
    constructor(gl,pos)
    {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.positionBuffer);

        this.horizontal_x = 0.3;
        this.horizontal_y = 0.15;
        this.horizontal_z = 0.01;

        this.positions = this.generate_coordinates();
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.positions),gl.STATIC_DRAW);
        
        this.pos = pos;
        this.rotation = 0;

        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        this.textureCoordBuffer = this.generate_texture();
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.textureCoordBuffer),gl.STATIC_DRAW);
  
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);

        this.indices = this.generate_indices();

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices),gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        };
    }

    generate_coordinates()
    {
        var positions = [];
        var x_offset = 0;
        var y_offset = 0;

        positions.push(-this.horizontal_x+x_offset,-this.horizontal_y-y_offset,this.horizontal_z);
        positions.push(this.horizontal_x+x_offset,-this.horizontal_y-y_offset,this.horizontal_z);
        positions.push(this.horizontal_x+x_offset,this.horizontal_y-y_offset,this.horizontal_z);
        positions.push(-this.horizontal_x+x_offset,this.horizontal_y-y_offset,this.horizontal_z);

        positions.push(-this.horizontal_x+x_offset,-this.horizontal_y-y_offset,-this.horizontal_z);
        positions.push(this.horizontal_x+x_offset,-this.horizontal_y-y_offset,-this.horizontal_z);
        positions.push(this.horizontal_x+x_offset,this.horizontal_y-y_offset,-this.horizontal_z);
        positions.push(-this.horizontal_x+x_offset,this.horizontal_y-y_offset,-this.horizontal_z);

        positions.push(-this.horizontal_x+x_offset,this.horizontal_y-y_offset,-this.horizontal_z);
        positions.push(this.horizontal_x+x_offset,this.horizontal_y-y_offset,-this.horizontal_z);
        positions.push(this.horizontal_x+x_offset,this.horizontal_y-y_offset,this.horizontal_z);
        positions.push(-this.horizontal_x+x_offset,this.horizontal_y-y_offset,this.horizontal_z);

        positions.push(-this.horizontal_x+x_offset,-this.horizontal_y-y_offset,-this.horizontal_z);
        positions.push(this.horizontal_x+x_offset,-this.horizontal_y-y_offset,-this.horizontal_z);
        positions.push(this.horizontal_x+x_offset,-this.horizontal_y-y_offset,this.horizontal_z);
        positions.push(-this.horizontal_x+x_offset,-this.horizontal_y-y_offset,this.horizontal_z);

        positions.push(-this.horizontal_x+x_offset,-this.horizontal_y-y_offset,-this.horizontal_z);
        positions.push(-this.horizontal_x+x_offset,this.horizontal_y-y_offset,-this.horizontal_z);
        positions.push(-this.horizontal_x+x_offset,this.horizontal_y-y_offset,this.horizontal_z);
        positions.push(-this.horizontal_x+x_offset,-this.horizontal_y-y_offset,this.horizontal_z);

        positions.push(this.horizontal_x+x_offset,-this.horizontal_y-y_offset,-this.horizontal_z);
        positions.push(this.horizontal_x+x_offset,this.horizontal_y-y_offset,-this.horizontal_z);
        positions.push(this.horizontal_x+x_offset,this.horizontal_y-y_offset,this.horizontal_z);
        positions.push(this.horizontal_x+x_offset,-this.horizontal_y-y_offset,this.horizontal_z);

        return positions;
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

    generate_indices()
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

    drawCube(gl, projectionMatrix, programInfo,programInfo2,texture,deltaTime) {
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
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
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

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
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
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

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

    tick()
    {
        this.pos[2] -= 0.1;
    }

    shoe_pickup(pos,length)
    {
        if(this.pos[0] === pos[0] || Math.abs(this.pos[0]-pos[0]) === 0.35)
        {
            if(pos[1] < -0.6)
            {
                if(this.pos[2]-pos[2] <= 0.025+length && this.pos[2]-pos[2] > 0)
                {
                    to_be_removed = true;   
                }
            }   
        }
    }
};