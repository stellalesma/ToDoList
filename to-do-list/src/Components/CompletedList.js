import './../styles.css'

import { MdDeleteOutline } from 'react-icons/md';

function CompletedList({ completedList, onDelete }) {

    const displayTask = completedList.map((task, index) =>
        <li key={index}>
            <div>
                <p className='textCompleted title' style={{width: '800px'}}>{task.title}</p>
                <p className='textCompleted description'>{task.description}</p>
                <p className='date'>Completed on : {task.date}</p>
            </div>
            <div className='iconCompleted'>
                <MdDeleteOutline title='Delete' onClick={() => onDelete(index)} className='icon' style={{color: 'white', fontSize: '2em'}}/>
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
