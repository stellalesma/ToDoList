import './styles.css'

import AddTask from './Components/AddTask';
import TaskList from './Components/TaskList';
import EditWindow from './Components/EditWindow';
import CompletedList from './Components/CompletedList';

import { useState, useEffect } from 'react';

// lorsque la page est vide, afficher une image
// ameliorer le design, surtout pour la partie add
// faire la persistance en creant mon propre fichier JSON


function App() {
	const [taskList, setTaskList] = useState([])
	const [taskToEdit, setTaskToEdit] = useState([])
	const [completedList, setCompletedList] = useState([])
	const [isModalVisible, setModalVisible] = useState(false)
	const [isCompletedList, setIsCompletedList] = useState(false)

	// useEffect(() => {
	// 	const taskToDoStored = localStorage.getItem('myToDoList');
	// 	const taskDoneStored = localStorage.getItem('myDoneList');
	  
	// 	if (taskToDoStored) {
	// 	  try {
	// 		setTaskList(JSON.parse(taskToDoStored));
	// 	  } catch (error) {
	// 		console.error("Erreur lors de l'analyse JSON de myToDoList :", error);
	// 	  }
	// 	}
	  
	// 	if (taskDoneStored) {
	// 	  try {
	// 		setCompletedList(JSON.parse(taskDoneStored));
	// 	  } catch (error) {
	// 		console.error("Erreur lors de l'analyse JSON de myDoneList :", error);
	// 	  }
	// 	}
	//   }, []);

	const handleAddTask = (newTask) => {
		setTaskList(() => {
			const updatedList = [
				{title: newTask.title, description: newTask.description},
				...taskList
			];
			localStorage.setItem('myToDoList', JSON.stringify(updatedList));
			return updatedList;
		});

		setIsCompletedList(false);
	};

	const handleDisplay = (bool) => {
		setIsCompletedList(bool);
	};

	const handleEditTask = (id) => {
		const tmp = taskList.slice(id)[0];
		setModalVisible(true);
		setTaskToEdit({title: tmp.title, description: tmp.description, id: id});
	};

	const handleSaveEditedTask = (editedTask) => {
		const tmpList = taskList.slice();
		tmpList[taskToEdit.id] = editedTask;
		setTaskList(tmpList);
		setTaskToEdit([]);
		setModalVisible(false);
		localStorage.setItem('myToDoList', JSON.stringify(tmpList));
	};


	const handleCancelEditedTask = (e) => {
		e.preventDefault();
		setTaskToEdit([]);
		setModalVisible(false);
	};

	const handleDeleteTask = (id) => {
		const tmpList = taskList.slice();
		tmpList.splice(id, 1);
		setTaskList(tmpList);
		localStorage.setItem('myToDoList', JSON.stringify(tmpList));
	};

	const handleDeleteCompletedTask = (id) => {
		const tmpList = completedList.slice();
		tmpList.splice(id, 1);
		setCompletedList(tmpList);
		localStorage.setItem('myDoneList', JSON.stringify(tmpList));
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

		setCompletedList(() => {
			const updatedList = [
				{title: tmpTask[0].title, description: tmpTask[0].description, date: formattedDate},
				...completedList
			];
			localStorage.setItem('myDoneList', JSON.stringify(updatedList));
			return updatedList;
		});

		setTaskList(tmpList);
		localStorage.setItem('myToDoList', JSON.stringify(tmpList));
	}

	useEffect(() => {
		const taskToDoStored = JSON.parse(localStorage.getItem('myToDoList'));
		const taskDoneStored = JSON.parse(localStorage.getItem('myDoneList'));

		if (taskToDoStored)
			setTaskList(taskToDoStored);
		if (taskDoneStored)
			setCompletedList(taskDoneStored);
	}, []);


	return (
		<>
			<p className='app' style={{padding: 50}}>My ToDo List</p>

			<div className="App">
				<AddTask onAddTask={handleAddTask} />
				<div className='DoneCompleted'>
					<button className={isCompletedList ? 'disable app' : 'enable app'} onClick={() => handleDisplay(false)}>To Do</button>
					<button className={isCompletedList ? 'enable app' : 'disable app'} onClick={() => handleDisplay(true)}>Completed</button>
				</div>

				{
					isCompletedList ?
						<CompletedList completedList={completedList} onDelete={handleDeleteCompletedTask} /> :
						<TaskList taskList={taskList} onEdit={handleEditTask} onDelete={handleDeleteTask} onDone={handleDoneTask} />
				}

				{ isModalVisible ? <EditWindow currentTitle={taskToEdit.title} currentDescription={taskToEdit.description} onSaveEdit={handleSaveEditedTask} onCancelEdit={handleCancelEditedTask} /> : null }

			</div>
		</>
	);
}

export default App;
