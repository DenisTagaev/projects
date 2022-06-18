import IObjectFromToDo from './interfaces/TaskInterface';
import updateCounter from '../src/updaters/updateCounter';
import updateList from './updaters/updateToDoList';
import selectAllExistingLis from '../src/selectors/dynamicSelector';
import makeElementsVisible from '../src/updaters/updateVisibility';
import './styles/styles.css';
import * as selectors from '../src/selectors/selectors';

export let ToDoList: { value: string; checked: boolean; id: number; }[] = [];

function renderToDo(task: IObjectFromToDo) {
    localStorage.setItem('ItemsToDo', JSON.stringify(ToDoList));
   
    const NODE : HTMLLIElement = document.createElement('li');
    NODE.setAttribute('data-key', `${task.id}`);
    NODE.innerHTML = `
        <input id="${task.id}" type="checkbox"></input>
        <label for="${task.id}" class="active-tick"></label>
        <span>${task.value}</span>
        <button class="delete-task"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
      </svg></button>
    `;

    if(task.checked) {
        (<HTMLInputElement>NODE.children[0]).checked = true;
        NODE.children[2].classList.add('completed');
    }

    selectors.LIST.append(NODE);
    removeToDo(NODE);
    updateCounter();
}

//function adds task to the array 
function addToDo(task: string) {
//if the input isn't blank pushes task to the storage
    if(task.trim().length > 0) {
        const NewTask : {value: string, checked: boolean, id : number} = {
            value: task,
            checked: false,
            id: Date.now(),
        };
        ToDoList.push(NewTask);
        return NewTask;  
    }

}

function removeToDo(element: HTMLElement) {
    let Delbutton : HTMLButtonElement = element.querySelector('.delete-task');
    
    Delbutton.addEventListener('click', () => {
        updateList(element);
        updateCounter();

        if(!document.querySelector('span.completed')) {
            selectors.ClearCompleted.classList.add('hidden');
        }
    });

    return Delbutton;
}

function selectClassifiedLi(todos: Array<HTMLElement>, decider: boolean) {
    
    for(let i : number = 0; i < todos.length; i++) {

        if(todos[i].children[2].classList.contains('completed') === decider) {
           todos[i].classList.add('hidden');
        } else {
            todos[i].classList.remove('hidden');
        }
    }
}

function markToDoCompleted(key: string) {
    let done : HTMLLIElement = selectors.LIST.querySelector(`li[data-key='${key}'`);
    done.children[2].classList.toggle('completed');

    const INDEX : number = ToDoList.findIndex(el => el.id == Number(key));
    ToDoList[INDEX].checked = !ToDoList[INDEX].checked;
    localStorage.setItem('ItemsToDo', JSON.stringify(ToDoList));

    updateCounter();
}

//on page load function checks tasks in local storage
document.addEventListener('DOMContentLoaded', () => {
    const LoadItems : string = localStorage.getItem('ItemsToDo');
    //if any task exists, function renders it on the page
    if (LoadItems) {
        ToDoList = JSON.parse(LoadItems);
        ToDoList.forEach(t => renderToDo(t));
    }
    //then updates number of tasks left
    updateCounter();
});

selectors.FORM.addEventListener('submit', e => {
    //preventing reload of the page
    e.preventDefault();
    //adding the task to storage and rendering on the page
    renderToDo(addToDo(selectors.INPUT.value));
    // sets the input to blank
    selectors.INPUT.value = '';
    //opens the control panel if not open
    makeElementsVisible(selectors.ButtonsList);
});

selectors.LIST.addEventListener('click', e => {

    if((e.target as HTMLElement).classList.contains('active-tick')) {
        const KEY = (e.target as HTMLElement).parentElement.dataset.key;
        markToDoCompleted(KEY);
    }
});

selectors.ShowAll.addEventListener('click', () => {
    // let todos = Array.from(document.querySelectorAll('li'));
    let liElems : Array<HTMLLIElement> = selectAllExistingLis();
    // console.log(liElems, todos);
    // makeElementsVisible(selectAllExistingLis() as unknown as NodeListOf<Element>)
    liElems.forEach(e => e.classList.remove('hidden'));
});

selectors.ShowActive.addEventListener('click', () => {
    selectClassifiedLi(selectAllExistingLis(), true)
});

selectors.ShowCompleted.addEventListener('click', () => {    
    selectClassifiedLi(selectAllExistingLis(), false)
})


selectors.ClearCompleted.addEventListener('click', () => {
    let todos : Array<HTMLLIElement> = selectAllExistingLis();
    
    for(let i :number = 0; i < todos.length; i++) {
        if(todos[i].children[2].classList.contains('completed')) {
            updateList(todos[i]);
        }
    }
    selectors.ClearCompleted.classList.add('hidden');
});

selectors.BtnCollapse.addEventListener('click', () => {
    selectors.BtnCollapse.classList.toggle('open');
    selectors.LIST.classList.toggle('hidden');
});