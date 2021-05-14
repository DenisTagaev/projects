import IObjectFromToDo from './interfaces/TaskInterface';
import './styles/styles.css';

let TODOLIST: { value: string; checked: boolean; id: number; }[] = [];
const form = document.querySelector('form');
const input = (<HTMLInputElement>document.querySelector('input[name="newTask"]'));
const LIST = document.querySelector('ul.todos');
const showAll = document.querySelector('button.all');
const showActive = document.querySelector('button.active');
const showCompleted = document.querySelector('button.completed');
const clearCompleted = document.querySelector('button.clear');


function addToDo(task: string) {

    if(task.trim().length > 0) {
        const newTask = {
            value: task,
            checked: false,
            id: Date.now(),
        }
        TODOLIST.push(newTask);   
        return newTask;  
    }

}

function renderToDo(task: IObjectFromToDo) {
    localStorage.setItem('ItemsToDo', JSON.stringify(TODOLIST));
    localStorage.setItem(`${task.id}`, `${task.value}`);
   
    const node = document.createElement('li');
    node.setAttribute('data-key', `${task.id}`);
    node.innerHTML = `
        <input id="${task.id}" type="checkbox"></input>
        <label for="${task.id}" class="active-tick"></label>
        <span>${task.value}</span>
        <button class="delete-task"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
      </svg></button>
    `;
    
    LIST.append(node);
    // checkOnExist(task.id, node);
    removeToDo(node);
}

// function checkOnExist(id: number, node: Node) {
//     let item = document.querySelector(`[data-key='${id}']`)
    
//     if(item) {
//         LIST.replaceChild(node, item);
//     } else {
//         LIST.append(node)
//     }
// }

function markCompleted(key: string) {
    let done = LIST.querySelector(`li[data-key='${key}'`);
    done.children[2].classList.toggle('completed');
}

LIST.addEventListener('click', e => {
    if((e.target as HTMLElement).classList.contains('active-tick')) {
        const itemKey = (e.target as HTMLElement).parentElement.dataset.key;
        // let done = LIST.querySelector(`li[data-key='${itemKey}'`);
        // let text = done.children[2];
        // text.classList.toggle('completed');
        markCompleted(itemKey);
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('ItemsToDo');
    if (ref) {
      TODOLIST = JSON.parse(ref);
      TODOLIST.forEach(t => {
        renderToDo(t);
      });
    }
  });
  

form.addEventListener('submit', e => {
    e.preventDefault();
    renderToDo(addToDo(input.value));
    input.value = '';
})

function removeToDo(element: HTMLElement) {
    let Delbutton = element.querySelector('.delete-task');
    Delbutton.addEventListener('click', e => {
        element.remove();
        localStorage.removeItem(element.dataset.key);
        let stored = JSON.parse(localStorage.ItemsToDo);

        for ( let i = 0; i < stored.length; i++ ) {
            if ( stored[i].id == `${element.dataset.key}` ) {
                stored.splice(i,1); 
            }
        }

        localStorage.ItemsToDo = JSON.stringify(stored);
    })
    return Delbutton;
}

showAll.addEventListener('click', e => {
    let todos = Array.from(document.querySelectorAll('li'));
    
    todos.forEach( e => {
        e.classList.remove('hide');
    })
});

showCompleted.addEventListener('click', e => {    
    let todos = Array.from(document.querySelectorAll('li'));
    
    for(let i = 0; i < todos.length; i++) {

        if(!todos[i].children[2].classList.contains('completed')) {
           todos[i].classList.add('hide');
        } else {
            todos[i].classList.remove('hide');
        }
    
    }
})

function selectLi(decider: boolean) {
    let todos = Array.from(document.querySelectorAll('li'));
    
    for(let i = 0; i < todos.length; i++) {

        if(!todos[i].children[2].classList.contains('completed')) {
           todos[i].classList.add('hide')
        } else {
            todos[i].classList.remove('hide');
        }
    }
}

showActive.addEventListener('click', e => {
    let todos = Array.from(document.querySelectorAll('li'));
    
    for(let i = 0; i < todos.length; i++) {

        if(todos[i].children[2].classList.contains('completed')) {
           todos[i].classList.toggle('hide')
        } else {
            todos[i].classList.remove('hide');
        }
    }
})

clearCompleted.addEventListener('click', e => {
    let todos = Array.from(document.querySelectorAll('li'));
    for(let i = 0; i < todos.length; i++) {

        if(todos[i].children[2].classList.contains('completed')) {
           todos[i].remove();
           localStorage.removeItem(todos[i].dataset.key);
            let stored = JSON.parse(localStorage.ItemsToDo);

            for ( let i = 0; i < stored.length; i++ ) {
                if ( stored[i].id == `${todos[i].dataset.key}` ) {
                    stored.splice(i,1); 
                }
            }

            localStorage.ItemsToDo = JSON.stringify(stored);
        }
    }
})