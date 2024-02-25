import React from 'react';
import './imagelinkform.css';
const ImageLinkForm = ({onInputChange,onButtonSubmit}) =>{
    return(
        <div style = {{padding : '20px'}}>
            <p className='center f3'>
                {'Find Out the faces from your image. Try this out'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                <input className = 'f4 pa2 w-70 center'type = 'text' placeholder='Paste the image url' 
                onChange={onInputChange}/>
                <button className='w-30 f4 grow link ph3 pv2 dib white bg-light-purple' 
                onClick = {onButtonSubmit}>Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;