import Head from "next/head";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import Header from "../components/Header";
const Home = () => {
  const web3 = new Web3(Web3.givenProvider);
  const { isAuthenticated, user } = useMoralis();
  const router = useRouter();
  const [winners,setWinners]=useState([]);
  const checkAddr=async()=>{
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    let addr = await contract.methods
      .checkContractOwner()
      .call({ from: user.get("ethAddress") });
     if(!addr)router.push("/")
  }
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
   checkAddr();
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    let res=await contract.methods
    .holdLottery()
    .send({from: user.get("ethAddress")})
    console.log(res)
  };
  return (
    <>
    
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Header/>
        <div class="grid grid-rows-3 grid-cols-2 gap-0 absolute lg:top-20 top-10  rights-1/3  lg:right-80 lg:left-80 z-50  mt-16  text-center ">
          <div class="row-span-3 col-span-2 ... bg-white flex flex-wrap justify-center drop-shadow-lg mx-auto ">
            <div className="block justify-center text-left drop-shadow-md mx-auto">
              <h1 className="mx-6 mt-3 text-3xl justify-center  font-semibold font-sans">
               Hold Lottery
              </h1>

              <div className="flex">
                <button
                  onClick={onSubmit}
                  className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 flex mx-7 mt-5"
                >
                  Submit
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
