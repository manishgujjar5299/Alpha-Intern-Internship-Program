const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filters = document.querySelectorAll('.filters button');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed'); // Correct ID

let todos = [];
let activeFilter = 'all';

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});

filters.forEach(filter => {
    filter.addEventListener('click', function() {
        activeFilter = filter.id.replace('-btn', '');
        updateFilters();
    });
});

clearCompletedBtn.addEventListener('click', clearAll); // Corrected reference

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText) {
        const todoItem = createTodoItem(todoText);
        todos.push({ text: todoText, completed: false });
        todoList.appendChild(todoItem);
        todoInput.value = '';
        updateItemsLeft();
    }
}

function createTodoItem(text) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = text;
    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
    completeBtn.addEventListener('click', toggleComplete);
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', deleteTodo.bind(null, li));
    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    return li;
}

function toggleComplete(event) {
    const li = event.target.parentElement;
    const index = Array.from(todoList.children).indexOf(li);
    todos[index].completed = !todos[index].completed;
    li.classList.toggle('completed');
    updateItemsLeft();
}

function deleteTodo(li) {
    const index = Array.from(todoList.children).indexOf(li);
    todos.splice(index, 1);
    todoList.removeChild(li);
    updateItemsLeft();
}

function clearAll() {
    todos = [];
    todoList.innerHTML = '';
    updateItemsLeft();
}

function updateFilters() {
    filters.forEach(filter => {
        filter.classList.remove('active');
    });
    const activeFilterBtn = document.getElementById(`${activeFilter}-btn`);
    if (activeFilterBtn) {
        activeFilterBtn.classList.add('active');
    }
    applyFilter();
}

function applyFilter() {
    todoList.innerHTML = '';
    const filteredTodos = todos.filter(todo => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'active') return !todo.completed;
        if (activeFilter === 'completed') return todo.completed;
    });
    filteredTodos.forEach(todo => {
        const todoItem = createTodoItem(todo.text);
        if (todo.completed) {
            todoItem.classList.add('completed');
        }
        todoList.appendChild(todoItem);
    });
}

function updateItemsLeft() {
    const activeTodosCount = todos.filter(todo => !todo.completed).length;
    itemsLeft.textContent = `${activeTodosCount} items left`;
}


// Add swipe-to-delete event listeners
let xDown = null;

todoList.addEventListener('touchstart', handleTouchStart, false);        
todoList.addEventListener('touchmove', handleTouchMove, false);

function handleTouchStart(event) {
    const firstTouch = event.touches[0];                                      
    xDown = firstTouch.clientX;                                      
};                                                

function handleTouchMove(event) {
    if (!xDown) {
        return;
    }

    let xUp = event.touches[0].clientX;                                      
    let xDiff = xUp - xDown;

    if (xDiff > 0) {
        // Swipe left, delete the todo item
        const li = event.target.parentElement;
        deleteTodo(li);
    } 

    xDown = null;
};

// Remaining code remains unchanged