import React, { Component } from 'react';
//import Clarifai from 'clarifai';
import './App.css';
import Signin from './components/SignIn/Signin';
import Register from './components/Register/Register';
import Facerecognition from './components/Facerecognition/Facerecognition';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import ParticlesBg from 'particles-bg'

const returnClarifairequestOption = (imageUrl) =>{

//Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '0f3ca6989f654a21b52b923e2e28b087';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'anas_mallick_35';       
const APP_ID = 'first-app';
//const MODEL_ID = 'face-detection';    
const IMAGE_URL = imageUrl;

const raw = JSON.stringify({
  "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": IMAGE_URL
              }
          }
      }
  ]
});
const requestOptions = {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
  },
  body: raw
}
  return requestOptions
}
  
const initialState = {
  input : '',
      imageUrl:'',
      box:{},
      route : 'signin',
      isSignedIn : false,
      user:{
        id : '',
        name : '',
        email : '' ,
        entries :0, 
        joined : ''
      }
}
    
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) =>{
    this.setState({user:{
      id : data.id,
        name : data.name,
        email : data.email ,
        entries : data.entries, 
        joined : data.joined
    }})
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = ()=>{
    this.setState({imageUrl:this.state.input});

    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifairequestOption(this.state.input))
        .then(response => response.json())
      .then(response => {
        if (response) {
          const apiUrl = process.env.REACT_APP_API_URL;
          fetch(`${apiUrl}/image`, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route)=>{
    if(route === 'signout')
    {
      this.setState(initialState)
    }
    else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }

  
  render(){
    
  return (
    <div className = "App">
       <ParticlesBg className = "particles" type="cobweb" bg={true} />
      <Navigation isSignedIn = {this.state.isSignedIn} onRouteChange = {this.onRouteChange}/>
      {this.state.route === 'home'
      ?
      <div>
      <Logo/>
      <Rank name={this.state.user.name} entries={this.state.user.entries}/>
     <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
     <Facerecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
     </div> 
      :
      (
        this.state.route === 'signin'
        ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> :
        <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      )
    
      
      }
    </div>
  );
  }
}

export default App;
