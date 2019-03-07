/// <reference path="webgl.d.ts" />

let Rails = class {
    constructor(gl,pos){
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.positionBuffer);

        this.positions = [];
        this.TOTAL_NUMBER_OF_TRACKS = 1000;
        this.TOTAL_LINES = 2;
        this.track_x = 0.4;
        this.track_y = 1.12;
        this.track_z = 0.2;

        var z_offset = 0;

        for(var i = 0;i<this.TOTAL_NUMBER_OF_TRACKS;i++)
        {
            this.positions.push(-this.track_x,this.track_y,-this.track_z+z_offset);
            this.positions.push(this.track_x,this.track_y,-this.track_z+z_offset);
            this.positions.push(this.track_x,this.track_y,this.track_z+z_offset);
            this.positions.push(-this.track_x,this.track_y,this.track_z+z_offset);
            z_offset += 5;
        }
        this.line_x = 0;
        this.line_y = 1.1;
        this.line_z = 1000;
        var x_offset = 0.25;

        this.positions.push(this.line_x+x_offset,this.line_y,-this.line_z*0);
        this.positions.push(x_offset+0.1,this.line_y,-this.line_z*0);
        this.positions.push(x_offset+0.1,this.line_y,this.line_z);
        this.positions.push(this.line_x+x_offset,this.line_y,this.line_z);
        
        this.positions.push(-(this.line_x+x_offset),this.line_y,-this.line_z*0);
        this.positions.push(-(x_offset+0.1),this.line_y,-this.line_z*0);
        this.positions.push(-(x_offset+0.1),this.line_y,this.line_z);
        this.positions.push(-(this.line_x+x_offset),this.line_y,this.line_z);

        this.rotation = 0;
        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.positions),gl.STATIC_DRAW);

        var colors = [];

        for(var j = 0;j<this.TOTAL_NUMBER_OF_TRACKS;j++)
        {
            colors = colors.concat(black,dark_brown,dark_brown,black);
        }

        for(var j = 0;j<this.TOTAL_LINES;j++)
        {
            colors = colors.concat(black,grey,grey,black);
        }

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);

        var indices = [];

        for(var i = 0;i<this.TOTAL_NUMBER_OF_TRACKS+this.TOTAL_LINES;i++)
        {
            indices.push(4*i);
            indices.push(4*i+1);
            indices.push(4*i+2);
            
            indices.push(4*i);
            indices.push(4*i+2);
            indices.push(4*i+3);
            
        }

        // for(var j = 0;i<this.TOTAL_LINES;j++)
        // {
        //     indices.push(2*j+4*i+4);
        //     indices.push(2*j+1+4*i+4);

        // }

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        };
    }

    tick()
    {
        this.pos[2] = this.pos[2] - 0.1;
    }

    
    drawCube(gl,projectionMatrix,programInfo,deltaTime)
    {
        const modelViewMatrix = mat4.create();

        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );

        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            this.rotation,
            [1,1,1]
        );

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize  = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );

            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition
            );

        }

        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer.color);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor
            );
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.buffer.indices);
        gl.useProgram(programInfo.program);

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );

        {
            const vertexCount = 6*this.TOTAL_NUMBER_OF_TRACKS+6*this.TOTAL_LINES;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES,vertexCount,type,offset);
        }

        // this.draw_lines(gl,projectionMatrix,programInfo,deltaTime);
    }

    


    
}
