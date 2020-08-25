$(() => {
  let todos = [
    {
      task: "do something",
      isComplete: false,
    },
    {
      task: "take a nap",
      isComplete: true,
    },
  ];

  const app = {
    showTodos() {
      const todoListEl = $("#todo-list");
      todoListEl.html("");
      todos.forEach((todo) => {
        let taskClasses = `"todo-task ${
          todo.isComplete ? "is-completed" : ""
        }"`;
        console.log(taskClasses);
        todoListEl.append(
          `<tr>
          <td class=${taskClasses}>${todo.task}</td>
          <td>
            <button class='edit-button'>Edit</button>
            <button class='delete-button'>Delete</button>
            <button class='save-button'>Save</button>
            <button class='cancel-button'>Cancel</button>
          </td>
        </tr>`
        );
      });
    },

    toggleToDo() {
      todos.forEach((todo) => {
        if (todo.task === $(this).text()) {
          todo.isComplete = !todo.isComplete;
        }
      });

      app.showTodos();
    },

    addTodo() {
      event.preventDefault();
      let createInput = $("#create-input");
      let createInputValue = createInput.val();

      let error = null;

      if (!createInputValue) {
        error = "Task cannot be empty.";
      } else {
        todos.forEach((todo) => {
          if (todo.task === createInputValue) {
            error = "Task already exists.";
          }
        });
      }

      if (error) {
        app.showError(error);
        return;
      }

      todos.push({
        task: createInputValue,
        isComplete: false,
      });

      createInput.val("");
      app.showTodos();
    },

    editMode() {
      let actionsCell = $(this).closest("td");
      let taskCell = actionsCell.prev();

      actionsCell.find(".save-button").show();
      actionsCell.find(".cancel-button").show();
      actionsCell.find(".edit-button").hide();
      actionsCell.find(".delete-button").hide();

      taskCell.removeClass("todo-task");
      app.currentTask = taskCell.text();
      taskCell.html(
        `<input type="text" class="edit-input" value="${app.currentTask}" />`
      );
    },

    exitEditMode() {
      let actionsCell = $(this).closest("td");
      let taskCell = actionsCell.prev();

      actionsCell.find(".save-button").hide();
      actionsCell.find(".cancel-button").hide();
      actionsCell.find(".edit-button").show();
      actionsCell.find(".delete-button").show();

      taskCell.addClass("todo-task");
      taskCell.html(app.currentTask);
    },

    saveTask() {
      let newTask = $(".edit-input").val();

      todos.forEach((todo) => {
        if (app.currentTask === todo.task) {
          todo.task = newTask;
        }
      });
      app.currentTask = newTask;
      app.exitEditMode.call(this);
    },

    deleteTask() {
      let taskToDelete = $(this).parent("td").prev().text();
      let found = false;
      todos.forEach((todo, index) => {
        if (!found && taskToDelete === todo.task) {
          todos.splice(index, 1);
          found = true;
        }
      });

      app.showTodos();
    },

    showError(error) {
      $(".error-message").html(error).slideDown();
    },

    clearError() {
      $(".error-message").fadeOut();
    },
  };

  $("#create-form button").css({
    color: "white",
    borderRadius: "8px",
    background: "green",
  });

  app.showTodos();

  // $(".todo-task").on("click", app.toggleToDo);
  $("#create-form").on("submit", app.addTodo);
  $("#create-input").on("keyup", app.clearError);
  $("table").on("click", ".todo-task", app.toggleToDo);
  $("table").on("click", ".edit-button", app.editMode);
  $("table").on("click", ".cancel-button", app.exitEditMode);
  $("table").on("click", ".save-button", app.saveTask);
  $("table").on("click", ".delete-button", app.deleteTask);
});
