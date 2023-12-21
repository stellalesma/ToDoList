import './styles.css'

import AddTask from './Components/AddTask';
import TaskList from './Components/TaskList';
import EditWindow from './Components/EditWindow';
import CompletedList from './Components/CompletedList';

import { useState, useEffect, useCallback } from 'react';

// lorsque la page est vide, afficher une image
// ameliorer le design, surtout pour la partie add
// faire la persistance en creant mon propre fichier JSON

function App() {
	const [taskList, setTaskList] = useState([])
	const [taskToEdit, setTaskToEdit] = useState([])
	const [completedList, setCompletedList] = useState([])
	const [isModalVisible, setModalVisible] = useState(false)
	const [isCompletedList, setIsCompletedList] = useState(false)

	const customFetch = async (url, options = {}) => {
		const defaultMethod = "GET"
		const defaultHeaders = {
			"Content-Type": "application/json",
			Accept: "application/json",
		}

		options.method = options.method || defaultMethod
		options.headers = options.headers ?
			{
				...defaultHeaders,
				...options.headers
			} :
			defaultHeaders

		options.body = JSON.stringify(options.body) || false
		if (!options.body) delete options.body

		try {
			const response = await fetch(url, options);
			if (response.ok) {
				return await response.json();
			} else {
				console.log(response)
				console.error("Fetch error:", response.statusText);
				throw new Error("Network response was not ok");
			}
		} catch (err) {
			console.error("Fetch error:", err.message);
			return err;
		}
	}

    const post = useCallback((url, options) => {
      options.method = "POST"
      return customFetch(url, options)
    }, [])
  
    const patch = (url, options) => {
      options.method = "PATCH"
      return customFetch(url, options)
    }
  
    const del = (url, options = {}) => {
      options.method = "DELETE"
      return customFetch(url, options)
    }

	const handleAddTask = useCallback((newTask) => {
		const options = {
			body: {
				title: newTask.title,
				description: newTask.description,
				completed: false,
			}
		}
		post("http://localhost:5000/mytodolist", options);
		
		setTaskList([newTask, ...taskList]);
		setIsCompletedList(false);
	}, [taskList, post]);

	const handleDisplay = (bool) => {
		setIsCompletedList(bool);
	};

	const handleEditTask = (id) => {
		const tmp = taskList.slice(id)[0];
		setModalVisible(true);
		console.log(tmp)
		console.log(tmp.id)
		setTaskToEdit({title: tmp.title, description: tmp.description, id: tmp.id, index: id});
	};

	const handleSaveEditedTask = (editedTask) => {
		const tmpList = taskList.slice();
		tmpList[taskToEdit.index] = editedTask;
		
		const options = {
			body: {
				title: editedTask.title,
				description: editedTask.description,
			}
		}
		console.log(`id = ${taskToEdit.id}`)
		patch(`http://localhost:5000/mytodolist/${taskToEdit.id}`, options);
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
		const tmpList = taskList.slice();
		const deletedTask = tmpList.splice(id, 1)[0];
		
		del(`http://localhost:5000/mytodolist/${deletedTask.id}`);
		setTaskList(tmpList);
	};

	const handleDeleteCompletedTask = (id) => {
		const tmpList = completedList.slice();
		const deletedTask = tmpList.splice(id, 1)[0];

		del(`http://localhost:5000/mytodolist/${deletedTask.id}`);
		setCompletedList(tmpList);
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
		const tmpTask = tmpList.splice(id, 1)[0]
		const formattedDate = currentDate.toLocaleString('en-US', options);

		const optionsPatch = {
			body: {
				date: formattedDate,
				completed: true,
			}
		}
		
		patch(`http://localhost:5000/mytodolist/${tmpTask.id}`, optionsPatch);

		setCompletedList(() => {
			const updatedList = [
				{ title: tmpTask.title, description: tmpTask.description, date: formattedDate },
				...completedList
			];
			return updatedList;
		});
		setTaskList(tmpList);
	}

	useEffect(() => {
		const get = (url, options = {}) => customFetch(url, options)

		Promise.all([get("http://localhost:5000/mytodolist")])
			.then(([taskStored]) => {

				const taskToDoStored = []
				const taskDoneStored = []

				if (Array.isArray(taskStored)) {
					for (const task of taskStored) {
						if (task.completed) taskDoneStored.push(task)
						else taskToDoStored.push(task)
					}
				}

				setTaskList(taskToDoStored.sort((a, b) => b.id - a.id));
				setCompletedList(taskDoneStored.sort((a, b) => new Date(b.date) - new Date(a.date)));
			})
			.catch(error => {
				console.error("Error while recovering data :", error);
			});
	}, [handleAddTask]);

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
