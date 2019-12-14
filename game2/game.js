import Player from './Player.js';
import Fruit from './Fruit.js';

export default function createGame(screen){
    const colorsPlayer = [
        'blue','red','yellow','purple','white','pink','orange','gold','silver','lightblue'
    ];
    var isFinished = false;
    var qtyHistPos = 50;
    
    var genomes = [];
    var datasetTraining = {i:[],o:[]}
    var state = {
        players:{},
        fruits:{},
        screen:{
            w:screen.width,
            h:screen.height
        },
    }
    let totalFruits = 0;
    let totalFruitsRecord = 0;
    let directionMove = null;

    var playersGeracaoAtual = [];
    let minTimeInterval = 50;
    let timeInterval = 100;
    let startTimeInterval = 100;
    let _time;

    function start(){
        totalFruits = 0;
        isFinished = false;
        playersGeracaoAtual = [];
        startMove();
    }

    function startMove(){
        _time = setInterval(()=>{
            if(directionMove){
                movePlayer(directionMove);
                console.log(timeInterval);
                
            }
        },timeInterval)
    }

    function isFinishedGame(){
        return isFinished;
    }
    function killAllPlayers(){
        for(const p in state.players){
            state.players[p].isAlive=false;
        }
    }

    function loadGenome(genomeJson,playerId){
        let p = state.players[playerId];
        let genome = JSON.parse(genomeJson);
        Object.keys(genome).forEach((key)=>{
            p.nn[key] = genome[key];
        })
    }
    function addPlayer(){    
            
        const i = Math.floor(Math.random()*colorsPlayer.length);
        const p = new Player(colorsPlayer[i],Math.floor(Math.random()*screen.width),Math.floor(Math.random()*screen.height));
        state.players[p.id]=p;

        if(genomes.length > 0){
            document.getElementById('genome').value=JSON.stringify(genomes[0]);
            let genome = genomes[Math.floor(Math.random()*genomes.length)];
            Object.keys(genome).forEach((key)=>{
                p.nn[key] = genome[key];
            })
            
            if(datasetTraining.i.length > 0){                
                for(let i in datasetTraining.i){
                    p.nn.train(datasetTraining.i[i], datasetTraining.o[i]);
                }
            }
        }
        //calculateDistances(p);
        //document.getElementById('movimentos_restantes').innerText=(limitMoves - state.players[p.id].moves);
        return p.id;
    }

    function addFruit(){
        const p = new Fruit('green',Math.floor(Math.random()*screen.width),Math.floor(Math.random()*screen.height));
        state.fruits[p.id]=p;

        if(genomes.length > 0){
            let genome = genomes[Math.floor(Math.random()*genomes.length)];
            Object.keys(genome).forEach((key)=>{
                p.nn[key] = genome[key];
            })

            if(datasetTraining.i.length > 0){                
                for(let i in datasetTraining.i){
                    p.nn.train(datasetTraining.i[i], datasetTraining.o[i]);
                }
            }
        }
        //logFruit(p.id);
        return p.id;
    }

    function removeFruit(id){
        if(state.fruits[id]){
            delete state.fruits[id];
        }
    }

    function removePlayer(id){        
        if(state.players[id]){
            delete state.players[id];
        }
    }

    function setDirection(cmd){
        let player  = state.players[cmd.playerId];
        const accetedKeys = {
            ArrowRight(){},
            ArrowLeft(){},
            ArrowUp(){},  
            ArrowDown(){}
        }
        const move = accetedKeys[cmd.keyPressed];
        if(player && move){
            directionMove = cmd;          
        }
    }

    function movePlayer(cmd){
        let player  = state.players[cmd.playerId];
        const accetedKeys = {
            ArrowRight(player){
                if(player.x + 1 < state.screen.w){
                    player.x = player.x + 1;
                }
            },
            ArrowLeft(player){
                if(player.x -1 >= 0){
                    player.x = player.x - 1;
                }
            },
            ArrowUp(player){
                if(player.y - 1 >= 0){
                    player.y = player.y - 1;
                }
            },  
            ArrowDown(player){
                if(player.y + 1 < state.screen.h){
                    player.y = player.y + 1;
                }
            }
        }

        const move = accetedKeys[cmd.keyPressed];
        if(player && move){
            move(player);
            updatePlayerAttributes(player);
            calculateDistances();
            checkCollisionFruit(player);
            checkIsAlive(player);
            document.getElementById('pixels_percorridos').innerText=(player.moves);
            
            document.getElementById('pontos').innerText=player.hitFruits;
                       
        }
    }

    function checkIsAlive(player){       
        let posHist = player.posHist.slice();
        posHist.reverse();
        for(let x = 1; x<= player.hitFruits;x++){
            if(posHist[x]){
                if(posHist[x][0] === player.x && posHist[x][1] === player.y){
                    player.isAlive=false;
                    clearInterval(_time);
                    timeInterval = startTimeInterval;
                }
            }
        }
    }

    function checkMovesRepeatLast(player){
        let moves = [];
        for(let move of player.posHist){
            //if()
            if(moves.indexOf(move.join(',')) === -1){    
                moves.push(move.join(','))
            }
        }
        return moves.length;
    }

    function calculateDistanceCollision(){
        for(const pid in state.players){
            const player = state.players[pid];
            for(const fid in state.fruits){
                const fruit = state.fruits[fid];
                const fx = fruit.x;
                const fy = fruit.y;
                const px = player.x;
                const py = player.y;
                fruit.sensorCollision.x = (px-fx);
                fruit.sensorCollision.y = (py-fy);
                fruit.sensorCollision.distance = (Math.abs(px-fx)+Math.abs(py-fy));
                //logFruit(fruit.id);
            }
        }
    }

    function calculateDistances(){
        calculateDistanceCollision();
    }

    function logFruit(playerid){
        const player = state.fruits[playerid];
        if(player){
            let d = document.getElementById('distanceScreen_'+player.id);
            if(d) d.innerText=JSON.stringify(player.sensorCollision); 
        }
    }

    function updatePlayerAttributes(player){
        player.moves++;
        player.posHist.push([player.x,player.y]);
        if(player.posHist.length > qtyHistPos){
            player.posHist.splice(0,1);
        }
    }

    function checkCollisionFruit(player){
        for(const fruit in state.fruits){
            const f = state.fruits[fruit];
            if(f.x === player.x && f.y === player.y){
                removeFruit(f.id);
                player.hitFruits++;
                totalFruits = player.hitFruits;

                timeInterval = (timeInterval - 12) < minTimeInterval?minTimeInterval:timeInterval - 12;
                clearInterval(_time);
                startMove();
                //player.moves=0;
            }
        }
    }

    function checkCollisionScreen(player){        
        if(
            player.sensorDistance.screen.t < 0 || 
            player.sensorDistance.screen.r < 0 ||
            player.sensorDistance.screen.l < 0 ||
            player.sensorDistance.screen.b < 0
        ){
            player.isAlive=false;
        }
    }

    function autoMovePlayers(e){
        if(e && e.keyPressed){
            if(e.keyPressed != " "){
                return 
            }
        }
        
        const ids = Object.keys(state.players);
        const idRandom = Math.floor(Math.random()*ids.length);
        const moves = ['ArrowUp','ArrowRight','ArrowDown','ArrowLeft'];

        for(const playerId in state.players){
            let player = state.players[playerId];

            if(state.players[playerId].isAlive){
                //const sensorScreen = player.sensorDistance.screen;
                const fruit = getNearestFruit();
                
                if(fruit){
                    player.sensorCollision = fruit.sensorCollision;
                    //const inputNN = [player.x,player.y,fruit.sensorCollision.x,fruit.sensorCollision.y,fruit.sensorCollision.distance];
                    const inputNN = [fruit.sensorCollision.x,fruit.sensorCollision.y];
                    let resultNN = player.nn.predict(inputNN);
                    let resultPredictIndexMax=(resultNN.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0));
                    let outputNN = [];
                    if(resultPredictIndexMax === 0){
                        outputNN= [1,0,0,0];
                    }else if(resultPredictIndexMax === 1){
                        outputNN = [0,1,0,0];
                    }else if(resultPredictIndexMax === 2){
                        outputNN = [0,0,1,0];
                    }else if(resultPredictIndexMax === 3){
                        outputNN = [0,0,0,1];
                    }

                    movePlayer({playerId,keyPressed:moves[resultPredictIndexMax]});
                

                    player.datasetNN.i.push(inputNN);
                    player.datasetNN.o.push(outputNN);
                }
                           
            } 
        }        
        if(!isFinished) setTimeout(autoMovePlayers,5);

        
    }

    function gameHasFinished(){
        let n=0;
        let totalPlayers = Object.keys(state.players).length;
        for(const p in state.players){
            if(!state.players[p].isAlive){
                n++
            }
        }

        if(n === totalPlayers){
            for(const p in state.players){
                playersGeracaoAtual.push(iterationCopy(state.players[p]));
                delete state.players[p];
            }
            isFinished=true;
            if(totalFruitsRecord < totalFruits){
                totalFruitsRecord = totalFruits
            }
            document.getElementById('recorde').innerText=totalFruitsRecord;
            
            playersGeracaoAtual.sort((a,b) => (a.hitFruits < b.hitFruits) ? 1 : ((b.hitFruits < a.hitFruits) ? -1 : 0)); 
            //playersGeracaoAtual.sort((a,b) => (a.hitFruits < b.hitFruits) ? 1 : ((b.hitFruits < a.hitFruits) ? -1 : 0)); 
            console.log('Acabou',  playersGeracaoAtual);
            datasetTraining = {i:[],o:[]};
            genomes = [];
            for(let x=0;x < playersGeracaoAtual.length;x++){
                const p = playersGeracaoAtual[x];
                if(x < 4){
                    //if(p.sensorCollision.distance < 40){
                        genomes.push(playersGeracaoAtual[x].nn);
                    //}
                }
                
                //console.log('checkMovesRepeatLast',p.posHist,checkMovesRepeatLast(p));
                let inputsRepeat = [];
                for(const x in p.datasetNN.i){
                    let dx = p.datasetNN.i[x][0];
                    let moveX = (dx < 0)?[0,1,0,0]:[0,0,0,1];
                    let dy = p.datasetNN.i[x][1];
                    let moveY = (dy<0)?[0,0,1,0]:[1,0,0,0];

                    let valuesXYABS = [Math.abs(dx),Math.abs(dy)];
                    let maxIndex=(valuesXYABS.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0));
                    let outputs = [moveX,moveY];
                    if(inputsRepeat.indexOf(p.datasetNN.i[x].join(',')) == -1){
                        inputsRepeat.push(p.datasetNN.i[x].join(','));
                        datasetTraining.i.push(p.datasetNN.i[x]);
                        datasetTraining.o.push(outputs[maxIndex]);
                    }
                }

            }
        }else{
            setTimeout(gameHasFinished,1000);
        }
    }

    function isObject(obj) {
        var type = typeof obj;
        
        return type === 'function' || type === 'object' && !!obj;
      };

    function iterationCopy(src) {
        let target = {};
        for (let prop in src) {
            if (src.hasOwnProperty(prop)) {
            if( Array.isArray(src[prop])){
                target[prop] = src[prop];
            }else if (isObject(src[prop])) {
                target[prop] = iterationCopy(src[prop]);
            } else {
                target[prop] = src[prop];
            }
            }
        }
        return target;
    }

    function getIndexByMaxValue(valuesArr){
        return (valuesArr.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0));
    }

    function resetGenome(){
        genomes = [];
        datasetTraining = {i:[],o:[]};
    }

    function getNearestFruit(){
        let fruits = [];
        for(const f in state.fruits){
            fruits.push(state.fruits[f]);
        }
        fruits.sort((a,b) => (a.sensorCollision.distance > b.sensorCollision.distance) ? 1 : ((b.sensorCollision.distance > a.sensorCollision.distance) ? -1 : 0)); 
        return fruits[0];
        
    }

    function removeAllFruits(){
        for(const f in state.fruits){
            removeFruit(f);
        }
    }

    function getTotalFruits(){
        return Object.keys(state.fruits).length;
    }
    function setGeneration(playerSelected, generation){
        let p = state.players[playerSelected];
        p.nn.generation = generation;
    }

    return {
        movePlayer,
        state,
        addPlayer,
        addFruit,
        removeFruit,
        autoMovePlayers,
        gameHasFinished,
        start,
        resetGenome,
        isFinishedGame,
        killAllPlayers,
        calculateDistanceCollision,
        removeAllFruits,
        getTotalFruits,
        loadGenome,
        setGeneration,
        setDirection
    }
}