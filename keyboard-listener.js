export default function createKeyBoardListener(document,playerSelected){
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

    document.addEventListener('keydown',handleKey);

    function handleKey(e){
        const keyPressed = e.key;
        const cmd = {
            playerId:playerSelected,
            keyPressed
        }
        notifyAll(cmd)
        //game.movePlayer(cmd);
    }

    return {
        subscribe,
        unsubscribeAll
    }
}