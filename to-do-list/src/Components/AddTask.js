import './AddTask.css'

import { useState } from 'react'

function AddTask({ onAddTask }) {
    const [title, setTitle] = useState("")
    const [isTitle, setIsTitle] = useState(false)
    const [description, setDescription] = useState("")
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [isDescription, setIsDescription] = useState(false)

    const handleTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleDescription = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        if (title) setIsTitle(true);
        else setIsTitle(false);

        if (description) setIsDescription(true);
        else setIsDescription(false);

        if (title && description) {
            setIsTitle(true);
            setIsDescription(true);
            onAddTask([title, description]);
            setTitle('');
            setDescription('');
        }
    };

    return (
        <form className='addTask' onSubmit={handleSubmit}>

            <section className='addTask'>
                <div className='addTask'>
                    <label className='addTask' htmlFor="title">Title :</label>
                    <input type="text" id="title" name="title" placeholder="Please, set a title for your Task..." value={title} onChange={handleTitle} className='defaultText'></input>
                </div>

                <div className='addTask'>
                    <label className='addTask' htmlFor="description">Description :</label>
                    <input type="text" id="description" name="description" placeholder="Please, set a description for your Description..." value={description} onChange={handleDescription} className='defaultText'></input>
                </div>

                <button className={ (title && description) ? 'addTask enable' : 'addTask disable'} type='submit'>Add</button>
            </section>

            {
                (hasSubmitted && !isTitle) ? <p className='warning'>* The title is empty. Please, fill it out before adding...</p> :
                    (hasSubmitted && isTitle && !isDescription) ? <p className='warning'>* The description is empty. Please, fill it out before adding...</p> : null
            }

        </form>
    );
}

export default AddTask;
