import Head from "next/head";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import Header from "../components/Header";

import { GiPodiumWinner } from "react-icons/gi";
const Home = () => {
  const web3 = new Web3(Web3.givenProvider);
  const { isAuthenticated, user } = useMoralis();
  const router = useRouter();
  const [winners, setWinners] = useState([]);
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  });
  useEffect(() => {
    const onSubmit1 = async (event) => {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      let res = await contract.methods
        .getRewardWinners()
        .call({ from: user.get("ethAddress") });
      setWinners(res);
    };
    onSubmit1();
  }, []);
  // const onSubmit = async (event) => {
  //   event.preventDefault();
  //   const contract = new web3.eth.Contract(contractABI, contractAddress);
  //   let res = await contract.methods
  //     .getRewardWinners()
  //     .call({ from: user.get("ethAddress") });
  //   setWinners(res);
  // };
  const renderWinner = () => {
    if (winners) {
      return winners.map((addr, i) => (
        <div>
          <p>
            {i + 1}:{addr}
          </p>
        </div>
      ));
    }
  };
  return (
    <>
      <Header />

      <h1 className="mx-6 flex mt-32  text-4xl justify-center text-center font-semibold font-sans">
        Winners <GiPodiumWinner className="ml-3" />
      </h1>
      <div class="overflow-x-auto relative mt-24">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-center text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="py-3 px-6">
                Serial NO
              </th>
              <th scope="col" class="py-3 px-6">
                Public Address
              </th>
            </tr>
          </thead>
          <tbody>
            {winners.map((addr, i) => (
              <tr class="bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {i + 1}
                </th>
                <td class="py-4 px-6">{addr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <div class="grid grid-rows-3 grid-cols-2 gap-0 absolute lg:top-20 top-10  rights-1/3  lg:right-80 lg:left-80 z-50  mt-16  text-center ">
          <div class="row-span-3 col-span-2 ... bg-white flex flex-wrap justify-center drop-shadow-lg mx-auto ">
            <div className="block justify-center text-left drop-shadow-md mx-auto">
              <h1 className="mx-6 mt-3 text-3xl justify-center  font-semibold font-sans">
                See Winners
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
          {renderWinner()}
        </div>
      </div> */}
    </>
  );
};

export default Home;
