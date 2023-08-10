const input = document.getElementById("input-todo");
const add_btn = document.getElementById("btn");
const complete_all = document.getElementById("complete");
const clear_completed = document.getElementById("clear-completed");
const todos = document.getElementById("todos");
const tasks_left_count = document.getElementById("task-left");
const dropdown_content = document.getElementById("drp-cnt");
const all_filter = document.getElementById("all");
all_filter.style.color = "rgb(76, 160, 172)"


let Mytodos = JSON.parse(localStorage.getItem("TODOS")) || [];
let interval;
let edit_id = null;

// listening for todos
function startExecution() {
    add_btn.addEventListener("click", handleClickToAdd);
    document.addEventListener("click", handleClickEvents);
    renderTodos();
}

startExecution();

// for add todo icon
input.addEventListener("focus", () => {
    clearTimeout(interval)
    add_btn.innerHTML = `<i class="fa-solid fa-circle-plus"></i>`;
    add_btn.style.display = "block";
})
input.addEventListener("blur", () => {
    interval = setTimeout(() => {
        add_btn.style.display = "none";
    }, 1000);
})

function handleClickToAdd(e) {
    e.preventDefault();
    if (input.value.trim()) {
        if (edit_id == null) {
            let todo = input.value;
            addTodo(todo);
            input.value = "";
        }
        else {
            Mytodos.map(todo => {
                if (todo.id == edit_id) {
                    todo.text = input.value;
                }
                return todo;
            })
            input.value = "";
            localStorage.setItem("TODOS", JSON.stringify(Mytodos));
            edit_id = null;
            renderTodos();
        }
    }

}

// handling all click events
function handleClickEvents(e) {
    // console.log(e.target)
    if (e.target.className == "delete-img") {
        const id = e.target.id;
        deleteTodo(id);
    }
    if (e.target.className == "edit-img") {
        const id = e.target.id;
        editTodo(id);
    }
    if (e.target.className == "check-box") {
        const id = e.target.id;
        toggleStatus(id);
    }
    if (e.target.className == "completeAll") {
        commpleteAllTodos();
    }
    if (e.target.className == "clear") {
        clearCompleted();
    }
    if (e.target.id == "all" || e.target.id == "completed" || e.target.id == "uncompleted") {
        let filter = e.target.id;
        filterTodos(filter);
    }
    // for smaller screens
    if (e.target.className == "dropbtn" || e.target.className == "fa-solid fa-caret-down") {
        dropdown_content.style.display = "block"
    }
    else {
        dropdown_content.style.display = "none"
    }
}

// rendering the app
function renderTodos(todosRender = Mytodos) {
    let count = 0;
    if (todosRender.length > 0) {
        let str = "";
        todosRender.map(item => {
            if (!item.done) {
                count += 1;
            }
            str += `
            <li>
                <input type="checkbox" id=${item.id} ${item.done ? "checked" : null} class="check-box"/>
                <label for=${item.id}>${item.text}</label>
                <div id="edit"><img src="./images/edit.png"  alt="edit" class="edit-img" id=${item.id} /> </div>
                <div id="delete"><img src="./images/delete.png" alt="delete" class="delete-img" id=${item.id} /></div>
            </li>
            `
        })
        todos.innerHTML = str;
    }
    else {
        todos.innerHTML = `<h3>No Todos added!</h3>`
    }
    tasks_left_count.innerHTML = `${count} task left`
}

// adding todos
function addTodo(todo) {
    const list = {
        text: todo,
        id: Date.now().toString(),
        done: false,
    }
    Mytodos.push(list);
    localStorage.setItem("TODOS", JSON.stringify(Mytodos));
    renderTodos();
}

// delete todos
function deleteTodo(id) {
    let updatedTodos = Mytodos.filter(todo => todo.id != id);
    Mytodos = updatedTodos;
    localStorage.setItem("TODOS", JSON.stringify(Mytodos));
    renderTodos();
}

// edit todo
function editTodo(id) {
    edit_id = id;
    let editTodo = Mytodos.filter(todo => todo.id == id);
    input.value = editTodo[0].text;
    input.focus();
    add_btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>`
}

// toggle todo status
function toggleStatus(id) {
    Mytodos.map(todo => {
        if (todo.id == id) {
            todo.done = !todo.done;
        }
    })
    localStorage.setItem("TODOS", JSON.stringify(Mytodos));
    renderTodos();
}

// complete all todos
function commpleteAllTodos() {
    Mytodos.map(todo => {
        todo.done = true;
    })
    localStorage.setItem("TODOS", JSON.stringify(Mytodos));
    renderTodos();
}

// delete all completed
function clearCompleted() {
    const updatedTodos = Mytodos.filter(todo => todo.done != true);
    Mytodos = updatedTodos;
    localStorage.setItem("TODOS", JSON.stringify(Mytodos));
    renderTodos();
}

// filters - All ,Uncompleted, Completed
function filterTodos(filter) {
    // initial colors
    document.getElementById("uncompleted").style.color = "#63605d";
    document.getElementById("completed").style.color = "#63605d";
    document.getElementById("all").style.color = "#63605d";

    // when a filter is selected
    if (filter == "uncompleted") {
        const updatedTodos = Mytodos.filter(todo => todo.done != true);
        document.getElementById("uncompleted").style.color = "rgb(76, 160, 172)"
        renderTodos(updatedTodos);
    }
    else if (filter == "completed") {
        const updatedTodos = Mytodos.filter(todo => todo.done == true);
        document.getElementById("completed").style.color = "rgb(76, 160, 172)"
        renderTodos(updatedTodos);
    }
    else {
        document.getElementById("all").style.color = "rgb(76, 160, 172)";
        renderTodos();
    }
}
