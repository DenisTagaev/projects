//function makes control group elements visible(buttons,tasks,count)
export default function makeElementsVisible(elements: NodeListOf<Element>) {
    elements.forEach(e => e.classList.remove('hidden'));
}