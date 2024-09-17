"use strict";
const BASE_URL = 'https://jsonplaceholder.typicode.com/';
const selectElm = document.querySelector('select');
const todosContainer = document.querySelector('.todos');
const getUsers = async () => {
    try {
        const res = await fetch(BASE_URL + 'users');
        const users = await res.json();
        for (const user of users) {
            const opt = document.createElement('option');
            opt.value = user.id.toString();
            opt.textContent = `${user.name} (${user.username})`;
            selectElm === null || selectElm === void 0 ? void 0 : selectElm.appendChild(opt);
        }
    }
    catch (err) {
        console.log(err);
    }
};
const btnUpdatingListener = async (e) => {
    try {
        const button = e.currentTarget;
        const parentElement = button.parentElement;
        const id = parentElement === null || parentElement === void 0 ? void 0 : parentElement.id;
        // const parentId = (e.currentTarget as HTMLDivElement).parentElement?.id;
        const res = await fetch(`${BASE_URL}todos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                completed: true
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (!res.ok) {
            throw new Error('There was a problem contacting the server');
        }
        console.log('The update was performed successfully');
        button.textContent = 'Mission accomplished';
        button.classList.add('btnDone');
        button.removeEventListener('click', btnUpdatingListener);
        button.setAttribute('data-disabled', 'true');
    }
    catch (err) {
        console.log(err);
    }
};
const createTodoDiv = (arr) => {
    todosContainer.textContent = '';
    for (const element of arr) {
        const row = document.createElement('div');
        row.classList.add('toDoRow');
        row.id = element.id.toString();
        const p = document.createElement('p');
        p.textContent = element.title;
        row.appendChild(p);
        const btnUpdating = document.createElement('div');
        btnUpdating.textContent = 'Mark as done';
        if (!element.completed) {
            btnUpdating.addEventListener('click', (e) => btnUpdatingListener(e));
            btnUpdating.classList.add('btnUpdating');
        }
        else {
            btnUpdating.textContent = 'Mission accomplished';
            btnUpdating.classList.add('btnDone');
            btnUpdating.setAttribute('data-disabled', 'true');
        }
        row.appendChild(btnUpdating);
        todosContainer.appendChild(row);
    }
};
const getTodoByUser = async (e) => {
    try {
        const res = await fetch(`${BASE_URL}todos?userId=${e.target.value}`);
        const todos = await res.json();
        createTodoDiv(todos);
    }
    catch (err) {
    }
};
selectElm === null || selectElm === void 0 ? void 0 : selectElm.addEventListener('change', e => getTodoByUser(e));
getUsers();
