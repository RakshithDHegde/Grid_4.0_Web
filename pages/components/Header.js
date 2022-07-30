import React from "react";
import Head from "next/head";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
const Header = () => {
  const web3 = new Web3(Web3.givenProvider);
  const { isAuthenticated, user,logout } = useMoralis();
  const router = useRouter();
  const [isowner,setIsOwner]=useState(false);
  const checkIsOwner=async()=>{
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    let res = await contract.methods
      .checkContractOwner()
      .call({ from: user.get("ethAddress") });
     setIsOwner(res)
  }
  useEffect(() => {
   if(isAuthenticated)checkIsOwner();
  });
  const changeRouter=(s)=>(event)=>{
    event.preventDefault();
    router.push("/"+s)
  }
  const renderNotOwner=()=>{
   return<ul class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
   <li>
      <button
          href="#"
          onClickCapture={changeRouter("home")}
          class="block py-2 pr-4 pl-3 text-white text-gray-700 rounded hover:bg-gray-100 md:bg-transparent md:text-gray-700 md:hover:text-blue-700 md:p-0 dark:text-white"
          aria-current="page"
        >
          Home
        </button>
      </li>
      <li>
        <button
          href="#"
          onClickCapture={changeRouter("products")}
          class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
        >
          See your purchase
        </button>
      </li>
      <li>
      <button
          href="#"
          onClickCapture={changeRouter("see")}
          class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
        >
          See the Winners
        </button>
      </li>
      <li>
      <button
          href="#"
          onClickCapture={changeRouter("transfer")}
          class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
        >
          Tranfer Your Product
        </button>
      </li>
     </ul>
  }
  const renderOwner=()=>{
    return<ul class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
    <li>
    <button
      href="#"
      onClickCapture={changeRouter("hold")}
      class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
    >
     Hold Lottery
    </button>
  </li>
  <li>
    <button
      href="#"
      onClickCapture={changeRouter("view")}
      class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
    >
      Verify Warranty
    </button>
  </li>
  <li>
    <button
       href="#"
       onClickCapture={changeRouter("withdraw")}
      class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
    >
      Withdraw Money
    </button>
  </li>
</ul>
  }
  const renderMenu=()=>{
   return  <div
    class="justify-between items-center w-full md:flex md:w-auto md:order-1"
    id="navbar-sticky"
  >
    {(isowner)?renderOwner():renderNotOwner()}
    <button
                  onClick={logout}
                  className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 flex mx-7 mt-5"
                >
                  Logout
                </button>
  </div>
  }
  return (
      <nav class="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div class="container flex flex-wrap justify-center items-center mx-auto">
          <a href="/" class="flex items-center">
            <img
              src="https://www.freepnglogos.com/uploads/flipkart-logo-png/flipkart-logo-transparent-png-download-0.png"
              class="mr-3 h-full sm:h-9"
              alt="Flowbite Logo"
            />
            <span class="self-center text-2xl font-sans font-semibold whitespace-nowrap dark:text-white">
              Flipkart Grid
            </span>
          </a>
        {(isAuthenticated)?renderMenu():<div/>}
        </div>
      </nav>
  );
};
export default Header;
