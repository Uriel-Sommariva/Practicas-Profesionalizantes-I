'use strict';

/**
 * Valores válidos de prioridad.
 * Object.freeze evita modificaciones accidentales en tiempo de ejecución.
 */
const TaskPriority = Object.freeze({
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
});

/**
 * Valores válidos de estado.
 */
const TaskStatus = Object.freeze({
  PENDING: 'pending',
  COMPLETED: 'completed'
});

/**
 * Entidad de dominio.
 *
 * Representa una tarea y concentra las reglas que pertenecen
 * a la propia tarea: validación de datos, modificación y cambio de estado.
 */
class Task {
  #id;
  #title;
  #priority;
  #status;
  #createdAt;

  constructor({
    id = crypto.randomUUID(),
    title,
    priority = TaskPriority.MEDIUM,
    status = TaskStatus.PENDING,
    createdAt = new Date().toISOString()
  }) {
    this.#id = id;
    this.#title = Task.validateTitle(title);
    this.#priority = Task.validatePriority(priority);
    this.#status = Task.validateStatus(status);
    this.#createdAt = createdAt;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get priority() {
    return this.#priority;
  }

  get status() {
    return this.#status;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get isCompleted() {
    return this.#status === TaskStatus.COMPLETED;
  }

  update({ title, priority }) {
    this.#title = Task.validateTitle(title);
    this.#priority = Task.validatePriority(priority);
  }

  toggleStatus() {
    this.#status = this.isCompleted
      ? TaskStatus.PENDING
      : TaskStatus.COMPLETED;
  }

  toJSON() {
    return {
      id: this.#id,
      title: this.#title,
      priority: this.#priority,
      status: this.#status,
      createdAt: this.#createdAt
    };
  }

  static fromJSON(data) {
    return new Task(data);
  }

  static validateTitle(title) {
    if (typeof title !== 'string') {
      throw new TypeError('El título de la tarea debe ser texto.');
    }

    const normalizedTitle = title.trim();

    if (normalizedTitle.length === 0) {
      throw new Error('La tarea no puede estar vacía.');
    }

    if (normalizedTitle.length > 100) {
      throw new Error('La tarea no puede superar los 100 caracteres.');
    }

    return normalizedTitle;
  }

  static validatePriority(priority) {
    const validPriorities = Object.values(TaskPriority);

    if (!validPriorities.includes(priority)) {
      throw new Error('La prioridad indicada no es válida.');
    }

    return priority;
  }

  static validateStatus(status) {
    const validStatuses = Object.values(TaskStatus);

    if (!validStatuses.includes(status)) {
      throw new Error('El estado indicado no es válido.');
    }

    return status;
  }
}

/**
 * Repositorio.
 *
 * Su única responsabilidad es la persistencia de tareas.
 * Ninguna parte de la interfaz utiliza localStorage directamente.
 */
class LocalStorageTaskRepository {
  #storageKey;

  constructor(storageKey = 'todo-list.tasks') {
    this.#storageKey = storageKey;
  }

  getAll() {
    const rawData = localStorage.getItem(this.#storageKey);

    if (!rawData) {
      return [];
    }

    try {
      const parsedData = JSON.parse(rawData);

      if (!Array.isArray(parsedData)) {
        return [];
      }

      return parsedData.map((taskData) => Task.fromJSON(taskData));
    } catch (error) {
      console.error('No se pudieron recuperar las tareas:', error);
      return [];
    }
  }

  saveAll(tasks) {
    const serializedTasks = tasks.map((task) => task.toJSON());
    localStorage.setItem(this.#storageKey, JSON.stringify(serializedTasks));
  }
}

/**
 * Servicio / capa de aplicación.
 *
 * Administra la colección de tareas y coordina las operaciones
 * del caso de uso sin depender del DOM.
 */
class TaskService {
  #repository;
  #tasks;

  constructor(repository) {
    if (!repository) {
      throw new Error('TaskService necesita un repositorio.');
    }

    this.#repository = repository;
    this.#tasks = this.#repository.getAll();
  }

  getTasks() {
    return [...this.#tasks];
  }

  getTaskById(id) {
    return this.#tasks.find((task) => task.id === id) ?? null;
  }

  createTask(title, priority) {
    const task = new Task({ title, priority });
    this.#tasks.push(task);
    this.#persist();

    return task;
  }

  updateTask(id, changes) {
    const task = this.#requireTask(id);
    task.update(changes);
    this.#persist();

    return task;
  }

  toggleTaskStatus(id) {
    const task = this.#requireTask(id);
    task.toggleStatus();
    this.#persist();

    return task;
  }

  deleteTask(id) {
    const index = this.#tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new Error('La tarea solicitada no existe.');
    }

    const [deletedTask] = this.#tasks.splice(index, 1);
    this.#persist();

    return deletedTask;
  }

  clearCompletedTasks() {
    const completedCount = this.#tasks.filter((task) => task.isCompleted).length;

    if (completedCount === 0) {
      return 0;
    }

    this.#tasks = this.#tasks.filter((task) => !task.isCompleted);
    this.#persist();

    return completedCount;
  }

  getSummary() {
    const total = this.#tasks.length;
    const completed = this.#tasks.filter((task) => task.isCompleted).length;
    const pending = total - completed;

    return { total, pending, completed };
  }

  #requireTask(id) {
    const task = this.getTaskById(id);

    if (!task) {
      throw new Error('La tarea solicitada no existe.');
    }

    return task;
  }

  #persist() {
    this.#repository.saveAll(this.#tasks);
  }
}

/**
 * Vista.
 *
 * Encapsula la interacción directa con el DOM.
 * Recibe acciones mediante callbacks para no conocer la lógica interna
 * del servicio.
 */
class TodoView {
  #elements;
  #handlers;
  #confirmationAction;

  constructor() {
    this.#elements = {
      taskForm: document.querySelector('#taskForm'),
      titleInput: document.querySelector('#title'),
      priorityInput: document.querySelector('#priority'),
      titleError: document.querySelector('#titleError'),
      tableBody: document.querySelector('#taskTableBody'),
      emptyState: document.querySelector('#emptyState'),
      pendingCount: document.querySelector('#pendingCount'),
      taskSummary: document.querySelector('#taskSummary'),
      clearCompletedButton: document.querySelector('#clearCompletedButton'),

      editModal: document.querySelector('#editModal'),
      editTaskForm: document.querySelector('#editTaskForm'),
      editTaskId: document.querySelector('#editTaskId'),
      editTitle: document.querySelector('#editTitle'),
      editPriority: document.querySelector('#editPriority'),
      editTitleError: document.querySelector('#editTitleError'),
      closeEditModalButton: document.querySelector('#closeEditModalButton'),
      cancelEditButton: document.querySelector('#cancelEditButton'),

      confirmModal: document.querySelector('#confirmModal'),
      confirmTitle: document.querySelector('#confirmTitle'),
      confirmMessage: document.querySelector('#confirmMessage'),
      cancelConfirmButton: document.querySelector('#cancelConfirmButton'),
      acceptConfirmButton: document.querySelector('#acceptConfirmButton')
    };

    this.#handlers = {
      create: null,
      edit: null,
      toggle: null,
      delete: null,
      clearCompleted: null
    };

    this.#confirmationAction = null;
    this.#bindInternalEvents();
  }

  bindCreateTask(handler) {
    this.#handlers.create = handler;
  }

  bindEditTask(handler) {
    this.#handlers.edit = handler;
  }

  bindToggleTaskStatus(handler) {
    this.#handlers.toggle = handler;
  }

  bindDeleteTask(handler) {
    this.#handlers.delete = handler;
  }

  bindClearCompletedTasks(handler) {
    this.#handlers.clearCompleted = handler;
  }

  render(tasks, summary) {
    this.#elements.tableBody.innerHTML = '';

    for (const task of tasks) {
      this.#elements.tableBody.appendChild(this.#createTaskRow(task));
    }

    this.#elements.emptyState.classList.toggle('visible', tasks.length === 0);
    this.#elements.pendingCount.textContent = String(summary.pending);
    this.#elements.taskSummary.textContent = this.#formatSummary(summary);

    this.#elements.clearCompletedButton.disabled = summary.completed === 0;
    this.#elements.clearCompletedButton.style.opacity =
      summary.completed === 0 ? '0.5' : '1';
  }

  resetCreateForm() {
    this.#elements.taskForm.reset();
    this.#elements.priorityInput.value = TaskPriority.MEDIUM;
    this.#elements.titleError.textContent = '';
    this.#elements.titleInput.focus();
  }

  showCreateError(message) {
    this.#elements.titleError.textContent = message;
  }

  openEditModal(task) {
    this.#elements.editTaskId.value = task.id;
    this.#elements.editTitle.value = task.title;
    this.#elements.editPriority.value = task.priority;
    this.#elements.editTitleError.textContent = '';

    this.#showModal(this.#elements.editModal);
    this.#elements.editTitle.focus();
  }

  closeEditModal() {
    this.#hideModal(this.#elements.editModal);
    this.#elements.editTaskForm.reset();
    this.#elements.editTitleError.textContent = '';
  }

  showEditError(message) {
    this.#elements.editTitleError.textContent = message;
  }

  askForConfirmation({ title, message, acceptLabel = 'Confirmar', onAccept }) {
    this.#confirmationAction = onAccept;
    this.#elements.confirmTitle.textContent = title;
    this.#elements.confirmMessage.textContent = message;
    this.#elements.acceptConfirmButton.textContent = acceptLabel;
    this.#showModal(this.#elements.confirmModal);
  }

  closeConfirmModal() {
    this.#confirmationAction = null;
    this.#hideModal(this.#elements.confirmModal);
  }

  #bindInternalEvents() {
    this.#elements.taskForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!this.#handlers.create) {
        return;
      }

      this.#handlers.create({
        title: this.#elements.titleInput.value,
        priority: this.#elements.priorityInput.value
      });
    });

    this.#elements.tableBody.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');

      if (!button) {
        return;
      }

      const { action, id } = button.dataset;

      switch (action) {
        case 'edit':
          this.#handlers.edit?.(id);
          break;
        case 'toggle':
          this.#handlers.toggle?.(id);
          break;
        case 'delete':
          this.#handlers.delete?.(id);
          break;
      }
    });

    this.#elements.editTaskForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!this.#handlers.edit) {
        return;
      }

      this.#handlers.edit({
        id: this.#elements.editTaskId.value,
        title: this.#elements.editTitle.value,
        priority: this.#elements.editPriority.value
      });
    });

    this.#elements.closeEditModalButton.addEventListener('click', () => {
      this.closeEditModal();
    });

    this.#elements.cancelEditButton.addEventListener('click', () => {
      this.closeEditModal();
    });

    this.#elements.clearCompletedButton.addEventListener('click', () => {
      this.#handlers.clearCompleted?.();
    });

    this.#elements.cancelConfirmButton.addEventListener('click', () => {
      this.closeConfirmModal();
    });

    this.#elements.acceptConfirmButton.addEventListener('click', () => {
      const action = this.#confirmationAction;
      this.closeConfirmModal();
      action?.();
    });

    window.addEventListener('click', (event) => {
      if (event.target === this.#elements.editModal) {
        this.closeEditModal();
      }

      if (event.target === this.#elements.confirmModal) {
        this.closeConfirmModal();
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeEditModal();
        this.closeConfirmModal();
      }
    });
  }

  #createTaskRow(task) {
    const row = document.createElement('tr');
    row.className = `task-row${task.isCompleted ? ' is-completed' : ''}`;

    const titleCell = document.createElement('td');
    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;
    titleCell.appendChild(title);

    const priorityCell = document.createElement('td');
    priorityCell.appendChild(this.#createPriorityBadge(task.priority));

    const statusCell = document.createElement('td');
    statusCell.appendChild(this.#createStatusBadge(task));

    const actionsCell = document.createElement('td');
    actionsCell.className = 'actions-cell';

    actionsCell.append(
      this.#createActionButton('edit', task.id, 'Editar', 'edit'),
      this.#createActionButton(
        'toggle',
        task.id,
        task.isCompleted ? 'Marcar pendiente' : 'Finalizar',
        'toggle'
      ),
      this.#createActionButton('delete', task.id, 'Borrar', 'delete')
    );

    row.append(titleCell, priorityCell, statusCell, actionsCell);

    return row;
  }

  #createPriorityBadge(priority) {
    const badge = document.createElement('span');
    badge.className = `priority-badge priority-${priority.toLowerCase()}`;
    badge.textContent = priority;

    return badge;
  }

  #createStatusBadge(task) {
    const badge = document.createElement('span');

    if (task.isCompleted) {
      badge.className = 'status-badge status-completed';
      badge.textContent = 'Finalizada';
    } else {
      badge.className = 'status-badge status-pending';
      badge.textContent = 'Pendiente';
    }

    return badge;
  }

  #createActionButton(action, id, text, extraClass) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `w3-button action-button ${extraClass}`;
    button.dataset.action = action;
    button.dataset.id = id;
    button.textContent = text;

    return button;
  }

  #formatSummary({ total, pending, completed }) {
    if (total === 0) {
      return 'No hay tareas registradas.';
    }

    return `${total} tarea${total === 1 ? '' : 's'} · ` +
      `${pending} pendiente${pending === 1 ? '' : 's'} · ` +
      `${completed} finalizada${completed === 1 ? '' : 's'}`;
  }

  #showModal(modal) {
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
  }

  #hideModal(modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Controlador.
 *
 * Conecta la vista con el servicio.
 * No conoce detalles de localStorage ni manipula directamente la colección.
 */
class TodoController {
  #service;
  #view;

  constructor(service, view) {
    this.#service = service;
    this.#view = view;

    this.#configureBindings();
    this.refresh();
  }

  refresh() {
    this.#view.render(
      this.#service.getTasks(),
      this.#service.getSummary()
    );
  }

  #configureBindings() {
    this.#view.bindCreateTask(({ title, priority }) => {
      try {
        this.#service.createTask(title, priority);
        this.#view.resetCreateForm();
        this.refresh();
      } catch (error) {
        this.#view.showCreateError(error.message);
      }
    });

    this.#view.bindEditTask((payload) => {
      if (typeof payload === 'string') {
        const task = this.#service.getTaskById(payload);

        if (task) {
          this.#view.openEditModal(task);
        }

        return;
      }

      try {
        this.#service.updateTask(payload.id, {
          title: payload.title,
          priority: payload.priority
        });

        this.#view.closeEditModal();
        this.refresh();
      } catch (error) {
        this.#view.showEditError(error.message);
      }
    });

    this.#view.bindToggleTaskStatus((id) => {
      this.#service.toggleTaskStatus(id);
      this.refresh();
    });

    this.#view.bindDeleteTask((id) => {
      const task = this.#service.getTaskById(id);

      if (!task) {
        return;
      }

      this.#view.askForConfirmation({
        title: 'Eliminar tarea',
        message: `¿Seguro que querés borrar "${task.title}"?`,
        acceptLabel: 'Eliminar',
        onAccept: () => {
          this.#service.deleteTask(id);
          this.refresh();
        }
      });
    });

    this.#view.bindClearCompletedTasks(() => {
      const completedCount = this.#service.getSummary().completed;

      if (completedCount === 0) {
        return;
      }

      this.#view.askForConfirmation({
        title: 'Borrar tareas finalizadas',
        message:
          `Se eliminarán ${completedCount} tarea` +
          `${completedCount === 1 ? '' : 's'} finalizada` +
          `${completedCount === 1 ? '' : 's'}.`,
        acceptLabel: 'Borrar',
        onAccept: () => {
          this.#service.clearCompletedTasks();
          this.refresh();
        }
      });
    });
  }
}

/**
 * Punto de composición de dependencias.
 *
 * Las clases se crean y conectan aquí. Gracias a esto cada objeto
 * mantiene una responsabilidad concreta y un acoplamiento reducido.
 */
document.addEventListener('DOMContentLoaded', () => {
  const repository = new LocalStorageTaskRepository();
  const service = new TaskService(repository);
  const view = new TodoView();

  new TodoController(service, view);
});
