import './CompletedList.css'

import { MdDeleteOutline } from 'react-icons/md';

function CompletedList({ completedList, onDelete }) {

    const displayTask = completedList.map((task, index) =>
        <li key={index}>
            <div>
                <span className='title'>{task[0]}</span>
                <span className='description'>{task[1]}</span>
                <span className='date_time'>Completed on : {task[2]}</span>
            </div>
            <div className='icon'>
                <MdDeleteOutline title='Delete' onClick={() => onDelete(index)} style={{color: 'white', fontSize: '2em'}}/>
            </div>
        </li>
    );

    return (
        <>
            <ul>{displayTask}</ul>
        </>
    );
}

export default CompletedList;
