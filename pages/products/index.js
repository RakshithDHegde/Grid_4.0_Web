import { useRouter } from "next/router";
import React from "react";
import { useEffect,useState } from "react";
import { useMoralis } from "react-moralis";
import Button from "@mui/material/Button";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import axios from "axios"
import Header from "../components/Header";
import ProgressBar from '@ramonak/react-progress-bar';
const web3 = new Web3(Web3.givenProvider);
function Home() {
  const { isAuthenticated, user, logout } = useMoralis();
  const [products,setProducts]=useState([])
  const router = useRouter();
  const getProducts=async()=>{
    let pro=[];
    const contract = new web3.eth.Contract(contractABI, contractAddress);
      const response = await contract.methods
        .getUserProducts()
        .call({ from: user.get("ethAddress") });
        for(var i=0;i<response.length;i++){
           let res=await axios.get(response[i]);
           pro.push(res.data);
        };
        setProducts(pro)
  }
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
    getProducts()
  }, [isAuthenticated]);
  const convert=(pro)=>{
    let time=Date.now()-pro.boughtTime
    let left=Math.round((pro.warranty-time)/31556952000*100)/100
    if(time>pro.warranty)return "Expired"
    else return left +" Years Left"
  }
  const convertW=(pro)=>{
   return Math.round(pro.warranty/31556952000*100)/100 +" Years"
  }
  const getNow=(pro)=>{
    let time=Date.now()-pro.boughtTime;
    return time;
  }
 const renderProducts=()=>{
    if(products){
        return products.map((ar) => (
 <div className="text-center rounded-2xl">
    <div className="bg-sky-400 ">
      <img
        className=" px-5 py-5 w-96 object-contain h-96"
        src={ar.image}
      ></img>
    </div>
    <h1 className="text-2xl">{ar.name}</h1>
    <h1 className="text-2xl">{ar.price} eth</h1>
    <h1 className="text-2xl">Warranty</h1>
    <br></br>
     <ProgressBar completed={getNow(ar)} maxCompleted={ar.warranty} customLabel=" "/>
     <br></br>
    <h1 className="text-2xl">Expiry in:{convert(ar)}</h1>
    <h1 className="text-2xl">Original Warranty:{convertW(ar)}</h1>
    <h1 className="text-2xl">Serial No:{ar.serialno}</h1>
  </div>
))}
        }
  return (
    <>
      <div className="grid grid-cols-2 justify-center gap-20 justify-items-center ">
      <Header/>
      <div class="grid grid-rows-3 grid-cols-2 gap-0 absolute lg:top-20 top-10  rights-1/3  lg:right-80 lg:left-80 z-50  mt-16  text-center ">
        {renderProducts()}
        </div>
      </div>
    </>
  );
}
export default Home;
