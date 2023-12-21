import './../styles.css'

import { useState } from 'react'

function AddTask({ onAddTask }) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const handleTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleDescription = (e) => {
        setDescription(e.target.value);
    };

    const handleCancel = () => {
        setTitle("");
        setDescription("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (title.trim() && description.trim()) {
            const task = {
                title : title.trim(),
                description : description.trim(),
            }
            onAddTask(task);
            setTitle('');
            setDescription('');
        }
    };

    return (
        <form className='addTask' onSubmit={handleSubmit}>

                <div className='addTask'>
                    <label className='addTask' htmlFor="title">Title :</label>
                    <input type="text" id="title" name="title" placeholder="Please, set a title for your Task..." value={title} onChange={handleTitle} className='addTask defaultText'></input>
                    { (!title.trim()) ? <p className='warning'>* The title is empty. Please, fill it out before adding...</p> : null }

                    <label className='addTask' htmlFor="description">Description :</label>
                    <textarea type="text" id="description" name="description" placeholder="Please, set a description for your Description..." value={description} onChange={handleDescription} className='addTask defaultText'></textarea>
                    { (title.trim() && !description.trim()) ? <p className='warning'>* The description is empty. Please, fill it out before adding...</p> : null }

                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <button className={ (title.trim() && description.trim()) ? 'addTask enable' : 'addTask disable'} type='submit'>Add</button>
                        <button className='addTask enable' style={{marginLeft: '50px'}} onClick={handleCancel}>Cancel</button>
                    </div>
                </div>

        </form>
    );
}

export default AddTask;
