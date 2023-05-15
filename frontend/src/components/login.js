import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  const login = true
  const email = useRef()
  const password = useRef()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
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


  const initiateLogin = async () => {
    setLoading(true)
    if (email.current.value && password.current.value) {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json'
          }
        }
        const res = await axios.post('/api/user/login', {
          "email": email.current.value,
          "password": password.current.value
        }, config)
        if (res.data.success) {
          toast.success(res.data.message, toastconfig);
          email.current.value = ''
          password.current.value = ''
          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          delay(1000).then(() => {
            localStorage.setItem('userInfo', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
            window.location = ('/chats');
          });
        }
      } catch (error) {
        if (!error.response.data.success) {
          toast.error(error.response.data.message, toastconfig);
          email.current.value = ''
          password.current.value = ''
        }
        else {
          toast.error('Some Error Occured', toastconfig);
          email.current.value = ''
          password.current.value = ''
        }
      }
    }
    else {
      toast.error('Please fill all the fields!', toastconfig);
    }
    setLoading(false)
  }

  const initiateGuestLogin = async () => {
    setLoading(true)
    email.current.value = 'guestmail@chatapp.com'
    password.current.value = 'guestpassword'
    if (email.current.value && password.current.value) {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json'
          }
        }
        const res = await axios.post('/api/user/login', {
          "email": email.current.value,
          "password": password.current.value
        }, config)
        if (res.data.success) {
          toast.success(res.data.message, toastconfig);
          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          delay(1000).then(() => {
            localStorage.setItem('userInfo', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
            window.location = ('/chats');
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
      toast.error('Please fill all the fields!', toastconfig);
    }
    setLoading(false)
  }
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if(userInfo){
      window.location = '/chats'
    }
  }, [history])
  

  return (
    <div className=' m-auto bg-neutral-800 w-full overflow-y-hidden'>
      <ToastContainer />
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
                          <h4 className={`md:mb-5 mt-1 pb-1 text-xl font-semibold`}>
                            We are The ChatApp
                          </h4>
                        </div>

                        <form>
                          <p className="mb-4" hidden={!login}>Please Login to your account</p>

                          <div className="relative mb-4 border-2 border-black rounded-md" data-te-input-wrapper-init>
                            <input
                              type="email"
                              className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                              id="exampleFormControlInput1"
                              ref={email}
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


                          <div className="mb-12 pb-1 pt-1 text-center" hidden={!login}>
                            <button
                              className="mb-3 bg-gradient-to-r from-purple-900 to-pink-600 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                              type="button"
                              data-te-ripple-init
                              onClick={initiateLogin}
                              disabled={loading}
                              data-te-ripple-color="light">
                              Log in
                            </button>
                            <button
                              // onClick={}
                              className="mb-3 bg-gradient-to-r to-purple-900 from-pink-600 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                              type="button"
                              data-te-ripple-init
                              onClick={initiateGuestLogin}
                              disabled={loading}
                              data-te-ripple-color="light">
                              Login As Guest
                            </button>

                            <a href="#!">Forgot password?</a>
                          </div>


                          <div className="flex items-center justify-between pb-6">
                            <p className="mb-0 mr-2" hidden={!login}>Don't have an account?</p>
                            <Link
                              to={'/signup'}
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

export default Login