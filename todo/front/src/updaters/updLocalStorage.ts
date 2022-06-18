import IObjectFromToDo from "../interfaces/TaskInterface";
//function deletes element from tasks on the page
export default function updateLocalStorage(el: HTMLElement) {
    el.remove();
    localStorage.removeItem(el.dataset.key);
        let stored : Array<IObjectFromToDo> = JSON.parse(localStorage.ItemsToDo);
        //then trying to find it in local storage, if exists removes the task
        for ( let i : number = 0; i < stored.length; i++ ) {
            if ( stored[i].id == Number(el.dataset.key) ) {
                stored.splice(i,1); 
            }
        }

    localStorage.ItemsToDo = JSON.stringify(stored);
}