"use strict";

/**
 * @file app.js
 * @brief Lógica completa de la aplicación Todo List.
 * @details Implementa POO, encapsulación, separación de responsabilidades,
 *          simulación de interfaces, polimorfismo de interfaz y persistencia.
 *          No utiliza la propiedad de inserción de HTML ni construye HTML mediante cadenas de texto.
 */

/**
 * @brief Prioridades válidas para una tarea.
 * @readonly
 * @enum {string}
 */
const TaskPriority = Object.freeze({
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low"
});

/**
 * @brief Estados válidos para una tarea.
 * @readonly
 * @enum {string}
 */
const TaskStatus = Object.freeze({
  PENDING: "pending",
  COMPLETED: "completed"
});

/**
 * @interface TaskRepository
 * @brief Contrato para las operaciones de persistencia de tareas.
 * @details JavaScript Vanilla no posee interfaces nativas. Esta clase base
 *          simula una interfaz y obliga a las implementaciones concretas a
 *          sobrescribir sus métodos.
 */
class TaskRepository {
  /**
   * @brief Obtiene todas las tareas persistidas.
   * @returns {Task[]} Lista de tareas.
   * @throws {Error} Si el método no fue implementado.
   */
  getAll() {
    throw new Error("Method getAll() must be implemented.");
  }

  /**
   * @brief Persiste una colección de tareas.
   * @param {Task[]} tasks Tareas a guardar.
   * @returns {void}
   * @throws {Error} Si el método no fue implementado.
   */
  saveAll(tasks) {
    void tasks;
    throw new Error("Method saveAll() must be implemented.");
  }
}

/**
 * @interface IdGenerator
 * @brief Contrato para la generación de identificadores únicos.
 */
class IdGenerator {
  /**
   * @brief Genera un identificador único.
   * @returns {string} Identificador generado.
   * @throws {Error} Si el método no fue implementado.
   */
  generate() {
    throw new Error("Method generate() must be implemented.");
  }
}

/**
 * @class BrowserIdGenerator
 * @extends IdGenerator
 * @brief Implementación concreta del generador de identificadores.
 */
class BrowserIdGenerator extends IdGenerator {
  /**
   * @brief Genera un UUID usando la API Crypto del navegador.
   * @returns {string} Identificador único.
   */
  generate() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

/**
 * @class Task
 * @brief Entidad de dominio que representa una tarea.
 * @details Encapsula sus propios datos y las reglas que le pertenecen.
 */
class Task {
  /** @type {string} @private */
  #id;

  /** @type {string} @private */
  #title;

  /** @type {string} @private */
  #priority;

  /** @type {string} @private */
  #status;

  /** @type {string} @private */
  #createdAt;

  /**
   * @brief Construye una tarea.
   * @param {Object} data Datos iniciales.
   * @param {string} data.id Identificador único.
   * @param {string} data.title Título.
   * @param {string} [data.priority=TaskPriority.MEDIUM] Prioridad.
   * @param {string} [data.status=TaskStatus.PENDING] Estado.
   * @param {string} [data.createdAt] Fecha de creación.
   */
  constructor({
    id,
    title,
    priority = TaskPriority.MEDIUM,
    status = TaskStatus.PENDING,
    createdAt = new Date().toISOString()
  }) {
    this.#id = Task.validateId(id);
    this.#title = Task.validateTitle(title);
    this.#priority = Task.validatePriority(priority);
    this.#status = Task.validateStatus(status);
    this.#createdAt = createdAt;
  }

  /** @brief Obtiene el identificador. @returns {string} Identificador. */
  get id() {
    return this.#id;
  }

  /** @brief Obtiene el título. @returns {string} Título. */
  get title() {
    return this.#title;
  }

  /** @brief Obtiene la prioridad. @returns {string} Prioridad. */
  get priority() {
    return this.#priority;
  }

  /** @brief Obtiene el estado. @returns {string} Estado. */
  get status() {
    return this.#status;
  }

  /** @brief Obtiene la fecha de creación. @returns {string} Fecha ISO. */
  get createdAt() {
    return this.#createdAt;
  }

  /** @brief Indica si la tarea está finalizada. @returns {boolean} Resultado. */
  get isCompleted() {
    return this.#status === TaskStatus.COMPLETED;
  }

  /**
   * @brief Actualiza los datos editables de la tarea.
   * @param {Object} changes Cambios solicitados.
   * @param {string} changes.title Nuevo título.
   * @param {string} changes.priority Nueva prioridad.
   * @returns {void}
   */
  update({ title, priority }) {
    this.#title = Task.validateTitle(title);
    this.#priority = Task.validatePriority(priority);
  }

  /**
   * @brief Alterna el estado entre pendiente y finalizada.
   * @returns {void}
   */
  toggleStatus() {
    this.#status = this.isCompleted ? TaskStatus.PENDING : TaskStatus.COMPLETED;
  }

  /**
   * @brief Convierte la entidad a un objeto serializable.
   * @returns {Object} Representación serializable.
   */
  toJSON() {
    return {
      id: this.#id,
      title: this.#title,
      priority: this.#priority,
      status: this.#status,
      createdAt: this.#createdAt
    };
  }

  /**
   * @brief Reconstruye una tarea desde datos persistidos.
   * @param {Object} data Datos almacenados.
   * @returns {Task} Nueva instancia.
   */
  static fromJSON(data) {
    return new Task(data);
  }

  /**
   * @brief Valida un identificador.
   * @param {string} id Identificador.
   * @returns {string} Identificador validado.
   */
  static validateId(id) {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Task id must be a non-empty string.");
    }

    return id;
  }

  /**
   * @brief Valida y normaliza un título.
   * @param {string} title Título.
   * @returns {string} Título normalizado.
   */
  static validateTitle(title) {
    if (typeof title !== "string") {
      throw new TypeError("Task title must be text.");
    }

    const normalizedTitle = title.trim();

    if (normalizedTitle.length === 0) {
      throw new Error("Task cannot be empty.");
    }

    if (normalizedTitle.length > 100) {
      throw new Error("Task cannot exceed 100 characters.");
    }

    return normalizedTitle;
  }

  /**
   * @brief Valida una prioridad.
   * @param {string} priority Prioridad.
   * @returns {string} Prioridad validada.
   */
  static validatePriority(priority) {
    if (!Object.values(TaskPriority).includes(priority)) {
      throw new Error("Invalid task priority.");
    }

    return priority;
  }

  /**
   * @brief Valida un estado.
   * @param {string} status Estado.
   * @returns {string} Estado validado.
   */
  static validateStatus(status) {
    if (!Object.values(TaskStatus).includes(status)) {
      throw new Error("Invalid task status.");
    }

    return status;
  }
}

/**
 * @class LocalStorageTaskRepository
 * @extends TaskRepository
 * @brief Implementación del repositorio mediante LocalStorage.
 * @details Puede reemplazarse por otra implementación de TaskRepository sin
 *          modificar TaskService. Esto aplica polimorfismo de interfaz.
 */
class LocalStorageTaskRepository extends TaskRepository {
  /** @type {string} @private */
  #storageKey;

  /**
   * @brief Construye el repositorio.
   * @param {string} [storageKey="todo-list-refactoring.tasks"] Clave de almacenamiento.
   */
  constructor(storageKey = "todo-list-refactoring.tasks") {
    super();
    this.#storageKey = storageKey;
  }

  /**
   * @brief Recupera todas las tareas de LocalStorage.
   * @returns {Task[]} Tareas reconstruidas.
   */
  getAll() {
    const rawData = localStorage.getItem(this.#storageKey);

    if (rawData === null) {
      return [];
    }

    try {
      const parsedData = JSON.parse(rawData);

      if (!Array.isArray(parsedData)) {
        return [];
      }

      return parsedData.map((taskData) => Task.fromJSON(taskData));
    } catch (error) {
      console.error("Tasks could not be restored.", error);
      return [];
    }
  }

  /**
   * @brief Guarda todas las tareas en LocalStorage.
   * @param {Task[]} tasks Tareas a persistir.
   * @returns {void}
   */
  saveAll(tasks) {
    const serializedTasks = tasks.map((task) => task.toJSON());
    localStorage.setItem(this.#storageKey, JSON.stringify(serializedTasks));
  }
}

/**
 * @class TaskService
 * @brief Capa de aplicación responsable de los casos de uso.
 * @details Depende de abstracciones y no conoce LocalStorage ni el DOM.
 */
class TaskService {
  /** @type {TaskRepository} @private */
  #repository;

  /** @type {IdGenerator} @private */
  #idGenerator;

  /** @type {Task[]} @private */
  #tasks;

  /**
   * @brief Construye el servicio.
   * @param {TaskRepository} repository Repositorio concreto.
   * @param {IdGenerator} idGenerator Generador concreto.
   */
  constructor(repository, idGenerator) {
    if (!(repository instanceof TaskRepository)) {
      throw new TypeError("Repository must implement TaskRepository.");
    }

    if (!(idGenerator instanceof IdGenerator)) {
      throw new TypeError("Id generator must implement IdGenerator.");
    }

    this.#repository = repository;
    this.#idGenerator = idGenerator;
    this.#tasks = this.#repository.getAll();
  }

  /** @brief Devuelve una copia de las tareas. @returns {Task[]} Lista. */
  getTasks() {
    return [...this.#tasks];
  }

  /**
   * @brief Busca una tarea por id.
   * @param {string} id Identificador.
   * @returns {Task|null} Tarea encontrada o null.
   */
  getTaskById(id) {
    return this.#tasks.find((task) => task.id === id) ?? null;
  }

  /**
   * @brief Crea una nueva tarea.
   * @param {string} title Título.
   * @param {string} priority Prioridad.
   * @returns {Task} Tarea creada.
   */
  createTask(title, priority) {
    const task = new Task({
      id: this.#idGenerator.generate(),
      title,
      priority
    });

    this.#tasks.push(task);
    this.#persist();
    return task;
  }

  /**
   * @brief Actualiza una tarea existente.
   * @param {string} id Identificador.
   * @param {Object} changes Cambios.
   * @returns {Task} Tarea actualizada.
   */
  updateTask(id, changes) {
    const task = this.#requireTask(id);
    task.update(changes);
    this.#persist();
    return task;
  }

  /**
   * @brief Alterna el estado de una tarea.
   * @param {string} id Identificador.
   * @returns {Task} Tarea modificada.
   */
  toggleTaskStatus(id) {
    const task = this.#requireTask(id);
    task.toggleStatus();
    this.#persist();
    return task;
  }

  /**
   * @brief Elimina una tarea.
   * @param {string} id Identificador.
   * @returns {Task} Tarea eliminada.
   */
  deleteTask(id) {
    const index = this.#tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new Error("Requested task does not exist.");
    }

    const deletedTasks = this.#tasks.splice(index, 1);
    this.#persist();
    return deletedTasks[0];
  }

  /**
   * @brief Elimina todas las tareas finalizadas.
   * @returns {number} Cantidad eliminada.
   */
  clearCompletedTasks() {
    const completedCount = this.#tasks.filter((task) => task.isCompleted).length;

    if (completedCount === 0) {
      return 0;
    }

    this.#tasks = this.#tasks.filter((task) => !task.isCompleted);
    this.#persist();
    return completedCount;
  }

  /**
   * @brief Obtiene un resumen de estados.
   * @returns {{total:number,pending:number,completed:number}} Resumen.
   */
  getSummary() {
    const total = this.#tasks.length;
    const completed = this.#tasks.filter((task) => task.isCompleted).length;
    const pending = total - completed;
    return { total, pending, completed };
  }

  /**
   * @brief Obtiene una tarea o lanza una excepción.
   * @param {string} id Identificador.
   * @returns {Task} Tarea existente.
   * @private
   */
  #requireTask(id) {
    const task = this.getTaskById(id);

    if (task === null) {
      throw new Error("Requested task does not exist.");
    }

    return task;
  }

  /** @brief Persiste la colección actual. @returns {void} @private */
  #persist() {
    this.#repository.saveAll(this.#tasks);
  }
}

/**
 * @class TodoView
 * @brief Capa de presentación responsable del DOM.
 * @details Utiliza createElement, textContent, append, replaceChildren y classList.
 *          No utiliza la propiedad de inserción de HTML ni variables de texto que contengan HTML.
 */
class TodoView {
  /** @type {Object} @private */
  #elements;

  /** @type {Object} @private */
  #handlers;

  /** @type {Function|null} @private */
  #confirmationAction;

  /** @brief Construye la vista y obtiene referencias del DOM. */
  constructor() {
    this.#elements = {
      taskForm: document.querySelector("#taskForm"),
      titleInput: document.querySelector("#title"),
      priorityInput: document.querySelector("#priority"),
      titleError: document.querySelector("#titleError"),
      tableBody: document.querySelector("#taskTableBody"),
      emptyState: document.querySelector("#emptyState"),
      pendingCount: document.querySelector("#pendingCount"),
      taskSummary: document.querySelector("#taskSummary"),
      clearCompletedButton: document.querySelector("#clearCompletedButton"),
      editModal: document.querySelector("#editModal"),
      editTaskForm: document.querySelector("#editTaskForm"),
      editTaskId: document.querySelector("#editTaskId"),
      editTitle: document.querySelector("#editTitle"),
      editPriority: document.querySelector("#editPriority"),
      editTitleError: document.querySelector("#editTitleError"),
      closeEditModalButton: document.querySelector("#closeEditModalButton"),
      cancelEditButton: document.querySelector("#cancelEditButton"),
      confirmModal: document.querySelector("#confirmModal"),
      confirmTitle: document.querySelector("#confirmTitle"),
      confirmMessage: document.querySelector("#confirmMessage"),
      cancelConfirmButton: document.querySelector("#cancelConfirmButton"),
      acceptConfirmButton: document.querySelector("#acceptConfirmButton")
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

  /** @brief Registra el callback de creación. @param {Function} handler Callback. */
  bindCreateTask(handler) {
    this.#handlers.create = handler;
  }

  /** @brief Registra el callback de edición. @param {Function} handler Callback. */
  bindEditTask(handler) {
    this.#handlers.edit = handler;
  }

  /** @brief Registra el callback de cambio de estado. @param {Function} handler Callback. */
  bindToggleTaskStatus(handler) {
    this.#handlers.toggle = handler;
  }

  /** @brief Registra el callback de borrado. @param {Function} handler Callback. */
  bindDeleteTask(handler) {
    this.#handlers.delete = handler;
  }

  /** @brief Registra el callback para limpiar finalizadas. @param {Function} handler Callback. */
  bindClearCompletedTasks(handler) {
    this.#handlers.clearCompleted = handler;
  }

  /**
   * @brief Renderiza la tabla sin la propiedad de inserción de HTML.
   * @param {Task[]} tasks Tareas.
   * @param {{total:number,pending:number,completed:number}} summary Resumen.
   * @returns {void}
   */
  render(tasks, summary) {
    const rows = tasks.map((task) => this.#createTaskRow(task));

    /** @brief replaceChildren reemplaza nodos existentes sin interpretar HTML. */
    this.#elements.tableBody.replaceChildren(...rows);

    this.#elements.emptyState.classList.toggle("visible", tasks.length === 0);
    this.#elements.pendingCount.textContent = String(summary.pending);
    this.#elements.taskSummary.textContent = this.#formatSummary(summary);
    this.#elements.clearCompletedButton.disabled = summary.completed === 0;
    this.#elements.clearCompletedButton.style.opacity = summary.completed === 0 ? "0.5" : "1";
  }

  /** @brief Limpia el formulario de creación. @returns {void} */
  resetCreateForm() {
    this.#elements.taskForm.reset();
    this.#elements.priorityInput.value = TaskPriority.MEDIUM;
    this.#elements.titleError.textContent = "";
    this.#elements.titleInput.focus();
  }

  /** @brief Muestra un error de creación. @param {string} message Mensaje. */
  showCreateError(message) {
    this.#elements.titleError.textContent = message;
  }

  /** @brief Abre el modal de edición. @param {Task} task Tarea. */
  openEditModal(task) {
    this.#elements.editTaskId.value = task.id;
    this.#elements.editTitle.value = task.title;
    this.#elements.editPriority.value = task.priority;
    this.#elements.editTitleError.textContent = "";
    this.#showModal(this.#elements.editModal);
    this.#elements.editTitle.focus();
  }

  /** @brief Cierra el modal de edición. @returns {void} */
  closeEditModal() {
    this.#hideModal(this.#elements.editModal);
    this.#elements.editTaskForm.reset();
    this.#elements.editTitleError.textContent = "";
  }

  /** @brief Muestra un error de edición. @param {string} message Mensaje. */
  showEditError(message) {
    this.#elements.editTitleError.textContent = message;
  }

  /**
   * @brief Abre un modal de confirmación.
   * @param {Object} options Configuración.
   * @param {string} options.title Título.
   * @param {string} options.message Mensaje.
   * @param {string} [options.acceptLabel="Confirm"] Texto del botón.
   * @param {Function} options.onAccept Acción confirmada.
   */
  askForConfirmation({ title, message, acceptLabel = "Confirm", onAccept }) {
    this.#confirmationAction = onAccept;
    this.#elements.confirmTitle.textContent = title;
    this.#elements.confirmMessage.textContent = message;
    this.#elements.acceptConfirmButton.textContent = acceptLabel;
    this.#showModal(this.#elements.confirmModal);
  }

  /** @brief Cierra el modal de confirmación. @returns {void} */
  closeConfirmModal() {
    this.#confirmationAction = null;
    this.#hideModal(this.#elements.confirmModal);
  }

  /**
   * @brief Configura los eventos internos de la vista.
   * @returns {void}
   * @private
   */
  #bindInternalEvents() {
    this.#elements.taskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (typeof this.#handlers.create !== "function") {
        return;
      }

      this.#handlers.create({
        title: this.#elements.titleInput.value,
        priority: this.#elements.priorityInput.value
      });
    });

    this.#elements.tableBody.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");

      if (button === null) {
        return;
      }

      const { action, id } = button.dataset;

      switch (action) {
        case "edit":
          this.#handlers.edit?.(id);
          break;
        case "toggle":
          this.#handlers.toggle?.(id);
          break;
        case "delete":
          this.#handlers.delete?.(id);
          break;
        default:
          break;
      }
    });

    this.#elements.editTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (typeof this.#handlers.edit !== "function") {
        return;
      }

      this.#handlers.edit({
        id: this.#elements.editTaskId.value,
        title: this.#elements.editTitle.value,
        priority: this.#elements.editPriority.value
      });
    });

    this.#elements.closeEditModalButton.addEventListener("click", () => this.closeEditModal());
    this.#elements.cancelEditButton.addEventListener("click", () => this.closeEditModal());
    this.#elements.clearCompletedButton.addEventListener("click", () => this.#handlers.clearCompleted?.());
    this.#elements.cancelConfirmButton.addEventListener("click", () => this.closeConfirmModal());

    this.#elements.acceptConfirmButton.addEventListener("click", () => {
      const action = this.#confirmationAction;
      this.closeConfirmModal();
      action?.();
    });

    window.addEventListener("click", (event) => {
      if (event.target === this.#elements.editModal) {
        this.closeEditModal();
      }

      if (event.target === this.#elements.confirmModal) {
        this.closeConfirmModal();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeEditModal();
        this.closeConfirmModal();
      }
    });
  }

  /**
   * @brief Crea una fila usando exclusivamente funciones DOM.
   * @param {Task} task Tarea.
   * @returns {HTMLTableRowElement} Fila creada.
   * @private
   */
  #createTaskRow(task) {
    const row = document.createElement("tr");
    row.classList.add("task-row");

    if (task.isCompleted) {
      row.classList.add("is-completed");
    }

    const titleCell = document.createElement("td");
    const title = document.createElement("span");
    title.classList.add("task-title");
    title.textContent = task.title;
    titleCell.append(title);

    const priorityCell = document.createElement("td");
    priorityCell.append(this.#createPriorityBadge(task.priority));

    const statusCell = document.createElement("td");
    statusCell.append(this.#createStatusBadge(task));

    const actionsCell = document.createElement("td");
    actionsCell.classList.add("actions-cell");

    const editButton = this.#createActionButton("edit", task.id, "Edit", "edit");
    const toggleButton = this.#createActionButton(
      "toggle",
      task.id,
      task.isCompleted ? "Mark pending" : "Complete",
      "toggle"
    );
    const deleteButton = this.#createActionButton("delete", task.id, "Delete", "delete");

    actionsCell.append(editButton, toggleButton, deleteButton);
    row.append(titleCell, priorityCell, statusCell, actionsCell);
    return row;
  }

  /**
   * @brief Crea el badge de prioridad.
   * @param {string} priority Prioridad.
   * @returns {HTMLSpanElement} Badge.
   * @private
   */
  #createPriorityBadge(priority) {
    const badge = document.createElement("span");
    badge.classList.add("priority-badge", `priority-${priority.toLowerCase()}`);
    badge.textContent = priority;
    return badge;
  }

  /**
   * @brief Crea el badge de estado.
   * @param {Task} task Tarea.
   * @returns {HTMLSpanElement} Badge.
   * @private
   */
  #createStatusBadge(task) {
    const badge = document.createElement("span");
    badge.classList.add("status-badge");

    if (task.isCompleted) {
      badge.classList.add("status-completed");
      badge.textContent = "Completed";
    } else {
      badge.classList.add("status-pending");
      badge.textContent = "Pending";
    }

    return badge;
  }

  /**
   * @brief Crea un botón de acción.
   * @param {string} action Acción.
   * @param {string} id Id de tarea.
   * @param {string} text Texto visible.
   * @param {string} extraClass Clase adicional.
   * @returns {HTMLButtonElement} Botón.
   * @private
   */
  #createActionButton(action, id, text, extraClass) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("w3-button", "action-button", extraClass);
    button.dataset.action = action;
    button.dataset.id = id;
    button.textContent = text;
    return button;
  }

  /**
   * @brief Formatea el resumen de tareas.
   * @param {{total:number,pending:number,completed:number}} summary Resumen.
   * @returns {string} Texto.
   * @private
   */
  #formatSummary({ total, pending, completed }) {
    if (total === 0) {
      return "No tasks registered.";
    }

    const taskWord = total === 1 ? "task" : "tasks";
    return `${total} ${taskWord} · ${pending} pending · ${completed} completed`;
  }

  /** @brief Muestra un modal. @param {HTMLElement} modal Modal. @private */
  #showModal(modal) {
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
  }

  /** @brief Oculta un modal. @param {HTMLElement} modal Modal. @private */
  #hideModal(modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }
}

/**
 * @class TodoController
 * @brief Controlador que coordina la vista con el servicio.
 */
class TodoController {
  /** @type {TaskService} @private */
  #service;

  /** @type {TodoView} @private */
  #view;

  /**
   * @brief Construye el controlador.
   * @param {TaskService} service Servicio.
   * @param {TodoView} view Vista.
   */
  constructor(service, view) {
    this.#service = service;
    this.#view = view;
    this.#configureBindings();
    this.refresh();
  }

  /** @brief Actualiza la vista con el estado actual. @returns {void} */
  refresh() {
    this.#view.render(this.#service.getTasks(), this.#service.getSummary());
  }

  /**
   * @brief Conecta eventos de la vista con casos de uso.
   * @returns {void}
   * @private
   */
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
      if (typeof payload === "string") {
        const task = this.#service.getTaskById(payload);

        if (task !== null) {
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

      if (task === null) {
        return;
      }

      this.#view.askForConfirmation({
        title: "Delete task",
        message: `Are you sure you want to delete "${task.title}"?`,
        acceptLabel: "Delete",
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
        title: "Delete completed tasks",
        message: `${completedCount} completed task(s) will be deleted.`,
        acceptLabel: "Delete",
        onAccept: () => {
          this.#service.clearCompletedTasks();
          this.refresh();
        }
      });
    });
  }
}

/**
 * @brief Punto de composición de dependencias.
 * @details TaskService recibe implementaciones concretas por medio de sus
 *          contratos base, demostrando polimorfismo de interfaz.
 */
document.addEventListener("DOMContentLoaded", () => {
  const repository = new LocalStorageTaskRepository();
  const idGenerator = new BrowserIdGenerator();
  const service = new TaskService(repository, idGenerator);
  const view = new TodoView();

  new TodoController(service, view);
});
