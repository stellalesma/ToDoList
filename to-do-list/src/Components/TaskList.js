import './../styles.css'

import { RiEdit2Line } from "react-icons/ri";
import { MdDeleteOutline, MdDownloadDone } from 'react-icons/md';

function TaskList({ taskList, onEdit, onDelete, onDone }) {

    const displayTask = taskList.map((task, index) =>
        <li key={index}>
            <div>
                <p className='textToDo title'>{task.title}</p>
                <p className='textToDo description'>{task.description}</p>
            </div>
            <div className='iconTask'>
                <RiEdit2Line title='Edit' onClick={() => onEdit(index)} className='icon' style={{color: '#F55385', fontSize: '2em', marginRight: '10'}}/>
                <MdDownloadDone title='Done' onClick={() => onDone(index)} className='icon' style={{color: '#F55385', fontSize: '2em', marginRight: '10'}}/>
                <MdDeleteOutline title='Delete' onClick={() => onDelete(index)} className='icon' style={{color: 'white', fontSize: '2em'}}/>
            </div>
        </li>
    );

    return (
        <>
            {
                taskList.length !== 0 ? 
                (
                    <ul>{displayTask}</ul>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <img src='../public/no_task.jpg' alt='no task' />
                        <p style={{ color: 'white', marginTop: '20px', marginBottom: '20px' }}>No Task</p>
                    </div>
                )
            }
        </>
    );
}

export default TaskList;
