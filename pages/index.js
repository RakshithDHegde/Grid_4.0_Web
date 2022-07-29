import Head from "next/head";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { useEffect, useRef } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import Moralis from "moralis";
import Web3 from "web3";
import { contractABI, contractAddress } from "../contract";
import { useNewMoralisObject } from "react-moralis";
import Header from "./components/Header";
const Home = () => {
  const web3 = new Web3(Web3.givenProvider);
  const { authenticate, user, isAuthenticated } = useMoralis();
  const router = useRouter();
  const checkUsers = async () => {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const response = await contract.methods
      .checkUser()
      .call({ from: user.get("ethAddress") });
    let userExists = response;
    if (userExists) router.push("/home");
    else router.push("/signup");
  };
  useEffect(() => {
    if (isAuthenticated) {
      checkUsers();
    }
  }, [isAuthenticated]);
  const onSubmit = async (event) => {
    await authenticate();
  };
  const phoneNumberInputElement = useRef();
  return (
    <>
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
        </div>
      </nav>

      {/* <header /> */}
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Head>
          <title>Flipkart Grid</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div class="grid grid-rows-3 grid-cols-2 gap-0 absolute lg:top-20 top-10  rights-1/3  lg:right-80 lg:left-80 z-50  mt-16  text-center ">
          <div class="row-span-3 col-span-2 ... bg-white flex flex-wrap justify-center drop-shadow-lg mx-auto ">
            <div className="block justify-center text-left drop-shadow-md mx-auto">
              <h1 className="mx-6 mt-3 text-3xl justify-center  font-semibold font-sans">
                Sign up
              </h1>
              <div className="flex">
                <button
                  onClick={onSubmit}
                  className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 flex mx-7 mt-5"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
