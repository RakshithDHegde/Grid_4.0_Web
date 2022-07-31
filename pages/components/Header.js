import React from "react";
import Head from "next/head";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import Web3 from "web3";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import { contractABI, contractAddress } from "../../contract";
const Header = () => {
  const web3 = new Web3(Web3.givenProvider);
  const { isAuthenticated, user, logout } = useMoralis();
  const router = useRouter();
  const [isowner, setIsOwner] = useState(false);
  const checkIsOwner = async () => {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    let res = await contract.methods
      .checkContractOwner()
      .call({ from: user.get("ethAddress") });
    setIsOwner(res);
  };
  useEffect(() => {
    if (isAuthenticated) checkIsOwner();
  });
  const changeRouter = (s) => (event) => {
    event.preventDefault();
    router.push("/" + s);
  };
  const renderNotOwner = () => {
    return (
      <ul class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
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
    );
  };
  const renderOwner = () => {
    return (
      <ul class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 justify-center  dark:border-gray-700">
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
    );
  };
  const renderMenu = () => {
    return (
      <div
        class="justify-center items-center w-full md:flex md:w-auto md:order-1"
        id="navbar-sticky"
      >
        {isowner ? renderOwner() : renderNotOwner()}
        <button
          onClick={logout}
          className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 flex mx-7 mt-1"
        >
          Logout
        </button>
      </div>
    );
  };
  return (
    <nav class="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div class="container flex flex-wrap justify-between items-center mx-auto">
        <a href="/" class="flex justify-between items-center">
          <img
            src="https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/6299958714b6b_150150_-_challenge_logo.png?d=110x110"
            class="mr-3 z-50 lg:h-12 h-9"
            alt="Flowbite Logo"
          />
          <span class="self-center text-2xl font-sans font-semibold whitespace-nowrap dark:text-white">
            Grid 4.0
          </span>
        </a>
        <div class="flex md:order-2">
          {isAuthenticated && (
            <button
              onClick={logout}
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Logout
            </button>
          )}
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className=" hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          {/* {isAuthenticated ? renderMenu() : <div className="justify-center " />} */}
          {isAuthenticated && !isowner && !isMobile && (
            <ul class=" flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <button
                  href="#"
                  onClickCapture={changeRouter("home")}
                  class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                  aria-current="page"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  href="#"
                  onClickCapture={changeRouter("products")}
                  class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                >
                  Your Orders
                </button>
              </li>
              <li>
                <button
                  href="#"
                  onClickCapture={changeRouter("see")}
                  class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                >
                  Winnner
                </button>
              </li>
              <li>
                <button
                  href="#"
                  onClickCapture={changeRouter("transfer")}
                  class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                >
                  Tranfer
                </button>
              </li>
            </ul>
          )}
          {isAuthenticated && isowner && (
            <ul class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <button
                  href="#"
                  onClickCapture={changeRouter("hold")}
                  class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                >
                  Hold Lottery
                </button>
              </li>
              <li>
                <button
                  href="#"
                  onClickCapture={changeRouter("view")}
                  class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                >
                  Verify Warranty
                </button>
              </li>
              <li className="">
                <button
                  href="#"
                  onClickCapture={changeRouter("withdraw")}
                  class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                >
                  Withdraw Money
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Header;
