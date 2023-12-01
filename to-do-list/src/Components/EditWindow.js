import './EditWindow.css'

import { useState } from 'react'
import { MdOutlineCancel } from "react-icons/md";

function EditWindow({ currentTitle, currentDescription, onSaveEdit, onCancelEdit }) {
    const [isTitle, setIsTitle] = useState(false)
    const [newTitle, setNewTitle] = useState(currentTitle)
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [isDescription, setIsDescription] = useState(false)
    const [newDescription, setNewDescription] = useState(currentDescription)

    const handleTitle = (e) => {
        setNewTitle(e.target.value);
    };

    const handleDescription = (e) => {
        setNewDescription(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        if (newTitle) setIsTitle(true);
        else setIsTitle(false);

        if (newDescription) setIsDescription(true);
        else setIsDescription(false);

        if (newTitle && newDescription) {
            setIsTitle(true);
            setIsDescription(true);
            onSaveEdit([newTitle, newDescription]);
            setNewTitle('');
            setNewDescription('');
        }
    };
    
    return (
        <div>
            <div className="overlay" />

            <MdOutlineCancel title='Cancel' onClick={onCancelEdit} style={{color: 'gray', fontSize: '1.2em', position: 'absolute', top: '10px', right: '10px'}}/>

            <form className='modal' onSubmit={handleSubmit}>

                <p className='editWindow'>Modify a task</p>
                <section className='editWindow'>
                    <div className='editWindow'>
                        <label className='editWindow' htmlFor="title">Title :</label>
                        <input className='defaultText' type="text" id="title" name="title" placeholder="Please, set a title for your Task..." value={newTitle} onChange={handleTitle}></input>
                    </div>
                    { (hasSubmitted && !isTitle) ? <p className='warning editWarning'>* The title is empty. Please, fill it out before adding...</p> : null }

                    <div className='editWindow'>
                        <label className='editWindow' htmlFor="description">Description :</label>
                        <input className='defaultText' type="text" id="description" name="description" placeholder="Please, set a description for your Description..." value={newDescription} onChange={handleDescription}></input>
                    </div>
                    { (hasSubmitted && isTitle && !isDescription) ? <p className='warning editWarning'>* The description is empty. Please, fill it out before adding...</p> : null }

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
