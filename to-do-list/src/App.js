import './App.css';
import AddTask from './Components/AddTask';
import TaskList from './Components/TaskList';
import EditWindow from './Components/EditWindow';
import CompletedList from './Components/CompletedList';

import { useState } from 'react';

function App() {
	const [taskList, setTaskList] = useState([])
	const [taskToEdit, setTaskToEdit] = useState([])
	const [completedList, setCompletedList] = useState([])
	const [isModalVisible, setModalVisible] = useState(false);
	const [isCompletedList, setIsCompletedList] = useState(false)

	const handleAddTask = (newTask) => {
		setTaskList([newTask, ...taskList]);
		setIsCompletedList(false)
	};

	const handleDisplay = (bool) => {
		setIsCompletedList(bool);
	};

	const handleEditTask = (id) => {
		const tmp = taskList.slice(id)[0];
		setModalVisible(true);
		setTaskToEdit([tmp[0], tmp[1], id]);
	};

	const handleSaveEditedTask = (editedTask) => {
		const tmpList = taskList.slice();
		tmpList[taskToEdit[2]] = editedTask;
		setTaskList(tmpList);
		setTaskToEdit([]);
		setModalVisible(false);
	};


	const handleCancelEditedTask = (e) => {
		e.preventDefault();
		setTaskToEdit([]);
		setModalVisible(false);
	};

	const handleDeleteTask = (id) => {
		const tmpList = taskList.slice()
		tmpList.splice(id, 1)
		setTaskList(tmpList)
	};

	const handleDeleteCompletedTask = (id) => {
		const tmpList = completedList.slice()
		tmpList.splice(id, 1)
		setCompletedList(tmpList)
	};

	const handleDoneTask = (id) => {

		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric', 
			minute: 'numeric', 
			second: 'numeric',
		};

		const currentDate = new Date();
		const tmpList = taskList.slice()
		const tmpTask = tmpList.splice(id, 1) // return an array and each element in tmpList is also an array
		const formattedDate = currentDate.toLocaleString('en-US', options);
		
		console.log(formattedDate);
		// setCompletedList(completedList.concat(tmpList.splice(id, 1)))
		setCompletedList([[tmpTask[0][0], tmpTask[0][1], formattedDate], ...completedList])
		setTaskList(tmpList)
	}

	return (
		<>
			<p className='app'>My ToDo List</p>

			<div className="App">
				<AddTask onAddTask={handleAddTask} />
				<div className='DoneCompleted'>
					<button className={isCompletedList ? 'default' : 'clicked'} onClick={() => handleDisplay(false)}>To Do</button>
					<button className={isCompletedList ? 'clicked' : 'default'} onClick={() => handleDisplay(true)}>Completed</button>
				</div>

				{
					isCompletedList ?
						<CompletedList completedList={completedList} onDelete={handleDeleteCompletedTask} /> :
						<TaskList taskList={taskList} onEdit={handleEditTask} onDelete={handleDeleteTask} onDone={handleDoneTask} />
				}

				{ isModalVisible ? <EditWindow currentTitle={taskToEdit[0]} currentDescription={taskToEdit[1]} onSaveEdit={handleSaveEditedTask} onCancelEdit={handleCancelEditedTask} /> : null }

			</div>
		</>
	);
}

export default App;
