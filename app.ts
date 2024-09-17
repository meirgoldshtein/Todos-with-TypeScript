const BASE_URL: string = 'https://jsonplaceholder.typicode.com/'
const selectElm: HTMLSelectElement | null = document.querySelector('select')
const todosContainer: HTMLDivElement = document.querySelector('.todos')!
const btnMood = document.querySelector('#btnMood') as HTMLButtonElement
const input = document.querySelector('#input') as HTMLInputElement
const btnPost = document.querySelector('#btnPost') as HTMLButtonElement
let ShowMood : string = 'todos'


const writePost = async ( e : MouseEvent):Promise<void> =>{
    try{
        if(input.value == ''){
            console.log('You can not write an empty post')
            throw new Error('You can not write an empty post')
        }
        if((selectElm as HTMLSelectElement).value == ''){
            console.log('You must choose a user')
            throw new Error('You must choose a user')
        }
        const newPost : Post = {
            title: 'newPost',
            body: input.value,
            userId:Number((selectElm as HTMLSelectElement).value),
        }

        const res = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
        const data = await res.json()
        console.log(data)
    }catch(err){
        console.log(err)
    }
}


const changeShowMood = ( e : MouseEvent):void =>{
    if(ShowMood == 'todos')
    {
        ShowMood = 'posts';
        (e.currentTarget as HTMLButtonElement).textContent = 'Posts Mood'
         
    }
    else{
        ShowMood = 'todos';
        (e.currentTarget as HTMLButtonElement).textContent = 'Todos Mood'

    }
     
}





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

const createPostDiv = (arr : Post[]): void =>{
    todosContainer.textContent = ''
    for (const element of arr) {
        const row = document.createElement('div')
        row.classList.add('toDoRow')
        row.id = element.id? element.id.toString() : ''
        const title = document.createElement('h3')
        title.textContent = element.title
        row.appendChild(title)
        const p = document.createElement('p')
        p.textContent = element.body
        row.appendChild(p)
        const btnEdit = document.createElement('div')
        todosContainer.appendChild(row)
    }
}


const Render = (arr: data[]): void =>{
    if(ShowMood == 'todos' && arr.length > 0 && 'completed' in arr[0])
    {
        createTodoDiv(arr as Todo[])
    }
    else if (ShowMood == 'posts' && arr.length > 0 && 'body' in arr[0])
    {
        createPostDiv(arr as Post[])
    }

}


const getDataByUser = async <T>(e: T): Promise<void> => {
    try {
        const res = await fetch(`${BASE_URL}${ShowMood}?userId=${(selectElm as HTMLSelectElement).value}`)
        const todos = await res.json()
        Render(todos)
    } catch (err) {
        
    }
}


btnPost.addEventListener('click', (e: MouseEvent) => {writePost(e); input.value = ''} )
selectElm?.addEventListener('change', e => getDataByUser(e as InputEvent))
btnMood?.addEventListener('click', changeShowMood)
btnMood?.addEventListener('click', e => getDataByUser(e as MouseEvent))
getUsers()


type data = Todo | Post
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

interface Post{
    userId: number,
    id?: number,
    title: string,
    body: string
}