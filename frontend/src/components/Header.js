import React, { useContext, useEffect, useState } from "react";
import logo from "../images/skillhub.png";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Header = () => {
  let { user } = useContext(AuthContext);
  let { logout } = useContext(AuthContext);
  let navigtate = useNavigate();
  const [categories, setCategories] = useState([])
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false)

  const fetchCategories = async () => {
    try{
      const response = await axios.get(
        'http://127.0.0.1:8000/courses/view_categories/'

      )
      setCategories(response.data)

    }
    catch(error){
      console.error("error fetching categories in header",error)
    }
  }
  const toggleCategoriesMenu = () => {
    setShowCategoriesMenu(!showCategoriesMenu);
  };

  useEffect(()=>{
    fetchCategories()
  },[])

  return (
    // <div>
    //     {/* <img src='../skillhub-logo.png' alt='skillhub'/> */}
    //     <Link to='/'>Home</Link>
    //     <span> | </span>
    //     {user ? <div><p onClick={()=>{navigtate('/profile')}}>Welcome {user.name}  </p> <p onClick={logout}>Logout</p></div> : <Link to='/login'>Login</Link>}
    //     {/* <Link to='/login'>Login</Link>
    //     {user && <p>{user.name}</p>} */}

    // </div>
    <div>
      <header>
        <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800  top-0 w-full z-50">
          <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="/" class="flex items-center">
              <img src={logo} class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
              <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Skillhub
              </span>
            </a>
            <div class="flex items-center lg:order-2">
              <a
                href="#"
                class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                {user && (
                  <div>
                    <p
                      onClick={() => {
                        navigtate("/profile");
                      }}
                    >
                      Welcome {user.name}{" "}
                    </p>
                  </div>
                )}
              </a>
              {/* <a href="#" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                      {user ? (null) : (<Link to='/register'>Sign up</Link>) }
                    </a> */}
              {user ? null : (
                <a
                  href="#"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  <Link to="/register">Sign up</Link>
                </a>
              )}
              <a
                href="#"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {user ? (
                  <p onClick={logout}>Logout</p>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </a>
            </div>
            <div
              class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
              id="mobile-menu-2"
            >
              <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <a
                    href="#"
                    class="block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white"
                    aria-current="page"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                    onMouseEnter={()=>{setShowCategoriesMenu(true)}}
                    // onMouseEnter={toggleCategoriesMenu}
                    // onClick={toggleCategoriesMenu}
                  >
                    Categories
                    {showCategoriesMenu && (
                  <div onMouseLeave={toggleCategoriesMenu} className="absolute bg-white border border-gray-200 mt-2 py-2 px-4 shadow-lg rounded-lg">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        // to={`/category/${category.id}`} // Modify the link as needed
                        className="block text-gray-800 hover:text-blue-700 transition duration-300 py-1"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
