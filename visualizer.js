class Visualizer{
    static drawNetwork(ctx,network){
        const margin =50;
        const top =margin;
        const left =margin;
        const width =ctx.canvas.width-2*margin;
        const height =ctx.canvas.height-2*margin;
        Visualizer.drawLevel(ctx,network,levels[0],
            left,top,width,height);
    }
}

static drawLevel(ctx,network,level,left,top,width,height){
        const right=left+width;
        const bottom=top+height;

        const nodesRadius=17;
        for(let i=0;level.inputs)
}