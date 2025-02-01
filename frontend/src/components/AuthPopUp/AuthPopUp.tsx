import React, { useEffect, useState } from "react";
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import logo from "../../assets/images/nav-image.png"
import "./AuthPopUp.css"
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify'; 
import { access } from "fs";



interface AuthPopUpProps {
  setShowpop: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SignupFormData {
  name: String | null,
  email: String | null,
  password: String | null,
  weightInKg: Number | null,
  heightInCm: Number | null,
  goal: String | null,
  gender: String | null,
  dob: Date | null,
  activityLevel: String | null
}

const AuthPopUp: React.FC<AuthPopUpProps> = ({ setShowpop, setIsLoggedIn })=>{

  const [showSignup, setShowSignup] = useState(false)

  const [signupformData, setSignupFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    weightInKg: 0.0,
    heightInCm: 0.0,
    goal: '',
    gender: '',
    dob: new Date(),
    activityLevel: ''
})
const [loginformData, setLoginFormData] = useState({
    email: '',
    password: '',
})

const handleLogin = async () => {
  try {
    console.log('Form data being sent:', loginformData);
    
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginformData),
      credentials: "include"
    });
    
    const data = await response.json();
    console.log("Full response data:", data);
    
    if (response.ok) {
      // Check if accessToken exists in the response
      if (data.accessToken) {
        // Store the access token in localStorage
        localStorage.setItem('accessToken', data.accessToken);
        console.log("Stored access token:", data.accessToken);
        
        // Additional login success actions
        toast.success(data.message || 'Sign-in successful!');
        setShowpop(false);
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('acessToken', data.accessToken);
      } else {
        console.warn("No access token found in response data");
        toast.error('Login failed: No access token received');
      }
    } else {
      // Handle error responses from the server
      toast.error(data.message || 'Sign-in failed. Please try again.');
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error('An error occurred during sign-in.');
  }
};


  const handleSignIn = async ()=>{
 console.log(signupformData)
 console.log(process.env.NEXT_PUBLIC_BACKEND_API);
  const response = await fetch('http://localhost:8080/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(signupformData),
    credentials: "include"
  });
  const data = await response.json();
  console.log(data)

  if (response.ok) {
    toast.success(data.message || 'Sign-in successful!');
    setShowSignup(false)
   
} else {
    toast.error(data.message || 'Sign-in failed. Please try again.');
}

        console.log(data);

  }
    return (
      <>
      {
        showSignup ? (
          <div className="authform">
            <button  className="close" 
            onClick={()=>{
              setShowpop(false);
            }}> <AiOutlineClose/></button>

          <div className="left">
            <img src={logo} alt="logo"/>
          </div>

          <div className="right">
            <h1>Sign up </h1>
            <form action="">

            <Input
            color="warning"
            placeholder="name"
            size="lg"
            variant="outlined"
            onChange={(e) => {
              setSignupFormData({
                  ...signupformData,
                  name: e.target.value
              })
          }}
          />
               
            <Input
            color="warning"
            placeholder="email"
            size="lg"
            variant="outlined"
            onChange={(e) => {
              setSignupFormData({
                  ...signupformData,
                  email: e.target.value
              })
          }}
            />

           <Input
            color="warning"
            placeholder="password"
            size="lg"
            variant="outlined"
            type="password"
            onChange={(e) => {
              setSignupFormData({
                  ...signupformData,
                  password: e.target.value
              })
          }}
            />

              {/* <Input 
                color="warning" 
                variant="outlined"  
                 size="lg" 
                 type="number" 
                 placeholder="Age"

                 onChange={(e) => {
                  setSignupFormData({
                      ...signupformData,
                      age: parseFloat(e.target.value)
                  })
              }}
                 /> */}

              <Input 
                color="warning" 
                variant= "outlined" 
                 size="lg" 
                 type="number"
                  placeholder="Weight"
                  onChange={(e) => {
                    setSignupFormData({
                        ...signupformData,
                        weightInKg: parseFloat(e.target.value)
                    })
                }}
                  />


          <Select
                                    color="warning"
                                    placeholder="Activity Level"
                                    size="lg"
                                    variant="outlined"

                                    onChange={(
                                        event: React.SyntheticEvent | null,
                                        newValue: string | null,
                                    ) => {
                                        setSignupFormData({
                                            ...signupformData,
                                            activityLevel: newValue?.toString() || ''
                                        })
                                    }}
                                >
                                    <Option value="sedentary">Sedentary</Option>
                                    <Option value="light">Light</Option>
                                    <Option value="moderate">Moderate</Option>
                                    <Option value="active">Active</Option>
                                    <Option value="veryActive">Very Active</Option>
                                </Select>


                                <Select
                                    color="warning"
                                    placeholder="Goal"
                                    size="lg"
                                    variant="outlined"

                                    onChange={(
                                        event: React.SyntheticEvent | null,
                                        newValue: string | null,
                                    ) => {
                                        setSignupFormData({
                                            ...signupformData,
                                            goal: newValue?.toString() || ''
                                        })
                                    }}
                                >
                                    <Option value="weightLoss">Lose</Option>
                                    <Option value="weightMaintain">Maintain</Option>
                                    <Option value="weightGain">Gain</Option>
                                </Select>




                                <Select
                                    color="warning"
                                    placeholder="Gender"
                                    size="lg"
                                    variant="outlined"

                                    onChange={(
                                        event: React.SyntheticEvent | null,
                                        newValue: string | null,
                                    ) => {
                                        setSignupFormData({
                                            ...signupformData,
                                            gender: newValue?.toString() || ''
                                        })
                                    }}
                                >
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                </Select>


            

                                 <label htmlFor="">Height</label>

         <Input 
         color="warning" 
         size="lg"
          variant="outlined"
           type="number" 
           placeholder='cm'

          onChange={(e) => {
            setSignupFormData({
                ...signupformData,
                heightInCm: parseFloat(e.target.value)
            })
        }}
    />
         {/* <Input color="warning" size="lg" variant="outlined" type="number" placeholder='inches'/> */}

         <label htmlFor="">Date of birth</label>
         <LocalizationProvider dateAdapter={AdapterDayjs}

>
    <DesktopDatePicker defaultValue={dayjs(new Date())}
        sx={{
            backgroundColor: 'white',
        }}

        onChange={(newValue) => {
            setSignupFormData({
                ...signupformData,
                dob: new Date(newValue as any)
            })
        }}
    />
</LocalizationProvider>

            </form>
            <button onClick={(e)=>{
              e.preventDefault();
              handleSignIn()
            }}>Sign up</button>
          </div>

          <div className="login-prompt">
      <p>Already have an account?</p>
      <button className="login-btn" 
      onClick={() => setShowSignup(false)}>Login</button>
    </div>
        </div>
        )
        :
        (
          <div className="authform">

             <button  className="close" 
            onClick={()=>{
              setShowpop(false);
            }}> <AiOutlineClose/></button>

            <div className="left">
              <img src={logo} alt="logo"/>
            </div>

            <div className="right">
              <h1>Login to be a beast</h1>
              <form action="">
                 
              <Input
              color="warning"
              placeholder="email"
              size="lg"
              variant="outlined"

              onChange={(e) => {
                setLoginFormData({
                    ...loginformData,
                    email: e.target.value
                })
            }}
        />

             <Input
              color="warning"
              placeholder="password"
              size="lg"
              variant="outlined"
              type="password"

              onChange={(e) => {
                setLoginFormData({
                    ...loginformData,
                    password: e.target.value
                })
            }}
        />

              </form>
              <button onClick={(e)=>{
                e.preventDefault();
                handleLogin()
              }}>Log in</button>
            </div>

            <p>Don't have an account?  <button onClick={() => {
                                setShowSignup(true)
                            }}>Signup</button></p>
          </div>
        )
      }
      </>
    )
}
export default AuthPopUp;