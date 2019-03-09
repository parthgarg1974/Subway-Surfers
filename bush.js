/// <reference path="webgl.d.ts" />


let bush = class 
{
    constructor(gl,pos)
    {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.positionBuffer);

        this.vertical_x = 0.15;
        this.vertical_y = 0.15;
        this.vertical_z = 0.15;

        this.horizontal_x = 0.25;
        this.horizontal_y = 0.15;
        this.horizontal_z = 0.15;

        this.positions = this.generate_coordinates();
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.positions),gl.STATIC_DRAW);

        this.pos = pos;
        this.rotation = 0;

        const colorBuffer = gl.createBuffer();
        this.colors = this.generate_colors();
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.colors),gl.STATIC_DRAW);
        
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

    drawCube(gl,projectionMatrix,programInfo,programInfo2,texture,deltaTime)
    {
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        // this.rotation += Math.PI/(Math.random()%100+50)

        mat4.rotate(modelViewMatrix,modelViewMatrix,this.rotation,[0,1,0]);

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
            const vertexCount = 36+36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

        // this.drawCube3(gl,projectionMatrix,programInfo,programInfo2,texture,deltaTime);
    }

    generate_coordinates()
    {
        var positions = [
            -this.vertical_x,-this.vertical_y,this.vertical_z,
            this.vertical_x,-this.vertical_y,this.vertical_z,
            this.vertical_x,this.vertical_y,this.vertical_z,
            -this.vertical_x,this.vertical_y,this.vertical_z,
            
            -this.vertical_x,-this.vertical_y,-this.vertical_z,
            this.vertical_x,-this.vertical_y,-this.vertical_z,
            this.vertical_x,this.vertical_y,-this.vertical_z,
            -this.vertical_x,this.vertical_y,-this.vertical_z,

            -this.vertical_x,this.vertical_y,-this.vertical_z,
            this.vertical_x,this.vertical_y,-this.vertical_z,
            this.vertical_x,this.vertical_y,this.vertical_z,
            -this.vertical_x,this.vertical_y,this.vertical_z,

            -this.vertical_x,-this.vertical_y,-this.vertical_z,
            this.vertical_x,-this.vertical_y,-this.vertical_z,
            this.vertical_x,-this.vertical_y,this.vertical_z,
            -this.vertical_x,-this.vertical_y,this.vertical_z,

            -this.vertical_x,-this.vertical_y,-this.vertical_z,
            -this.vertical_x,this.vertical_y,-this.vertical_z,
            -this.vertical_x,this.vertical_y,this.vertical_z,
            -this.vertical_x,-this.vertical_y,this.vertical_z,

            this.vertical_x,-this.vertical_y,-this.vertical_z,
            this.vertical_x,this.vertical_y,-this.vertical_z,
            this.vertical_x,this.vertical_y,this.vertical_z,
            this.vertical_x,-this.vertical_y,this.vertical_z,
        ];

        var x_offset = 0.0;
        var y_offset = +0.2;

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

    generate_colors()
    {
        var colors = [];
        for(var i=0;i<6;i++)
        {
            colors = colors.concat(green,yellow,green,green);
        }
        for(var i=0;i<6;i++)
        {
            colors = colors.concat(green,green,yellow,green);
        }
        return colors;
    }
    generate_indices()
    {
        var indices = [];

        for(var i=0;i<6*2;i++)
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
};