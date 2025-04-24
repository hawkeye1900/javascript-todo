// Elements
let allTasks = [];

const save = document.querySelector(".save");
const tableBody = document.querySelector(".tableBody");
const taskForm = document.querySelector(".taskForm");
const close = document.querySelector(".close");
const backdrop = document.getElementById("backdrop");
const deleteWindow = document.querySelector(".delete-window");
const deleteAllTasksBtn = document.querySelector("#deleteAllTasks");
const sortAscBtn = document.querySelector("#sortAsc");
const sortDescBtn = document.querySelector("#sortDesc");
const taskDate = document.getElementById("taskDate");

let editedRow = null;
let dateInputChanged = false;
let changedDate = "";

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

taskDate.addEventListener("input", (e) => {
  const inputValue = e.target.value;
  if (inputValue) {
    changedDate = formatDateForDisplayChangedInput(inputValue);
    dateInputChanged = true;
  }
});

close.addEventListener("click", (e) => {
  e.preventDefault();
  resetForm();
});

sortAscBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sortTasksAsc(allTasks);
});

sortDescBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sortTasksDesc(allTasks);
});

// Functions
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

function getDueDateValue(date) {
  // date is provided by new Date()

  // dueDateValue is a date manually entered using date picker
  let dueDateValue = document.getElementById("taskDate").value;
  let manualDate = new Date(dueDateValue);
  manualDate = manualDate.toLocaleDateString();

  let value = dueDateValue ? manualDate : date.toLocaleDateString();

  // Either the date manually entered, or automatically generated
  return value;
}

// Utility functions to format date display
function formatDateForDisplayUnchangedInput(dateString) {
  if (dateString.includes("/")) {
    const [a, b, c] = dateString.split("/");

    if (c.length == 4) {
      return `${a}/${b}/${c}`;
    } else if (a.length == 4) {
      return `${c}/${b}/${a}`;
    }
  } else if (dateString.includes("-")) {
    const [a, b, c] = dateString.split("-");

    if (c.length == 4) {
      return `${a}/${b}/${c}`;
    } else if (a.length == 4) {
      return `${c}/${b}/${a}`;
    }
  }
}

function formatDateForDisplayChangedInput(dateString) {
  if (dateString.includes("-")) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  } else if (dateString.includes("/")) {
    const [year, month, day] = dateString.split("/");
    return `${day}/${month}/${year}`;
  }
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

// Add task
function addTask() {
  const now = new Date();

  const newTask = {
    dueDate: getDueDateValue(now),
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
  let currentDateRaw = document.getElementById("taskDate").value;

  const currentDate = currentDateRaw
    ? formatDateForDisplayUnchangedInput(currentDateRaw)
    : "";

  const rowForEditing = editedRow - 1;
  const editedTask = {
    dueDate: dateInputChanged ? changedDate : currentDate,
    taskText: document.getElementById("taskText").value,
    taskStatus: document.getElementById("taskStatus").value,
    taskPriority: document.getElementById("taskPriority").value,
  };

  allTasks[rowForEditing] = { ...allTasks[rowForEditing], ...editedTask };

  displayTasks(allTasks);
  saveDataToLocalStorage(allTasks);
  resetForm();
  clearTaskInputFields();

  // Optionally reset flag after saving
  dateInputChanged = false;
  changedDate = "";
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
  allTasks = [];
  saveDataToLocalStorage(allTasks);
  displayTasks(allTasks);
}

function sortTasksAsc(taskList) {
  const sorted = taskList
    .slice()
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  displayTasks(sorted);
}

function sortTasksDesc(taskList) {
  const sorted = taskList
    .slice()
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  displayTasks(sorted);
}

// Update clock immediately and every second
updateClock();
setInterval(updateClock, 1000);
