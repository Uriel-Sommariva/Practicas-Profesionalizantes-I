# Todo List - Refactoring POO

Proyecto realizado para la materia Prácticas Profesionalizantes I.

## Descripción

Aplicación de gestión de tareas desarrollada con JavaScript Vanilla.

Permite:

- Crear tareas.
- Editar tareas.
- Eliminar tareas.
- Cambiar el estado entre Pending y Completed.
- Marcar tareas con prioridad:
  - High
  - Medium
  - Low
- Guardar las tareas utilizando LocalStorage.
- Mostrar las tareas finalizadas con estilo tachado.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript Vanilla
- W3.CSS
- LocalStorage

## Programación Orientada a Objetos

El proyecto aplica conceptos de POO como:

- Encapsulación.
- Abstracción.
- Herencia.
- Polimorfismo.
- Separación de responsabilidades.
- Simulación de interfaces en JavaScript Vanilla.

Se utiliza una clase base `TaskRepository` como contrato, y `LocalStorageTaskRepository` como implementación concreta.

También se utiliza `IdGenerator` como interfaz simulada y `BrowserIdGenerator` como implementación.

## Refactoring realizado

- Código escrito en inglés.
- Comentarios en español con formato Doxygen.
- Eliminación del uso de `innerHTML`.
- Creación de elementos mediante funciones DOM de JavaScript.
- No se utiliza HTML dentro de cadenas de texto en JavaScript.
- Uso de interfaces simuladas y polimorfismo de interfaz.

## Archivos del proyecto

```text
index.html
styles.css
app.js
README.md
