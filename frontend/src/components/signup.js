import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Signup = () => {
  const login = false;
  const username = useRef()
  const email = useRef()
  const password = useRef()
  const confirmPassword = useRef()
  const [picture, setpicture] = useState()
  const [loading, setLoading] = useState(false)
  const [picloading, setPicloading] = useState(false)
  const history = useHistory()
  const toastconfig = {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  const initiateSignup = async () => {
    if (username.current.value === '' || email.current.value === '' || password.current.value === '' || confirmPassword.current.value === '') {
      toast.error('Please fill all the fields!', toastconfig);
    }
    else {
      if (confirmPassword.current.value === password.current.value) {
        setLoading(true);
        try {
          const config = {
            headers: {
              'Content-type': 'application/json'
            }
          }

          const res = await axios.post('/api/user/register', {
            "name": username.current.value,
            "email": email.current.value,
            "password": password.current.value,
            "picture": picture
          }, config)
          if (res.data.success) {
            toast.success(res.data.message, toastconfig);
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            delay(1000).then(() => {
              localStorage.setItem('userInfo', JSON.stringify(res.data.user));
              localStorage.setItem('token', JSON.stringify(res.data.token));
              history.push('/chats');
            });
          }
        } catch (error) {
          if (!error.response.data.success) {
            toast.error(error.response.data.message, toastconfig);
          }
          else {
            toast.error('Some Error Occured', toastconfig);
          }
        }
      }
      else {
        toast.error('Password does not match!', toastconfig);
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if(userInfo){
      history.push('/chats')
    }
  }, [history])


  const postDetails = async (pics) => {
    setPicloading(true)
    if (pics === undefined) {
      toast.error('Please Upload a Image!', toastconfig);
    }
    else {
      try {
        const data = new FormData();
        data.append('file', pics)
        data.append("upload_preset", "chatapp")
        data.append('cloud_name', 'dwlv8kxbb')
        const res = await fetch('https://api.cloudinary.com/v1_1/dwlv8kxbb/image/upload', {
          method: 'post',
          body: data
        })
        const respose = await res.json()
        setpicture(respose.url.toString())
        setPicloading(false)
      } catch (error) {
        console.log(error)
        setPicloading(false)
      }
    }
  }


  return (
    <div className=' m-auto bg-neutral-800 w-full overflow-y-hidden container'>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="m-auto w-max">
        <section className="gradient-form h-full bg-neutral-200 dark:bg-neutral-700 w-3/4 m-auto">
          <div className="container h-full p-10 bg-neutral-800">
            <div
              className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
              <div className="w-full">
                <div
                  className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
                  <div className="g-0 lg:flex lg:flex-wrap">
                    <div className="px-4 md:px-0 lg:w-6/12 ">
                      <div className={`md:mx-6 md:pr-12 md:pl-12 md:pb-12  ${login ? 'md:pt-12' : 'md:pt-0'}`}>
                        <div className="text-center">
                          <img
                            className="mx-auto w-48"
                            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                            alt="logo" />
                          <h4 className={`${login ? 'md:mb-12' : 'md:mb-5'} mt-1 pb-1 text-xl font-semibold`}>
                            We are The ChatApp
                          </h4>
                        </div>

                        <form>
                          <p className="mb-4" hidden={login}>Create a New Account</p>
                          <div className="relative mb-4 border-2 border-black rounded-md" data-te-input-wrapper-init hidden={login}>
                            <input
                              type="name"
                              className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                              id="exampleFormControlInput1"
                              ref={username}
                              placeholder="Username" />
                            <label
                              htmlFor="name"
                              className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                            >Username
                            </label>
                          </div>
                          <div className="relative mb-4 border-2 border-black rounded-md" data-te-input-wrapper-init>
                            <input
                              type="email"
                              ref={email}
                              className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                              id="exampleFormControlInput1"
                              placeholder="email" />
                            <label
                              htmlFor="email"
                              className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                            >Email
                            </label>
                          </div>

                          <div className="relative mb-4 border-2 border-black rounded-md" data-te-input-wrapper-init>
                            <input
                              type="password"
                              className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                              id="exampleFormControlInput11"
                              ref={password}
                              placeholder="Password" />
                            <label
                              htmlFor="exampleFormControlInput11"
                              className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                            >Password
                            </label>
                          </div>
                          <div className="relative mb-4 border-2 border-black rounded-md" data-te-input-wrapper-init hidden={login}>
                            <input
                              type="password"
                              className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                              id="exampleFormControlInput11"
                              ref={confirmPassword}
                              placeholder="Password" />
                            <label
                              htmlFor="exampleFormControlInput11"
                              className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                            >Confirm Password
                            </label>
                          </div>
                          <div className="relative mb-4 border-2 p-3 border-black rounded-md" hidden={login}>
                            <div className="block mb-2" htmlFor="file_input">Upload Profile Photo 	&#40;Optional&#41;</div>
                            <input onChange={(e) => { postDetails(e.target.files[0]) }} accept="image/*" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />
                          </div>



                          <div className={`${login ? 'mb-12' : 'mb-1'} pb-1 pt-1 text-center`} hidden={login}>
                            <button
                              className="mb-3 bg-gradient-to-r from-purple-900 to-pink-600 disabled:opacity-50 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                              type="button"
                              data-te-ripple-init
                              disabled={picloading}
                              onClick={initiateSignup}
                              data-te-ripple-color="light">
                              Register
                            </button>
                            <div>&nbsp;</div>
                          </div>

                          <div className="flex items-center justify-between pb-6">
                            <p className="mb-0 mr-2" hidden={login}>Already have an account?</p>
                            <Link
                              to={'/'}
                              type="button"
                              className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                              data-te-ripple-init
                              data-te-ripple-color="light">
                              {login ? 'Register' : 'Login'}
                            </Link>
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none bg-gradient-to-r from-purple-900 to-pink-600">
                      <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                        <h4 className="mb-6 text-xl font-semibold">
                          We are more than just a company
                        </h4>
                        <p className="text-sm">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip ex
                          ea commodo consequat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Signup