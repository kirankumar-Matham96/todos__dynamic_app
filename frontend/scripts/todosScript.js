// getting todoItemContainer
let todoItemsContainer = document.getElementById('todoItemsContainer');
let todoItemsUncheckedContainer = document.createElement('div');
let todoItemsCheckedContainer = document.createElement('div');
let checkedTitle = document.createElement('h2');
let checkedItemsCount = 0; // for counting the items   <-- need to store it in the local storage
let uncheckedItemsCount = 0; // for counting the items <-- need to store it in the local storage

checkedTitle.textContent = 'Completed';
// checkedTitle.textContent;
checkedTitle.classList.add('todo-items-heading-subpart', 'mt-5');

todoItemsCheckedContainer.appendChild(checkedTitle);

todoItemsContainer.appendChild(todoItemsUncheckedContainer);
todoItemsContainer.appendChild(todoItemsCheckedContainer);

let userInputEl = document.getElementById('todoUserInput');

// getting data from local storage
function getDataFromLocalStorage() {
	let stringifiedTodoList = localStorage.getItem('todoList');
	let parsedTodoList = JSON.parse(stringifiedTodoList);
	if (parsedTodoList === null) {
		return [];
	} else {
		return parsedTodoList;
	}
}

let todoList = getDataFromLocalStorage(); // calling function
// console.log(todoList);

// When status changed
function onStatusChange(inputElement, label, iconContainer, icon, idNumber) {
	label.classList.toggle('strike-through');

	// TODO: Trying to change checkbox style
	//  ***
	// console.log(inputElement);
	// inputElement.classList.toggle("checkbox-input-after-checked"); // <---- new feature* not working
	// ...

	// label.classList.add("strike-through");
	label.style.backgroundColor = '#000';
	iconContainer.style.backgroundColor = '#000';
	icon.style.color = '#fff';
	//

	let checked = todoList[idNumber].isChecked;
	if (checked === true) {
		todoList[idNumber].isChecked = false;
		uncheckedItemsCount++;
		checkedItemsCount--;
	} else {
		todoList[idNumber].isChecked = true;
		checkedItemsCount++;
		uncheckedItemsCount--;
	}
}

function deleteListItem(childToRemove) {
	let content = childToRemove.textContent;
	let index = todoList.findIndex(function (eachObject) {
		if (content === eachObject.text) {
			return true;
		} else {
			return false;
		}
	});

	// New feature: confirm delete action
	// ***
	let isDelete = confirm('Do you want to delete the task?');

	if (isDelete) {
		todoList.splice(index, 1);
		if (todoItemsUncheckedContainer.contains(childToRemove)) {
			todoItemsUncheckedContainer.removeChild(childToRemove);
			uncheckedItemsCount--;
			if (uncheckedItemsCount) {
				console.log('There are no tasks to do!');
			}
		} else if (todoItemsCheckedContainer.contains(childToRemove)) {
			todoItemsCheckedContainer.removeChild(childToRemove);
			checkedItemsCount--;
			if (checkedItemsCount === 0) {
				checkedTitle.textContent = '';
			} else {
				checkedTitle.textContent = 'Completed';
			}
		}
	}
	// ...
}

// Selecting a random color from a set of colors for label background depending on priority of the task.
// ***
let previousNumberSelected = -1;

function selectARandomBackgroundColorForLabelElement(
	importanceOfTask = 'general'
) {
	let colors = [
		'#F94144',
		'#F3722C',
		'#F8961E',
		'#F9C74F',
		'#90BE6D',
		'#43AA8B',
		'#577590',
	];
	let veryImportantColor = '#e70e02';
	let importantColor = '#3c096c';
	let optionalColor = '#d4d4aa';

	if (importanceOfTask === 'general') {
		let numberSelected;
		while (true) {
			numberSelected = Math.round(Math.random() * 7 - 1);
			if (numberSelected > 0 && previousNumberSelected !== numberSelected) {
				break;
			}
		}
		previousNumberSelected = numberSelected;
		return colors[numberSelected];
	} else if (importanceOfTask === 'vImportant') {
		return veryImportantColor;
	} else if (importanceOfTask === 'important') {
		return importantColor;
	} else if (importanceOfTask === 'optional') {
		return optionalColor;
	}
}
// ...

function createAndAppendTodo(topic, idNumber) {
	// Creating todo element
	let todoElement = document.createElement('li');
	todoElement.classList.add('todo-item-container', 'd-flex');
	let todoElementId = 'todoList' + idNumber;
	todoElement.setAttribute('id', todoElementId);

	// creating input element
	let inputElement = document.createElement('input');
	inputElement.setAttribute('type', 'checkbox');
	inputElement.id = 'checkBox' + idNumber;

	// checked or unchecked depends on the data stored in the local storage.
	let isChecked = todoList[idNumber].isChecked;
	inputElement.checked = isChecked;

	// console.log(inputElement);
	inputElement.classList.add('checkbox-input', 'd-flex');
	todoElement.appendChild(inputElement);

	// creating label container
	let labelContainer = document.createElement('div');
	labelContainer.classList.add('label-container', 'd-flex');
	todoElement.appendChild(labelContainer);

	// new feature: providing different colors to the label containers
	// ***
	// creating label element
	let label = document.createElement('label');
	label.classList.add('checkbox-label');
	let backgroundColorForLabelAndIconContainers =
		selectARandomBackgroundColorForLabelElement();
	label.style.backgroundColor = backgroundColorForLabelAndIconContainers; //<---- update after adding priority options to the tasks.
	// label.style.color = "#dee2ff";
	// label.style.color = "#b5e48c";
	// label.style.color = "#583101";
	// label.style.color = "#6f4518";
	// if (isChecked) {
	//     label.classList.add("strike-through");

	// }

	label.setAttribute('for', 'checkBox' + idNumber);
	let textContainerForLabel = document.createElement('span');
	textContainerForLabel.style.color = '#6f4518';
	textContainerForLabel.textContent = topic.text;
	label.appendChild(textContainerForLabel);
	// ...

	labelContainer.appendChild(label);

	// new feature: show text container
	// Struggle: while creating it, the strike-through disappeared. Also, background color was not changed for ths container. May be it is id problem. Need to check it.
	// ***
	// creating show text icon container
	let showTextIconContainer = document.createElement('div');
	showTextIconContainer.classList.add(
		// 'delete-icon-container',
		'show-text-icon'
	);
	showTextIconContainer.style.backgroundColor =
		backgroundColorForLabelAndIconContainers;
	labelContainer.appendChild(showTextIconContainer);
	// ...

	// creating iconContainer
	let iconContainer = document.createElement('div');
	iconContainer.classList.add('delete-icon-container');
	iconContainer.style.backgroundColor =
		backgroundColorForLabelAndIconContainers; //< ---- new feature
	labelContainer.appendChild(iconContainer);

	// New feature: shows text when click and hold
	// ***
	// creating an eye-show text icon
	let showTextIcon = document.createElement('i');
	// <i class="far fa-eye-slash"></i>
	showTextIcon.classList.add(
		'far',
		'fa-eye-slash',
		'delete-icon',
		'show-text-icon'
	);
	showTextIconContainer.appendChild(showTextIcon);
	// ...

	// creating an delete icon element
	// let deleteIcon = document.createElement('i');
	let icon = document.createElement('i');
	// deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
	icon.classList.add('far', 'fa-trash-alt', 'delete-icon');
	// iconContainer.appendChild(deleteIcon);
	iconContainer.appendChild(icon);
	icon.onclick = function () {
		let childToRemove = document.getElementById(todoElementId);
		deleteListItem(childToRemove);
	};

	// New feature: when checked, the appearance of the element will change
	// ***
	inputElement.onclick = function () {
		// onStatusChange(inputElement, label, iconContainer, deleteIcon, idNumber);
		onStatusChange(inputElement, label, iconContainer, icon, idNumber);
	};

	if (isChecked) {
		label.classList.add('strike-through');
		label.style.backgroundColor = '#000';
		iconContainer.style.backgroundColor = '#000';
		showTextIconContainer.style.backgroundColor = '#000';
		todoItemsCheckedContainer.appendChild(todoElement);
		checkedItemsCount++;
	} else {
		todoItemsUncheckedContainer.appendChild(todoElement);
		uncheckedItemsCount++;
	}
	// ...
	// todoItemsContainer.appendChild(todoElement);
}

// Adding new task function to create a new task whenever associated event triggered
//
function addingNewTask() {
	// adding new todoList object
	let newTask = document.getElementById('todoUserInput').value;

	// maybe in the future it will be needed for asynchronous functionality***
	// ***
	// const timestampForTaskCreated = function() {
	//     // let timeStamp = new Date();
	//     // return timeStamp.toString();
	//     return Date().toString();
	// };
	// ...

	if (newTask.length !== 0) {
		let newObject = {
			text: newTask,
			isChecked: false,
			// createdAt: timestampForTaskCreated()
			createdAt: Date().toString(),
		};

		// Why not newObject not having createdAt key in it?
		// Struggle: Cannot add new key to the object and store in local storage.
		// ***
		// console.log(newObject);
		// Solved: Don't know how, but suddenly it was working after logged it to the console.
		// ...

		todoList.push(newObject);
		let idNumber = todoList.indexOf(newObject);
		createAndAppendTodo(newObject, idNumber);
	} else {
		alert('Please enter a valid input');
		return;
	}
	document.getElementById('todoUserInput').value = ''; // resetting input to empty
}
//

// showing all the todos
let addButton = document.getElementById('addTodoButton');

//onclick event for add button
addButton.onclick = function () {
	addingNewTask();
};

// keydown event for input element
userInputEl.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		addingNewTask();
	}
});

// save the data to the local storage
let saveBtn = document.getElementById('saveTodoButton');
saveBtn.onclick = function () {
	localStorage.setItem('todoList', JSON.stringify(todoList));
};

// New feature: help button to guide the user
// ***
let helpSection = document.getElementById('helpSection');
let helpBtn = document.getElementById('helpBtn');

helpBtn.addEventListener('blur', function () {
	helpSection.classList.add('d-none');
});

helpBtn.addEventListener('click', function () {
	if (helpSection.classList.contains('d-none')) {
		helpSection.classList.remove('d-none');
	} else {
		helpSection.classList.add('d-none');
	}
});

// ...

// displaying the items in todoList
for (let topic of todoList) {
	let idNumber = todoList.indexOf(topic);
	createAndAppendTodo(topic, idNumber);
}
