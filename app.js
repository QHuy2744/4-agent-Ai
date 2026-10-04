document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const taskCounter = document.getElementById('task-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const dateDisplay = document.getElementById('date-display');

    // State
    let todos = [];
    let currentFilter = 'all';

    // Display current date nicely
    const updateDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateDisplay.textContent = today.toLocaleDateString('vi-VN', options);
    };
    updateDate();

    // Load todos from localStorage
    const loadTodos = () => {
        try {
            const stored = localStorage.getItem('android_todos');
            if (stored) {
                todos = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Lỗi khi đọc localStorage:', error);
            todos = [];
        }
    };

    // Save todos to localStorage
    const saveTodos = () => {
        try {
            localStorage.setItem('android_todos', JSON.stringify(todos));
        } catch (error) {
            console.error('Lỗi khi lưu localStorage:', error);
        }
    };

    // Add new todo
    const addTodo = (text) => {
        const newTodo = {
            id: Date.now(),
            text: text.trim(),
            completed: false
        };
        todos.unshift(newTodo);
        saveTodos();
        render();
    };

    // Toggle todo status
    const toggleTodo = (id) => {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        saveTodos();
        render();
    };

    // Delete todo
    const deleteTodo = (id) => {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        render();
    };

    // Clear all completed todos
    const clearCompleted = () => {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        render();
    };

    // Render UI
    const render = () => {
        // Filter todos based on currentFilter
        const filteredTodos = todos.filter(todo => {
            if (activeFilter === 'active') return !todo.completed;
            if (activeFilter === 'completed') return todo.completed;
            return true;
        });

        // Clear list element
        todoList.innerHTML = '';

        // Handle empty state
        if (filteredTodos.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }

        // Render each todo item
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleTodo(todo.id));

            // Text label (using textContent for XSS safety)
            const span = document.createElement('span');
            span.className = 'todo-text';
            span.textContent = todo.text;

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteBtn.setAttribute('aria-label', 'Xóa công việc');
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });

        // Update counter
        const activeCount = todos.filter(t => !t.completed).length;
        taskCounter.textContent = `${activeCount} công việc còn lại`;
    };

    // Variable reference fix for filter scope
    let activeFilter = 'all';

    // Event Listeners
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value;
        if (text.trim() !== '') {
            addTodo(text);
            todoInput.value = '';
            todoInput.focus();
        }
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            render();
        });
    });

    clearCompletedBtn.addEventListener('click', () => {
        clearCompleted();
    });

    // Initial Load
    loadTodos();
    render();
});
