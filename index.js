class Task {
    constructor(text) {
      this.text = text;
      this.state = 'To Do'; // Posibles estados: 'To Do', 'Doing', 'Done'
    }
  }
  
  // Referencias a los elementos del DOM
  const taskInput = document.getElementById('task-input');
  const publishButton = document.getElementById('publish-button');
  const todos = document.getElementById('todo');
  const doings = document.getElementById('doing');
  const dones = document.getElementById('done');
  
  // Cargar tareas desde localStorage
  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
      createTaskCard(task);
    });
  };
  
  // Guardar tareas en localStorage
  const saveTasks = () => {
    const tasksElements = document.querySelectorAll('.task-card');
    const tasks = [...tasksElements].map(taskElement => {
      return {
        text: taskElement.querySelector('p').textContent,
        state: taskElement.parentElement.id
      };
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };
  
  // Función para crear tarjetas en el DOM
  const createTaskCard = (task) => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
      <p>${task.text}</p>
      <button class="move-up">↑</button>
      <button class="move-down">↓</button>
      <button class="delete">X</button>
    `;
    
    // Asignación de comportamiento a los botones
    card.querySelector('.move-up').addEventListener('click', () => changeState(task, true));
    card.querySelector('.move-down').addEventListener('click', () => changeState(task, false));
    card.querySelector('.delete').addEventListener('click', () => deleteTask(task));
  
    // Añadir tarjeta al estado correspondiente
    switch(task.state) {
      case 'To Do':
        todos.appendChild(card);
        break;
      case 'Doing':
        doings.appendChild(card);
        break;
      case 'Done':
        dones.appendChild(card);
        break;
    }
  };
  
  // Cambiar estado de la tarea
  const changeState = (task, moveUp) => {
    const states = ['To Do', 'Doing', 'Done'];
    let currentIndex = states.indexOf(task.state);
    if (moveUp && currentIndex < states.length - 1) {
      task.state = states[currentIndex + 1];
    } else if (!moveUp && currentIndex > 0) {
      task.state = states[currentIndex - 1];
    }
    // Actualizar el DOM
    document.querySelector('.task-card').remove();
    createTaskCard(task);
    saveTasks();
  };
  
  // Eliminar tarea
  const deleteTask = (task) => {
    document.querySelector('.task-card').remove();
    saveTasks();
  };
  
  // Publicar nueva tarea
  publishButton.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
      const newTask = new Task(text);
      createTaskCard(newTask);
      saveTasks();
      taskInput.value = '';
    }
  });
  
  // Cargar tareas al iniciar
  window.addEventListener('DOMContentLoaded', loadTasks);