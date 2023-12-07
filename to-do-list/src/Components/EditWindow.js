import './../styles.css'

import { useState } from 'react'
import { MdOutlineCancel } from "react-icons/md";

function EditWindow({ currentTitle, currentDescription, onSaveEdit, onCancelEdit }) {
    const [newTitle, setNewTitle] = useState(currentTitle)
    const [newDescription, setNewDescription] = useState(currentDescription)

    const handleTitle = (e) => {
        setNewTitle(e.target.value);
    };

    const handleDescription = (e) => {
        setNewDescription(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newTitle.trim() && newDescription.trim()) {
            onSaveEdit({title: newTitle.trim(), description: newDescription.trim()});
            setNewTitle('');
            setNewDescription('');
        }
    };
    
    return (
        <div>
            <div className="overlay" />

            <MdOutlineCancel title='Cancel' onClick={onCancelEdit} className='icon' style={{color: 'gray', fontSize: '1.2em', position: 'absolute', top: '10px', right: '10px'}}/>

            <form className='modal' onSubmit={handleSubmit}>

                <p className='editWindow'>Modify a task</p>
                <section className='editWindow'>
                    <div className='editWindow'>
                        <label className='editWindow' htmlFor="title">Title :</label>
                        <input className='editWindow defaultText' type="text" id="title" name="title" placeholder="Please, set a title for your Task..." value={newTitle} onChange={handleTitle}></input>
                    </div>
                    { (!newTitle.trim()) ? <p className='warning editWarning'>* The title is empty. Please, fill it out before adding...</p> : null }

                    <div className='editWindow'>
                        <label className='editWindow' htmlFor="description">Description :</label>
                        <textarea className='editWindow defaultText' type="text" id="description" name="description" placeholder="Please, set a description for your Description..." value={newDescription} onChange={handleDescription}></textarea>
                    </div>
                    { (newTitle.trim() && !newDescription.trim()) ? <p className='warning editWarning'>* The description is empty. Please, fill it out before adding...</p> : null }

                    <div className='editWindow editButtons'>
                        <button className='editWindow' onClick={onCancelEdit}>Cancel</button>
                        <button className='editWindow' type='submit'>Save</button>
                    </div>
                </section>

            </form>

        </div>
    );
}

export default EditWindow;
