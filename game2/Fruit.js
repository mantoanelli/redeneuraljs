import RedeNeural from './ia/RedeNeural.js';
export default class Fruit{
    constructor(color,x,y){
        this.id = 'fruit_'+Math.floor(Math.random()*1000);
        this.x=(x)?x:0;
        this.y=(y)?y:0;
        this.color=color;
        this.isAlive=true;
        this.isLost=false;
        this.nn = new RedeNeural(4,8,5);
        this.datasetNN = {i:[],o:[],bad:[]}
        this.sensorCollision = {
            x:0,y:0,distance:0
        }
    }
}