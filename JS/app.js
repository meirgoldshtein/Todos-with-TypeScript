"use strict";
const BASE_URL = 'https://jsonplaceholder.typicode.com/';
const selectElm = document.querySelector('select');
const todosContainer = document.querySelector('.todos');
const btnMood = document.querySelector('#btnMood');
const input = document.querySelector('#input');
const btnPost = document.querySelector('#btnPost');
let ShowMood = 'todos';
const writePost = async (e) => {
    try {
        if (input.value == '') {
            console.log('You can not write an empty post');
            throw new Error('You can not write an empty post');
        }
        if (selectElm.value == '') {
            console.log('You must choose a user');
            throw new Error('You must choose a user');
        }
        const newPost = {
            title: 'newPost',
            body: input.value,
            userId: Number(selectElm.value),
        };
        const res = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const data = await res.json();
        console.log(data);
    }
    catch (err) {
        console.log(err);
    }
};
const changeShowMood = (e) => {
    if (ShowMood == 'todos') {
        ShowMood = 'posts';
        e.currentTarget.textContent = 'Posts Mood';
    }
    else {
        ShowMood = 'todos';
        e.currentTarget.textContent = 'Todos Mood';
    }
};
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
const createPostDiv = (arr) => {
    todosContainer.textContent = '';
    for (const element of arr) {
        const row = document.createElement('div');
        row.classList.add('toDoRow');
        row.id = element.id ? element.id.toString() : '';
        const title = document.createElement('h3');
        title.textContent = element.title;
        row.appendChild(title);
        const p = document.createElement('p');
        p.textContent = element.body;
        row.appendChild(p);
        const btnEdit = document.createElement('div');
        todosContainer.appendChild(row);
    }
};
const Render = (arr) => {
    if (ShowMood == 'todos' && arr.length > 0 && 'completed' in arr[0]) {
        createTodoDiv(arr);
    }
    else if (ShowMood == 'posts' && arr.length > 0 && 'body' in arr[0]) {
        createPostDiv(arr);
    }
};
const getDataByUser = async (e) => {
    try {
        const res = await fetch(`${BASE_URL}${ShowMood}?userId=${selectElm.value}`);
        const todos = await res.json();
        Render(todos);
    }
    catch (err) {
    }
};
btnPost.addEventListener('click', (e) => { writePost(e); input.value = ''; });
selectElm === null || selectElm === void 0 ? void 0 : selectElm.addEventListener('change', e => getDataByUser(e));
btnMood === null || btnMood === void 0 ? void 0 : btnMood.addEventListener('click', changeShowMood);
btnMood === null || btnMood === void 0 ? void 0 : btnMood.addEventListener('click', e => getDataByUser(e));
getUsers();
