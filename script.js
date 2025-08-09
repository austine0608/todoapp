// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    updateTaskCount();
});

// Add todo
addBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text);
        todoInput.value = '';
        todoInput.focus();
    }
});

// Add todo with Enter key
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const text = todoInput.value.trim();
        if (text) {
            addTodo(text);
            todoInput.value = '';
            todoInput.focus();
        }
    }
});

// Delete todo
todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = parseInt(e.target.parentElement.dataset.id);
        deleteTodo(id);
    }
});

// Toggle todo completion
todoList.addEventListener('change', (e) => {
    if (e.target.classList.contains('todo-checkbox')) {
        const id = parseInt(e.target.parentElement.dataset.id);
        toggleTodo(id);
    }
});

// Clear completed todos
clearCompletedBtn.addEventListener('click', () => {
    clearCompletedTodos();
});

// Filter todos
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Functions
function addTodo(text) {
    const newTodo = {
        id: Date.now(),
        text,
        completed: false
    };
    todos.push(newTodo);
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? {...todo, completed: !todo.completed} : todo
    );
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function clearCompletedTodos() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateTaskCount() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    taskCount.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} remaining`;
}

function renderTodos() {
    // Filter todos based on current filter
    let filteredTodos = [];
    if (currentFilter === 'all') {
        filteredTodos = todos;
    } else if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    // Render todos
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">No tasks found</li>';
        return;
    }

    todoList.innerHTML = '';
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.dataset.id = todo.id;
        todoItem.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">✕</button>
        `;
        todoList.appendChild(todoItem);
    });
}