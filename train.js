/// <reference path="webgl.d.ts" />

let train = class {
    constructor(gl,pos){
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.positionBuffer);

        this.train_length = 10.0;
        this.train_width = 0.1;
        this.train_height = 0.1;

        this.positions = [
           // Front face
           -this.train_width, -this.train_height, this.train_length,
           this.train_width, -this.train_height, this.train_length,
           this.train_width, this.train_height, this.train_length,
           -this.train_width, this.train_height, this.train_length,
           //Back Face
           -this.train_width, -this.train_height, -this.train_length,
           this.train_width, -this.train_height, -this.train_length,
           this.train_width, this.train_height, -this.train_length,
           -this.train_width, this.train_height, -this.train_length,
           //Top Face
           -this.train_width, this.train_height, -this.train_length,
           this.train_width, this.train_height, -this.train_length,
           this.train_width, this.train_height, this.train_length,
           -this.train_width, this.train_height, this.train_length,
           //Bottom Face
           -this.train_width, -this.train_height, -this.train_length,
           this.train_width, -this.train_height, -this.train_length,
           this.train_width, -this.train_height, this.train_length,
           -this.train_width, -this.train_height, this.train_length,
           //Left Face
           -this.train_width, -this.train_height, -this.train_length,
           -this.train_width, this.train_height, -this.train_length,
           -this.train_width, this.train_height, this.train_length,
           -this.train_width, -this.train_height, this.train_length,
           //Right Face
           this.train_width, -this.train_height, -this.train_length,
           this.train_width, this.train_height, -this.train_length,
           this.train_width, this.train_height, this.train_length,
           this.train_width, -this.train_height, this.train_length, 
        ];

        this.window_length = 0.09;
        this.window_width = 0.04;

        this.positions.push(-this.window_length,-this.window_width+0.05,-this.train_length-0.001);
        this.positions.push(this.window_length,-this.window_width+0.05,-this.train_length-0.001);
        this.positions.push(this.window_length,this.window_width+0.05,-this.train_length-0.001);
        this.positions.push(-this.window_length,this.window_width+0.05,-this.train_length-0.001);

        var NUMBER_OF_WINDOWS = 9;
        var z_offset = -8;

        for(var i = 0;i<NUMBER_OF_WINDOWS;i++)
        {
            this.positions.push(-this.train_width-0.00001,-this.train_height,-this.window_length+z_offset);
            this.positions.push(-this.train_width-0.00001,this.train_height,-this.window_length+z_offset);
            this.positions.push(-this.train_width-0.00001,this.train_height,this.window_length+z_offset);
            this.positions.push(-this.train_width-0.00001,-this.train_height,this.window_length+z_offset);
            z_offset += 2;
            // console.log(z_offset);

        }

        z_offset = -8;
        for(var i = 0;i<NUMBER_OF_WINDOWS;i++)
        {
            this.positions.push(this.train_width+0.00001,-this.train_height,-this.window_length+z_offset);
            this.positions.push(this.train_width+0.00001,this.train_height,-this.window_length+z_offset);
            this.positions.push(this.train_width+0.00001,this.train_height,this.window_length+z_offset);
            this.positions.push(this.train_width+0.00001,-this.train_height,this.window_length+z_offset);
            z_offset += 2;
            // console.log(z_offset);

        }

        this.rotation = 0;
        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.positions),gl.STATIC_DRAW);

        
        
        
        // const c = [Math.random(),Math.random(),Math.random(),Math.random()];
        var colors = [];
        for(var i =0;i<6;i++)
        {
            colors = colors.concat(orange,dark_orange,dark_orange,orange);
        }
        // const c1 = [1,1,1,1];
        for(var i=0;i<NUMBER_OF_WINDOWS+1;i++)
        {
            colors = colors.concat(skyblue,skyblue,skyblue,white);
        }

        for(var i=0;i<NUMBER_OF_WINDOWS;i++)
        {
            colors = colors.concat(skyblue,skyblue,skyblue,white);
        }

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
            24, 25, 26, 24, 26, 27,
        ];

        for(var i=0;i<NUMBER_OF_WINDOWS*12;i++)
        {
            indices.push(indices[i]+28);
        }

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        };
    }

    tick()
    {
        this.pos[2]=this.pos[2]-0.2;

    }

    drawCube(gl,projectionMatrix,programInfo,deltaTime)
    {
        const modelViewMatrix = mat4.create();
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
            const vertexCount = 36+6+6*18;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }

    detect_front(pos,length)
    {
        // console.log(pos,this.pos);
        
        
            if(this.pos[0] === pos[0] && jetpack_boost === false)
            {
                if(this.pos[2]-pos[2] < this.train_length+length && this.pos[2]-pos[2] > 0)
                {
                    if(pos[1]<-0.6)
                    {
                        console.log("detected");
                        // return 1;
                        // miles.acceleration = 0.1;


                    }
                    else
                    {
                        console.log("on train");
                        if(pos[0] !=0)
                        miles.pos[1] = 0.2;
                        else
                        miles.pos[1] = 0.35;
                        miles.acceleration = 0;
                        // return 4;
                    }
                }
                else
                {
                    miles.acceleration = 0.1;
                }
            }
            else if(Math.abs(this.pos[0]-pos[0])===0.75 && jetpack_boost === false)
            {
                if(this.pos[2]-pos[2] < this.train_length+length && this.pos[2]-pos[2] > 0)
                {
                    if(pos[1]<-0.61)
                    {
                        console.log("detected");
                        // return 1;
                        // miles.acceleration = 0.1;


                    }
                    else
                    {
                        console.log("on train");
                        if(pos[0] !=0)
                        miles.pos[1] = 0.2;
                        else
                        miles.pos[1] = 0.35;
                        miles.acceleration = 0;
                        // return 4;
                    }
                }
                else
                {
                    miles.acceleration = 0.1;
                }
            }

            // return 0;
        
    }

    detect_without_power(pos,length)
    {
        if(this.pos[0] == pos[0] || Math.abs(this.pos[0]-pos[0])===0.75)
        {
            if(pos[1]<0)
            {
                if(this.pos[2]-pos[2] < this.train_length && this.pos[2]-pos[2] > 0)
                {
                    console.log("detected without powerup");
                }
            }
        }
    }
};