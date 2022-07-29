import { useRouter } from "next/router";
import React from "react";
import { useEffect,useState } from "react";
import { useMoralis } from "react-moralis";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Moralis from "moralis";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import { useNewMoralisObject } from "react-moralis";
import axios from "axios"
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
    console.log("Here")
  }, [isAuthenticated]);
 
  return (
    <>
      <Button variant="contained" onClick={logout}>
        Logout
      </Button>
      <div className="grid grid-cols-2 justify-center gap-20 justify-items-center ">
        {}
      </div>
    </>
  );
}
export default Home;
