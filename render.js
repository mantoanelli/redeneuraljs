export default function renderScreen(screen, game, requestAnimationFrame,isShowGrid,isShowLines){

    //console.log(isShowGrid); 
    const context = screen.getContext('2d');    
    context.clearRect(0,0,screen.width,screen.height);
    
    function showGrid(){
        let cor = '#111';
        for(let y=0;y<screen.height;y++){
            if(cor==='#111'){
                cor='#222';
            }else{
                cor='#111';
            }
            for(let x=0;x<screen.width;x++){
                if(cor==='#111'){
                    cor='#222';
                }else{
                    cor='#111';
                }
                context.fillStyle=cor;
                context.fillRect(x,y,1,1);
            }
        }
            
    }

    function showLinesConncetionsPlayerVsFruits(){
        for(const fId in game.state.fruits){
            const f = game.state.fruits[fId];
            for(const pId in game.state.players){
                const p = game.state.players[pId];
                context.beginPath();
                context.moveTo(p.x,p.y);
                context.lineTo(f.x,f.y);
                context.stroke(); 
            }
        }
    }
    if(isShowGrid) showGrid();
    if(isShowLines) showLinesConncetionsPlayerVsFruits();
    for(const pId in game.state.players){
        const p = game.state.players[pId];
        context.fillStyle=p.color;
        context.fillRect(p.x,p.y,1,1);
    }

    for(const fId in game.state.fruits){
        const f = game.state.fruits[fId];
        context.fillStyle=f.color;
        context.fillRect(f.x,f.y,1,1);
        //console.log(f.sensorCollision);
        
    }

    
    

    requestAnimationFrame(()=>{
        renderScreen(screen, game, requestAnimationFrame,isShowGrid,isShowLines);
    });
    
}