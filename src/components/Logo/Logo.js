import React from 'react';
import { Tilt } from 'react-tilt'
import brain from './logo.jpg';

const Logo = () =>{
    return(
        <div className = 'ma4 mt0'>
            <Tilt className = "Tilt br2 shadow-2" options={{max : 25}} style={{ height: 100, width: 100 }}>
      <div className='Tilt-inner' ><img  style = {{height: 100, width: 100 ,borderRadius:'20px'}}src = {brain} alt=''></img ></div>
    </Tilt>
        </div>
    );
}
export default Logo;