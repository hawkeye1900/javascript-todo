// Elements
let allTasks = [];

const save = document.querySelector(".save");
const tableBody = document.querySelector(".tableBody");
const taskForm = document.querySelector(".taskForm");
const close = document.querySelector(".close");
const backdrop = document.getElementById("backdrop");
const deleteWindow = document.querySelector(".delete-window");
const deleteAllTasksBtn = document.querySelector("#deleteAllTasks");

let editedRow = null;

// tableBody.innerHTML = "";

// Event listeners
document.addEventListener("DOMContentLoaded", getDataFromLocalStorage);
deleteAllTasksBtn.addEventListener("click", deleteAllTasks);

save.addEventListener("click", function (e) {
  e.preventDefault();
  const formHeading = document.querySelector(".taskForm h2").textContent;

  if (formHeading == "Edit Task") {
    saveEditedTask();
  } else if (formHeading == "New Task") {
    addTask();
  }
});
tableBody.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("edit-btn")) {
    openTaskToEdit(e);
  } else if (e.target && e.target.classList.contains("delete-btn")) {
    deleteTask(e);
  }
});
close.addEventListener("click", resetForm);

function getDataFromLocalStorage() {
  const data = localStorage.getItem("storedTasks");
  if (!data) {
    localStorage.setItem("storedTasks", JSON.stringify(allTasks));
  } else {
    allTasks = JSON.parse(data);
    displayTasks(allTasks);
  }
}

function saveDataToLocalStorage(data) {
  localStorage.setItem("storedTasks", JSON.stringify(data));
}

// Clock function
function updateClock() {
  const now = new Date();

  const date = now.toLocaleDateString();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const secs = now.getSeconds().toString().padStart(2, "0");

  const time = `${hours}:${minutes}:${secs}`;
  document.querySelector(".clock").textContent = `${date} ${time}`;
}

// Clear the input fields
function clearTaskInputFields() {
  document.getElementById("taskForm").reset();
}

function getFormattedDate() {
  let dueDateValue = document.getElementById("taskDate").value;
  dueDateValue = dueDateValue ? dueDateValue : new Date();
  let dueDateFormatted;
  if (dueDateValue) {
    const dueDateObj = new Date(dueDateValue);
    const formatter = new Intl.DateTimeFormat("en-GB");
    dueDateFormatted = formatter.format(dueDateObj);
    return dueDateFormatted;
  } else {
    return "";
  }
}

// Add task
function addTask() {
  const now = new Date();
  // let dueDate = document.getElementById("taskDate").value;
  // const dueDateEls = dueDate.split("-");
  // const [year, month, date] = dueDateEls;
  // dueDate = `${date}/${month}/${year}`;

  const newTask = {
    dueDate: getFormattedDate(),
    taskText: document.getElementById("taskText").value,
    taskStatus: document.getElementById("taskStatus").value,
    taskPriority: document.getElementById("taskPriority").value,
    createdDate: now.toLocaleDateString(),
    timeCreated: now.toLocaleTimeString(),
  };

  allTasks.push(newTask);
  saveDataToLocalStorage(allTasks);
  displayTasks(allTasks);
  clearTaskInputFields();
}

// Display tasks in table
function displayTasks(taskList) {
  tableBody.innerHTML = "";
  for (let task of taskList) {
    const markup = `
    <tr>
      <td>${task.dueDate}</td>
      <td>${task.taskText}</td>
      <td>${task.taskStatus}</td>
      <td>${task.taskPriority}</td>
      <td>${task.createdDate}</td>
      <td class="task-buttons">
        <button class="button edit-btn">Edit</button>
        <button class="button delete-btn">Delete</button>
      </td>
    </tr>    
    `;
    tableBody.innerHTML += markup;
  }
}

function openTaskToEdit(e) {
  // Creating modal window
  taskForm.classList.add("modal");
  document.querySelector(".taskForm h2").textContent = "Edit Task";
  close.style.display = "block";
  backdrop.classList.remove("hidden");

  //  Identifying relevant task (table row)
  if (e.target && e.target.classList.contains("edit-btn")) {
    const taskRow = e.target.closest("tr");
    editedRow = taskRow.rowIndex;

    // Populate edit task form with selected task
    const dueDate = taskRow.children[0].textContent;
    const taskText = taskRow.children[1].textContent;
    const taskStatus = taskRow.children[2].textContent;
    const taskPriority = taskRow.children[3].textContent;

    document.getElementById("taskDate").value = dueDate;
    document.getElementById("taskText").value = taskText;
    document.getElementById("taskStatus").value = taskStatus;
    document.getElementById("taskPriority").value = taskPriority;
  }
}

function saveEditedTask() {
  const rowForEditing = editedRow - 1;
  const editedTask = {
    dueDate: getFormattedDate(),
    taskText: document.getElementById("taskText").value,
    taskStatus: document.getElementById("taskStatus").value,
    taskPriority: document.getElementById("taskPriority").value,
  };

  allTasks[rowForEditing] = { ...allTasks[rowForEditing], ...editedTask };

  displayTasks(allTasks);
  saveDataToLocalStorage(allTasks);
  resetForm();
  clearTaskInputFields();
}

function confirmDelete(taskList, index) {
  taskList.splice(index, 1);
  displayTasks(allTasks);
  saveDataToLocalStorage(allTasks);
  backdrop.classList.add("hidden");
  deleteWindow.classList.add("hidden");
}

function cancelDelete() {
  backdrop.classList.add("hidden");
  deleteWindow.classList.add("hidden");
}

function deleteTask(e) {
  console.log("Deleting task");
  if (e.target && e.target.classList.contains("delete-btn")) {
    const taskRow = e.target.closest("tr");
    listIndex = taskRow.rowIndex - 1;
  }

  backdrop.classList.remove("hidden");
  deleteWindow.classList.remove("hidden");

  document.querySelector(".confirm").addEventListener("click", (e) => {
    e.preventDefault();
    confirmDelete(allTasks, listIndex);
  });
  document.querySelector(".cancel").addEventListener("click", cancelDelete);
}

function resetForm() {
  taskForm.classList.remove("modal");
  close.style.display = "none";
  document.querySelector(".taskForm h2").textContent = "New Task";
  backdrop.classList.add("hidden");
  document.getElementById("taskText").focus();
}

function deleteAllTasks() {
  console.log("Deleting all tasks");
  allTasks = [];
  saveDataToLocalStorage(allTasks);
  displayTasks(allTasks);
}

// Update clock immediately and every second
updateClock();
setInterval(updateClock, 1000);
