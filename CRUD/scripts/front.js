'use strict';
//select UX elements
const ID = document.querySelector('input[name="customer"]'),
    F_NAME = document.querySelector('input[name="firstName"]'),
    L_NAME = document.querySelector('input[name="lastName"]'),
    ADDRESS = document.querySelector('input[name="address"]'),
    CITY = document.querySelector('input[name="city"]'),
    PROVINCE = document.querySelector('input[name="province"]'),
    ZIP = document.querySelector('input[name="postal"]'),
    CONTROL_P = document.querySelector('.control-buttons');

let input_fields = [ID, F_NAME, L_NAME, ADDRESS, CITY, PROVINCE, ZIP];

//create helper function to check if object data isn't missing
function isNotEmpty(object) {
    let empty_field = false;
    //check each property on empty
    for (const key in object) {
        if (object[key].trim() === "") {
            empty_field = true;
        }
    }
    return empty_field;
}

//create helper function to form object for request body
function formRequest() {
    let req = {
        id: ID.value,
        First_Name: F_NAME.value,
        Last_Name: L_NAME.value,
        Address: ADDRESS.value,
        City: CITY.value,
        Province: PROVINCE.value,
        ZIP: ZIP.value
    };
    return req;
}

//create post request
async function postRequest() {
    //check that no data's missing
    if (!isNotEmpty(formRequest())) {
        //send post request and receive response if successful/error
        await fetch("/users", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(formRequest())
            })
            .then((res) => res.json())
            .then(json => {
                if (json == 200) {
                    alert("Success");
                } else {
                    //display an error occurred
                    alert(json);
                }
            });
    } else alert('Please fill out all the fields');

}

//create delete request
async function deleteRequest() {
    //check that id field isn't empty
    if (ID.value.trim()) {
        let id = ID.value;
        //ask user to confirm delete process
        let confirm = prompt('If you sure you want to delete record, enter user id again');

        if (id === confirm) {
            await fetch(`/users?id=${ID.value}`, { method: 'DELETE' })
                .then((res) => res.json())
                .then(json => {
                    if (json == 200) {
                        alert("Success");
                        input_fields.map(el => el.value = "");
                    } else {
                        // display if error occurred
                        alert(json);
                    }
                });
        } else alert('IDs do not match');
    }
}

// create put request
async function updateRequest() {
    // check that all inputs have some data 
    if (!isNotEmpty(formRequest())) {

        await fetch("/users", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(formRequest())
            })
            .then((res) => res.json())
            .then(json => {
                if (json == 200) {
                    alert("Success");
                } else {
                    alert(json);
                }
            });
    } else alert('Please fill out all the fields');
}

//create find request for user id
async function getRequest() {
    //check id isn't empty
    if (ID.value.trim()) {
        await fetch(`/users?id=${ID.value}`)
            .then((res) => res.json())
            .then(json => {
                //check that server returned user object and not an error
                if (typeof(json) === 'object') {
                    let index = 0;
                    //fill inputs with corresponding data
                    for (const key in json) {
                        input_fields[index].value = json[key];
                        index++;
                    }
                } else {
                    alert(json);
                    input_fields.map(el => el.value = "");
                }
            });
    } else alert('Please fill out customer field');
};

//hang the listener event on the control div
CONTROL_P.addEventListener('click', (event) => {
    //get click target
    let target = event.target;
    //check if target was button
    switch (target.value) {
        case 'New':
            input_fields.map(el => el.value = "");
            break;
        case 'Add':
            postRequest();
            break;
        case 'Update':
            updateRequest();
            break;
        case 'Delete':
            deleteRequest();
            break;
        case 'Find':
            getRequest();
            break;
        default:
            break;
    }
});