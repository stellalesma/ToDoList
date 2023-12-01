import './TaskList.css'

import { BiEditAlt } from "react-icons/bi";
import { MdDeleteOutline, MdDownloadDone } from 'react-icons/md';

function TaskList({ taskList, onEdit, onDelete, onDone }) {

    const displayTask = taskList.map((task, index) =>
        <li key={index}>
            <div>
                <span className='title'>{task[0]}</span>
                <div className='editDescrip'>
                    <span className='description'>{task[1]}</span>
                    <BiEditAlt className='edit' title='Edit' onClick={() => onEdit(index)} style={{color: 'gray', fontSize: '1.2em'}}/>
                </div>
            </div>
            <div className='icon'>
                <MdDeleteOutline className='delete' title='Delete' onClick={() => onDelete(index)} style={{color: 'white', fontSize: '2em'}}/>
                <MdDownloadDone title='Done' onClick={() => onDone(index)} style={{color: '#F55385', fontSize: '2em'}}/>
            </div>
        </li>
    );

    return (
        <>
            <ul>{displayTask}</ul>
        </>
    );
}

export default TaskList;
