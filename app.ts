const BASE_URL: string = 'https://jsonplaceholder.typicode.com/'
const selectElm: HTMLSelectElement | null = document.querySelector('select')
const todosContainer: HTMLDivElement = document.querySelector('.todos')!


const getUsers = async (): Promise<void> => {
    try {
        const res: Response = await fetch(BASE_URL + 'users')
        const users: User[] = await res.json()
        for (const user of users) {
            const opt: HTMLOptionElement = document.createElement('option')
            opt.value = user.id.toString()
            opt.textContent = `${user.name} (${user.username})`
            selectElm?.appendChild(opt)
        }
    } catch (err) {
        console.log(err)
    }
}

const btnUpdatingListener = async(e : MouseEvent) : Promise<void> =>{
    try{
        const button = e.currentTarget as HTMLDivElement;
        const parentElement = button.parentElement;
        const id = parentElement?.id
        // const parentId = (e.currentTarget as HTMLDivElement).parentElement?.id;
        const res: Response = await fetch(`${BASE_URL}todos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                completed : true
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })

          if(!res.ok){throw new Error('There was a problem contacting the server')}
          console.log('The update was performed successfully');
          button.textContent = 'Mission accomplished';
          button.classList.add('btnDone')
          button.removeEventListener('click', btnUpdatingListener)
          button.setAttribute('data-disabled', 'true');


    }
    catch (err){
        console.log(err)
    }
}


const createTodoDiv = (arr:Todo[]) : void =>{
    todosContainer.textContent = ''
    for (const element of arr) {
        const row = document.createElement('div')
        row.classList.add('toDoRow')
        row.id = element.id.toString()
        const p = document.createElement('p')
        p.textContent = element.title
        row.appendChild(p)
        const btnUpdating = document.createElement('div')
        btnUpdating.textContent = 'Mark as done'
        if(!element.completed){
            btnUpdating.addEventListener('click', (e : MouseEvent) => btnUpdatingListener(e))
            btnUpdating.classList.add('btnUpdating')
        }
        else{
            btnUpdating.textContent = 'Mission accomplished'
            btnUpdating.classList.add('btnDone')
            btnUpdating.setAttribute('data-disabled', 'true');
        }

        row.appendChild(btnUpdating)
        todosContainer.appendChild(row)
    }

}

const getTodoByUser = async (e:InputEvent): Promise<void> => {
    try {
        const res = await fetch(`${BASE_URL}todos?userId=${(e.target as HTMLSelectElement).value}`)
        const todos = await res.json()
        createTodoDiv(todos)
    } catch (err) {
        
    }
}

selectElm?.addEventListener('change', e => getTodoByUser(e as InputEvent))

getUsers()



interface User {
    id: number
    name: string
    username: string
    email: string
    address: {
        street: string
        suite: string
        city: string
        zipcode: string
        geo: {
            lat: string
            lng: string
        }
    }
    phone: string
}

interface Todo {
    userId : number,
    id : number,
    title : string,
    completed : boolean
}