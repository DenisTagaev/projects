import {ToDoList} from '../main';
import updateLocalStorage from '../updaters/updLocalStorage';

export default function updateList(goal: HTMLElement) {
    const INDEX :number = ToDoList.findIndex(el => el.id == Number(goal.dataset.key));
    ToDoList.splice(INDEX, 1);
    updateLocalStorage(goal);
}