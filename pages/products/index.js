import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Button from "@mui/material/Button";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import axios from "axios";
import Header from "../components/Header";
import ProgressBar from "@ramonak/react-progress-bar";
const web3 = new Web3(Web3.givenProvider);
function Home() {
  const { isAuthenticated, user, logout } = useMoralis();
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const getProducts = async () => {
    let pro = [];
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const response = await contract.methods
      .getUserProducts()
      .call({ from: user.get("ethAddress") });
    for (var i = 0; i < response.length; i++) {
      let res = await axios.get(response[i]);
      pro.push(res.data);
    }
    setProducts(pro);
  };
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
    getProducts();
  }, [isAuthenticated]);
  const convert = (pro) => {
    let time = Date.now() - pro.boughtTime;
    let left = Math.round(((pro.warranty - time) / 31556952000) * 100) / 100;
    if (time > pro.warranty) return "Expired";
    else return left + " Years Left";
  };
  const convertW = (pro) => {
    return Math.round((pro.warranty / 31556952000) * 100) / 100 + " Years";
  };
  const getNow = (pro) => {
    let time = Date.now() - pro.boughtTime;
    return time;
  };
  const renderProducts = () => {
    if (products) {
      return products.map((ar) => (
        // <div className="text-center rounded-2xl">
        //   <div className="bg-sky-400 ">
        //     <img
        //       className=" px-5 py-5 w-96 object-contain h-96"
        //       src={ar.image}
        //     ></img>
        //   </div>
        //   <h1 className="text-2xl">{ar.name}</h1>
        //   <h1 className="text-2xl">{ar.price} eth</h1>
        //   <h1 className="text-2xl">Warranty</h1>
        //   <br></br>
        //   <ProgressBar
        //     completed={getNow(ar)}
        //     maxCompleted={ar.warranty}
        //     customLabel=" "
        //   />
        //   <br></br>
        //   <h1 className="text-2xl">Expiry in:{convert(ar)}</h1>
        //   <h1 className="text-2xl">Original Warranty:{convertW(ar)}</h1>
        //   <h1 className="text-2xl">Serial No:{ar.serialno}</h1>
        // </div>

        <a class="flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row w-full my-12 lg:w-full hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 mx-auto z-10">
          {/* <iframe
            title="Gaming Laptop"
            frameborder="0"
            allowfullscreen
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            xr-spatial-tracking
            execution-while-out-of-viewport
            execution-while-not-rendered
            web-share
            src={ar.url1}
            className="w-96 h-96 z-0"
          >
            {" "}
          </iframe> */}{" "}
          <img
            className=" px-5 py-5 w-80 object-contain h-96"
            src={ar.image}
          ></img>
          <div class="flex flex-col items-center p-4 leading-normal text-center content-center lg:mx-auto">
            <h5 class="mb-10  text-3xl font-bold tracking-tight text-center text-gray-900 dark:text-white mx-auto">
              {ar.name}
            </h5>
            <h1 class="mb-10  font-normal text-xl text-gray-700 dark:text-gray-400">
              <span className="font-bold"> Price:</span> {ar.price} Eth{" "}
            </h1>
            {/* <ProgressBar
              completed={getNow(ar)}
              maxCompleted={ar.warranty}
              customLabel=" "
              width="full"
            /> */}
            <h1 class="mb-10 font-normal text-xl text-gray-700 dark:text-gray-400">
              <span className="font-bold">Expiry in: </span>
              {convert(ar)}{" "}
            </h1>{" "}
            <h1 class="mb-10 font-normal text-xl text-gray-700 dark:text-gray-400">
              <span className="font-bold">Original Warranty: </span>
              {convertW(ar)}{" "}
            </h1>{" "}
            <h1 class="mb-10 font-normal text-xl text-gray-700 dark:text-gray-400">
              <span className="font-bold">Serial No: </span>
              {ar.serialno}{" "}
            </h1>{" "}
          </div>
        </a>
      ));
    }
  };
  return (
    <>
      <div className="grid grid-cols-2 justify-center gap-20 justify-items-center ">
        <Header />
        <div className="text-center">
          <h1 className=" mx-auto flex -ml-32  mt-32 text-4xl justify-center text-center font-semibold font-sans">
            Your Orders
          </h1>
        </div>

        <div class="grid grid-rows-3 grid-cols-2 gap-0 absolute w-3/4  lg:top-20 top-10  rights-1/3 left-2/3 lg:right-80 lg:left-80 z-50  mt-16  text-center ">
          <div className="grid grid-cols-1 left-1/3 mx-auto  relative">
            {renderProducts()}
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
