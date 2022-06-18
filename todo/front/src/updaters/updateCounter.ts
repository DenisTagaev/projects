import {ClearCompleted, TASKS, ButtonsList, BtnCollapse, FooterTodos} from '../selectors/selectors';
import selectAllExistingLis from '../selectors/dynamicSelector';
import makeElementsVisible from '../updaters/updateVisibility';

export default function updateCounter() {
    //counting the number of tasks on the page
    let count: number = selectAllExistingLis().length;
    let list : Array<HTMLLIElement> = selectAllExistingLis();
    
    for( let i :number = 0; i < list.length; i++) {

        if(list[i].children[2].classList.contains('completed')) {
            count --;
            ClearCompleted.classList.remove('hidden');
        } else if(!document.querySelector('span.completed')) {
            ClearCompleted.classList.add('hidden');
        }
    }
    
    if(count === 0) {
        TASKS.classList.add('hidden');
        ButtonsList.forEach(e => e.classList.add('hidden'));
        // footerTodos.classList.add('hidden');
    } else {
        if(count === 1) {
            TASKS.innerHTML = `${count} task left`;
        } else {
           TASKS.innerHTML = `tasks left: ${count}`; 
        }
        TASKS.classList.remove('hidden');
        FooterTodos.classList.remove('hidden');
        
        makeElementsVisible(ButtonsList);
    }

    if(list.length > 0) {
        BtnCollapse.classList.remove('hidden');
    } else {
        FooterTodos.classList.add('hidden');
    }
}