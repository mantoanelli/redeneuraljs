import RedeNeural from './ia/RedeNeural.js';

export default class Player{
    constructor(color,x,y){
        this.id = 'player_'+Math.floor(Math.random()*1000);
        this.x=(x)?x:0;
        this.y=(y)?y:0;
        this.color=color;
        this.moves=0;
        this.posHist=[];
        this.hitFruits = 18;
        this.sensorDistance = {
            screen:{
                t:0,r:0,b:0,l:0
            }
        }
        this.sensorCollision = {
            x:0,y:0,distance:0
        }
        this.isAlive=true;
        this.isLost=false;
        this.nn = new RedeNeural(2,4,4);
        this.datasetNN = {i:[],o:[],bad:[]}
    }

    
}