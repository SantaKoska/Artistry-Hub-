import { Link } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { AiOutlineUnlock } from "react-icons/ai";
import Logo from "./assets/LOGO.png";

const Register = () => {
  return (
    <div className="bg-slate-800 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-md bg-opacity-30 relative">
      <div>
        <h1 className="text-4xl font-semibold text-whitefont-bold text-center mb-6">
          Register
        </h1>
        <form action="">
          <div className="relative my-4 mb-8">
            <input
              type="email"
              className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none dark:focus:border-yellow-500 focus:outline-none focus:ring-0 focus:text-black focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor=""
              className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0]  peer-focus:text-yellow-400 peer-focus:dark:text-yellow-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              User Name
            </label>
            <BiUser className="absolute top-0 right-4 peer-focus:dark:text-yellow-500" />
          </div>
          <div className="relative my-4 mb-8">
            <input
              type="email"
              className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none dark:focus:border-yellow-500 focus:outline-none focus:ring-0 focus:text-black focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor=""
              className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0]  peer-focus:text-yellow-400 peer-focus:dark:text-yellow-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Email
            </label>
            <BiUser className="absolute top-0 right-4 peer-focus:dark:text-yellow-500" />
          </div>
          <div className="relative my-4 mt-8">
            <input
              type="password"
              className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none dark:focus:border-yellow-500 focus:outline-none focus:ring-0 focus:text-black focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor=""
              className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0]  peer-focus:text-yellow-400 peer-focus:dark:text-yellow-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Password
            </label>
            <AiOutlineUnlock className="absolute top-0 right-4 peer-focus:dark:text-yellow-500" />
          </div>
          <div className="relative my-4 mt-8">
            <input
              type="password"
              className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none dark:focus:border-yellow-500 focus:outline-none focus:ring-0 focus:text-black focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor=""
              className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0]  peer-focus:text-yellow-400 peer-focus:dark:text-yellow-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Confirm Your Password
            </label>
            <AiOutlineUnlock className="absolute top-0 right-4 peer-focus:dark:text-yellow-500" />
          </div>
          <button
            className="w-full mb-4 text-[18px] font-semibold mt-6 rounded-full bg-white text-black hover:bg-emerald-900 hover:text-white py-2 transition-colors duration-400"
            type="submit"
          >
            Register
          </button>
          <div>
            <span>
              Already have an account?{" "}
              <Link className="text-yellow-400" to="/login">
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
