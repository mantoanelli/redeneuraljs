export default function createClickListener(document){
    const state = {
        observers:[]
    }

    function subscribe(observerFunc){
        state.observers.push(observerFunc)
    }

    function unsubscribeAll(){
        state.observers = [];
    }

    function notifyAll(command){
        console.log(`Notifying ${state.observers.length} observers`);
        for(const observerFunc of state.observers){
            observerFunc(command);
        }
    }


    const btnStartGame = document.getElementById('startGame');
    btnStartGame.addEventListener('click',clickStartGame);


    function clickStart(){
        const cmd = {}
        notifyAll(cmd)
    }

    function clickStartGame(){
        const cmd = {action:'startGame'}
        notifyAll(cmd)
    }

    return {
        subscribe,
        unsubscribeAll
    }
}