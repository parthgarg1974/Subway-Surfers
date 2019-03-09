/// <reference path="webgl.d.ts" />

let jetpack = class {
    constructor(gl,pos)
    {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.positionBuffer);

        this.n = 50;
        this.positions = this.generate_coordinates();
        this.rotation = 0;
        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.positions),gl.STATIC_DRAW);

        var colors = this.generate_colors();

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);

        this.indices = this.generate_indices();

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices),gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        };


    }
    tick()
    {
        this.pos[2] -= 0.1;
    }

    jet_pickup(pos,length)
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

    drawCube(gl, projectionMatrix, programInfo, deltaTime) {
        const modelViewMatrix = mat4.create();
        // this.pos[2]=this.pos[2]+0.1;
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        
        this.rotation += Math.PI / (((Math.random()) % 100) + 50);

        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.rotation,
            [0, 1, 0]);

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
            const vertexCount = 24*this.n;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }

    generate_coordinates()
    {
        var positions = [];

        var radius = 0.05;
        var z = 0.125;

        for(var i=0;i<this.n;i++)
        {   
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),-z,radius*Math.cos(2*Math.PI/this.n*(i+1)));
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),-z,radius*Math.cos(2*Math.PI/this.n*(i)));
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),z,radius*Math.cos(2*Math.PI/this.n*(i)));
            

            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),z,radius*Math.cos(2*Math.PI/this.n*(i+1)));
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),z,radius*Math.cos(2*Math.PI/this.n*(i)));
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),-z,radius*Math.cos(2*Math.PI/this.n*(i)));
            
        }

        for(var i=0;i<this.n;i++)
        {   
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),-z,radius*Math.cos(2*Math.PI/this.n*(i+1)));
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),-z,radius*Math.cos(2*Math.PI/this.n*(i)));
            // positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),z);
            positions.push(0,0.2,0);
            

            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),z,radius*Math.cos(2*Math.PI/this.n*(i+1)));
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),z,radius*Math.cos(2*Math.PI/this.n*(i)));
            positions.push(0,-0.2,0);
            // positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),-z);
            
        }

        var z_offset = 0.1;

        for(var i=0;i<this.n;i++)
        {   
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),-z,radius*Math.cos(2*Math.PI/this.n*(i+1))+z_offset);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),-z,radius*Math.cos(2*Math.PI/this.n*(i))+z_offset);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),z,radius*Math.cos(2*Math.PI/this.n*(i))+z_offset);
            

            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),z,radius*Math.cos(2*Math.PI/this.n*(i+1))+z_offset);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),z,radius*Math.cos(2*Math.PI/this.n*(i))+z_offset);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),-z,radius*Math.cos(2*Math.PI/this.n*(i))+z_offset);
            
        }

        for(var i=0;i<this.n;i++)
        {   
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),-z,radius*Math.cos(2*Math.PI/this.n*(i+1))+z_offset);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),-z,radius*Math.cos(2*Math.PI/this.n*(i))+z_offset);
            // positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),z);
            positions.push(0,0.2,0+z_offset);
            

            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),z,radius*Math.cos(2*Math.PI/this.n*(i+1))+z_offset);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),z,radius*Math.cos(2*Math.PI/this.n*(i))+z_offset);
            positions.push(0,-0.2,0+z_offset);
            // positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),-z);
            
        }

        

        return positions;

    }

    generate_colors()
    {
        var colors = [];
        for(var i = 0;i<this.n*2;i++)
        {
            colors = colors.concat(yellow,yellow,yellow,yellow);
            colors = colors.concat(yellow,yellow,yellow,yellow);
            colors = colors.concat(yellow,yellow,yellow,yellow);
            colors = colors.concat(yellow,yellow,yellow,yellow);
        }

        return colors;
    }

    generate_indices()
    {
        var indices = [];
        for(var i = 0;i<this.n*8;i++)
        {
            indices.push(3*i);
            indices.push(3*i+1);
            indices.push(3*i+2);

        }

        return indices;
    }
}