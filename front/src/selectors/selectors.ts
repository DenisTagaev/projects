//main form element
const FORM : HTMLFormElement = document.querySelector('form') ;
//retrieving the input from the form
const INPUT : HTMLInputElement = (<HTMLInputElement>document.querySelector('input[name="newTask"]'));
//get the list container of todos
const LIST : HTMLUListElement = document.querySelector('ul.todos');
//button to hide the todo items
const BtnCollapse : HTMLButtonElement = document.querySelector('.collapse');
//button to show both done/undone tasks
const ShowAll : HTMLButtonElement = document.querySelector('button.all');
//button to show undone tasks
const ShowActive : HTMLButtonElement = document.querySelector('button.active');
// button to show done tasks
const ShowCompleted : HTMLButtonElement = document.querySelector('button.completed');
//button to delete tasks from storage
const ClearCompleted : HTMLButtonElement = document.querySelector('button.clear');
//all controlling buttons of the page
const ButtonsList : NodeListOf<Element> = document.querySelectorAll('button.main');
//element showing current number of tasks
const TASKS : HTMLElement = document.querySelector('.nTasks');
//footer of the todos container
const FooterTodos : HTMLHtmlElement = document.querySelector('.todos-footer')

export {FORM, INPUT, LIST, BtnCollapse, ShowAll, ShowActive, ShowCompleted, ClearCompleted, ButtonsList, TASKS, FooterTodos};