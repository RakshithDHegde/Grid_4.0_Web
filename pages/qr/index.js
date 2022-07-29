import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import Web3 from "web3";
import {QRCodeSVG} from 'qrcode.react';
import Header from "../components/Header";
import Button from "@mui/material/Button";
const web3 = new Web3(Web3.givenProvider);
function Home() {

  const { isAuthenticated, user } = useMoralis();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);
  const generateQR=()=>{
   const productNo=localStorage.getItem("productNo")
  return <QRCodeSVG value={productNo} />
  }
  return (
    <>
   
      <div className="grid grid-cols-2 justify-center gap-20 justify-items-center ">
      <Header/>
      <div class="grid grid-rows-3 grid-cols-2 gap-0 absolute lg:top-20 top-10  rights-1/3  lg:right-80 lg:left-80 z-50  mt-16  text-center ">
            {generateQR()}
         <Button
              variant="contained"
              onClickCapture={() => router.push("/home")}
            >
              Go Back
            </Button>
            </div>
         </div>
    </>
  );
}
export default Home;
