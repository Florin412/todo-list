const form = document.querySelector("#new-todo-form")
const todoInput = document.querySelector("#todo-input")
const list = document.querySelector("#list")
const template = document.querySelector("#list-item-template")
const LOCAL_STORAGE_PREFIX = "ADVANCED_TODO_LIST"
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`

// Get the array of object saved in Local Storage
let todos = loadTodos()

todos.forEach(renderTodo)

// Save the status of the checkbox that was changed
list.addEventListener("change", (e) => {
  if (!e.target.matches("[data-list-item-checkbox]")) return

  const parent = e.target.closest(".list-item")
  const todoId = parent.dataset.todoId
  const todo = todos.find((t) => t.id === todoId)
  todo.complete = e.target.checked
  saveTodos()
})

// Delete the todo from browser page and Local Storage
list.addEventListener("click", (e) => {
  if (!e.target.matches("[data-button-delete]")) return

  const parent = e.target.closest(".list-item")
  const todoId = parent.dataset.todoId
  parent.remove()
  todos = todos.filter((todo) => todo.id !== todoId)
  saveTodos()
})

// Create the todo when submit button is pressed
form.addEventListener("submit", (e) => {
  e.preventDefault()

  const todoName = todoInput.value
  if (todoName === "") return

  const newTodo = {
    name: todoName,
    complete: false,
    id: new Date().valueOf().toString()
  }

  todos.push(newTodo)
  renderTodo(newTodo)
  saveTodos()
  todoInput.value = ""
})

function renderTodo(todo) {
  const templateClone = template.content.cloneNode(true)
  const listItem = templateClone.querySelector(".list-item")
  listItem.dataset.todoId = todo.id
  const textElement = templateClone.querySelector("[data-list-item-text]")
  textElement.innerText = todo.name
  const checkbox = templateClone.querySelector("[data-list-item-checkbox]")
  checkbox.checked = todo.complete
  list.appendChild(templateClone)
}

function loadTodos() {
  const todosString = localStorage.getItem(TODOS_STORAGE_KEY)
  return JSON.parse(todosString) || []
}

function saveTodos() {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
}
