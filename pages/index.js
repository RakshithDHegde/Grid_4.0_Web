import Head from "next/head";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import Moralis from "moralis";
import Web3 from "web3";
import { contractABI, contractAddress } from "../contract";
import { useNewMoralisObject } from "react-moralis";
import Header from "./components/Header";
const Home = () => {
  const [boolpr, setBoolpr] = useState(false);
  const web3 = new Web3(Web3.givenProvider);
  const { authenticate, user, isAuthenticated } = useMoralis();
  const router = useRouter();
  const checkUsers = async () => {
    if (window.location.href === "https://flipkartgrid.vercel.app/products") {
      setBoolpr(true);
    }

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const response = await contract.methods
      .checkUser()
      .call({ from: user.get("ethAddress") });
    let res = await contract.methods
      .checkContractOwner()
      .call({ from: user.get("ethAddress") });
    let userExists = response;
    if (userExists && !boolpr)
      !res ? router.push("/home") : router.push("/view");
    else if (userExists && boolpr) router.push("/products");
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
      <Header></Header>

      {/* <header /> */}
      <div className="flex min-h-screen flex-col  rounded-lg items-center justify-center py-2">
        <Head>
          <title>Flipkart Grid</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div class="grid grid-rows-3 grid-cols-2 gap-0 absolute lg:top-20 top-10 lg:right-80 lg:left-80 z-50  mt-16  text-center rounded-xl  ">
          <div class="row-span-3 col-span-2 ... rounded-lg flex flex-wrap justify-center drop-shadow-lg mx-auto bg-slate-200 ">
            <div className="block justify-center text-left drop-shadow-md mx-auto">
              <img
                src="https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/6299958714b6b_150150_-_challenge_logo.png?d=110x110"
                className="mx-auto my-4"
              ></img>
              <h1 className="mx-6 mt-3 text-3xl justify-center  font-semibold font-sans">
                Connect Your Wallet
              </h1>
              <div className="flex justify-center">
                <button
                  onClick={onSubmit}
                  className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm mt-5  px-5 py-2.5 text-center items-center dark:focus:ring-[#4285F4]/55 mb-2 flex "
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
