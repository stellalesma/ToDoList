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
				console.error("Fetch error:", response.statusText);
				throw new Error("Network response was not ok");
			}
		} catch (err) {
			console.error("Fetch error:", err.message);
			return err;
		}
	}

    const post = (url, options) => {
      options.method = "POST"
      return customFetch(url, options)
    }
  
    const put = (url, options) => {
      options.method = "PUT"
      return customFetch(url, options)
    }
  
    const del = (url, options) => {
      options.method = "DELETE"
      return customFetch(url, options)
    }

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
			// localStorage.setItem('myToDoList', JSON.stringify(updatedList));
			const options = {
				body: newTask
			}
			console.log(newTask)
			post("http://localhost:5000/mytodolist", options);
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
		// localStorage.setItem('myToDoList', JSON.stringify(tmpList));
		const options = {
			body: editedTask
		}
		put("http://localhost:5000/mytodolist", options);
	};


	const handleCancelEditedTask = (e) => {
		e.preventDefault();
		setTaskToEdit([]);
		setModalVisible(false);
	};

	const handleDeleteTask = (id) => {
		const tmpList = taskList.slice();
		const deletedTask = tmpList.splice(id, 1);
		setTaskList(tmpList);
		// localStorage.setItem('myToDoList', JSON.stringify(tmpList));
		const options = {
			body: deletedTask[0]
		}
		del("http://localhost:5000/mytodolist", options);
	};

	const handleDeleteCompletedTask = (id) => {
		const tmpList = completedList.slice();
		const deletedTask = tmpList.splice(id, 1);
		setCompletedList(tmpList);
		// localStorage.setItem('myDoneList', JSON.stringify(tmpList));
		const options = {
			body: deletedTask[0]
		}
		del("http://localhost:5000/mydonelist", options);
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
		const tmpTask = tmpList.splice(id, 1)[0] // return an array and each element in tmpList is also an array
		const formattedDate = currentDate.toLocaleString('en-US', options);

		setCompletedList(() => {
			const updatedList = [
				{ title: tmpTask.title, description: tmpTask.description, date: formattedDate },
				...completedList
			];
			// localStorage.setItem('myDoneList', JSON.stringify(updatedList));
			const options = {
				body: { title: tmpTask.title, description: tmpTask.description, date: formattedDate }
			}
			post("http://localhost:5000/mydonelist", options);
			return updatedList;
		});

		setTaskList(tmpList);
		// localStorage.setItem('myToDoList', JSON.stringify(tmpList));
		const options2 = {
			body: tmpTask
		}
		del("http://localhost:5000/mytodolist", options2);
	}

	useEffect(() => {
		const get = (url, options = {}) => customFetch(url, options)

		Promise.all([get("http://localhost:5000/mytodolist"), get("http://localhost:5000/mydonelist")])
			.then(([parse1, parse2]) => {
				console.log("Données à parser1 :", parse1[0].title);
				console.log("Données à parser2 :", parse2);


				const taskToDoStored = parse1;
				const taskDoneStored = parse2;

				if (taskToDoStored)
					setTaskList(taskToDoStored);
				if (taskDoneStored)
					setCompletedList(taskDoneStored);
			})
			.catch(error => {
				console.error("Erreur lors de la récupération des données :", error);
			});
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
