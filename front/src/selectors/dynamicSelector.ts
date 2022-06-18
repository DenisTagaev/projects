//function selects all current list items on the page and returns an array
export default function selectAllExistingLis() {
    return Array.from(document.querySelectorAll('li'));
}