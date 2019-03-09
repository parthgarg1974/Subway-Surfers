/// <reference path="webgl.d.ts" />

let scene = class {
    constructor(gl,pos){
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.positionBuffer);

        this.coord_x = 2.2;
        this.coord_y = 4;
        this.coord_z = 20.0;


        this.positions = this.get_coordinates();

        this.rotation = 0;
        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.positions),gl.STATIC_DRAW);
        const normalBuffer = gl.createBuffer();
        
        if(lightning === 0)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);

            this.vertexNormals = this.generate_normals();

            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexNormals),gl.STATIC_DRAW);
        }
        
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        this.textureCoordBuffer = this.get_texture();
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.textureCoordBuffer),gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);

        this.indices = this.get_indices();

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices),gl.STATIC_DRAW);


        

        if(lightning === 0)
        {
            this.buffer = {
                position: this.positionBuffer,
                textureCoord: textureCoordBuffer,
                indices: indexBuffer,
                normal: normalBuffer,
            };
        }
        else
        {
            this.buffer = {
                position: this.positionBuffer,
                textureCoord: textureCoordBuffer,
                indices: indexBuffer,
                // normal: normalBuffer,
            };
        }
    }

    generate_normals()
    {
        var normals = [
            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];

        return normals;
    }

    get_coordinates()
    {
        var positions = [
            
            //Right Face
            this.coord_x, -this.coord_y, -this.coord_z*0,
            this.coord_x, this.coord_y, -this.coord_z*0,
            this.coord_x, this.coord_y, this.coord_z,
            this.coord_x, -this.coord_y, this.coord_z,

            //left Face
            this.coord_x, -this.coord_y, -this.coord_z*0,
            this.coord_x, this.coord_y, -this.coord_z*0,
            this.coord_x, this.coord_y, this.coord_z,
            this.coord_x, -this.coord_y, this.coord_z,

        ];

        return positions;


    }

    get_texture()
    {
        var texture = [
          
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

    get_indices()
    {
        var indices = [
            0, 1, 2,    0, 2, 3, // front
            4, 5, 6,    4, 6, 7,
            
        ];

        return indices;

    }

    drawCube(gl, projectionMatrix, programInfo,texture,deltaTime) {
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
            this.rotation,
            [1, 1, 1]);

        const normalMatrix = mat4.create();
        if(lightning === 0)
        {
            mat4.invert(normalMatrix, modelViewMatrix);
            mat4.transpose(normalMatrix, normalMatrix);
        }

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
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.textureCoord);
        }
        
        if(lightning === 0)
        {
            // Tell WebGL how to pull out the normals from
            // the normal buffer into the vertexNormal attribute.
            {
                const numComponents = 3;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.normal);
                gl.vertexAttribPointer(
                    programInfo.attribLocations.vertexNormal,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
                gl.enableVertexAttribArray(
                    programInfo.attribLocations.vertexNormal);
            }
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

        if(lightning === 0)
        {        
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.normalMatrix,
                false,
                normalMatrix);
        }
          

        gl.activeTexture(gl.TEXTURE1);
        // console.log(texture);

            // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);
          
            // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 1);

        {
            const vertexCount = 12;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
};

