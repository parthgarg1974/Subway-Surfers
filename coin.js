/// <reference path="webgl.d.ts" />

let coins = class {
    constructor(gl,pos){
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
            const vertexCount = 12*this.n;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }

    tick()
    {
        this.pos[2] -= 0.1;

        if(jetpack_boost === true)
        {
            this.pos[1] = 1.5;
        }
        else
        {
            this.pos[1] = -0.5;
        }
    }


    generate_coordinates()
    {
        // var n = 50;
        // var k = 0;

        var positions = [];

        var radius = 0.09;
        var z = 0.025;

        for(var i=0;i<this.n;i++)
        {   
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),radius*Math.cos(2*Math.PI/this.n*(i+1)),-z);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),-z);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),z);
            

            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),radius*Math.cos(2*Math.PI/this.n*(i+1)),z);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),z);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),-z);
            
        }

        for(var i=0;i<this.n;i++)
        {   
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),radius*Math.cos(2*Math.PI/this.n*(i+1)),-z);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),-z);
            // positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),z);
            positions.push(0,0,-z);
            

            positions.push(radius*Math.sin(2*Math.PI/this.n*(i+1)),radius*Math.cos(2*Math.PI/this.n*(i+1)),z);
            positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),z);
            positions.push(0,0,z);
            // positions.push(radius*Math.sin(2*Math.PI/this.n*(i)),radius*Math.cos(2*Math.PI/this.n*(i)),-z);
            
        }

        

        return positions;
    }

    generate_colors()
    {
        var colors = [];
        for(var i = 0;i<this.n;i++)
        {
            colors = colors.concat(gold,white,gold,gold);
            colors = colors.concat(gold,white,gold,gold);
            colors = colors.concat(gold,gold,gold,gold);
            colors = colors.concat(gold,gold,gold,gold);
        }

        return colors;
    }

    generate_indices()
    {
        var indices = [];
        for(var i = 0;i<this.n*4;i++)
        {
            indices.push(3*i);
            indices.push(3*i+1);
            indices.push(3*i+2);

        }

        return indices;
    }

    coin_pickup(pos,length)
    {
        if(this.pos[0] === pos[0] || Math.abs(this.pos[0]-pos[0]) === 0.35)
        {
            if(pos[1] < -0.6 || jetpack_boost === true)
            {
                if(this.pos[2]-pos[2] <= 0.125+length)
                {
                    to_be_removed = true;   
                }
            }   
        }
    }
};

