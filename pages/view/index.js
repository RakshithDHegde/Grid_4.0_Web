import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import { useNewMoralisObject } from "react-moralis";
import axios from "axios";
import Header from "../components/Header";
import ProgressBar from "@ramonak/react-progress-bar";

const web3 = new Web3(Web3.givenProvider);
const Home = () => {
  const web3 = new Web3(Web3.givenProvider);
  const { isAuthenticated, user, logout } = useMoralis();
  const { save } = useNewMoralisObject("Monster");
  const router = useRouter();
  const [SNo, setSNo] = useState("");
  const [pro, setPro] = useState({});
  const [buyer, setBuyer] = useState([]);
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  const onSubmit = async () => {
    var response = await contract.methods
      .getWarranty(SNo)
      .call({ from: user.get("ethAddress") });
    if (response === "Invalid") alert("Invalid serial No");
    var res = await axios.get(response);
    setPro(res.data);
    response = await contract.methods
      .getOwner(SNo)
      .call({ from: user.get("ethAddress") });
    setBuyer(response);
  };
  const convert = () => {
    let time = Date.now() - pro.boughtTime;
    let left = Math.round(((pro.warranty - time) / 31556952000) * 100) / 100;
    if (time > pro.warranty) return "Expired";
    else return left + " Years Left";
  };
  const convertW = () => {
    return Math.round((pro.warranty / 31556952000) * 100) / 100 + " Years";
  };
  const getNow = () => {
    let time = Date.now() - pro.boughtTime;
    return time;
  };
  return (
    <>
      <div className="grid grid-cols-2 justify-center gap-20 justify-items-center ">
        <Header />
        <div class="grid grid-rows-3  grid-cols-2 gap-0 absolute lg:top-20 top-10  rights-1/3  lg:right-80 lg:left-80 z-10  mt-24  text-center ">
          <div class="row-span-3 mt-20 col-span-2 ...  bg-white flex flex-wrap justify-center drop-shadow-lg mx-auto ">
            <div className="block justify-center text-center items-center drop-shadow-md mx-auto">
              <TextField
                required
                sx={{ mt: 5, width: 3 / 4 }}
                id="outlined-basic"
                label="SerialNo"
                variant="outlined"
                value={SNo}
                onChange={(event) => setSNo(event.target.value)}
                className="mb-3"
              />
              <Button
                variant="outlined"
                onClick={() => onSubmit()}
                endIcon={<ShoppingCartIcon />}
                className="mx-auto mb-4 mt-10"
              >
                Check Warranty
              </Button>
              {console.log(buyer)}
              {console.log(pro)}
              {buyer.length !== 0 ? (
                <div className="text-center rounded-2xl">
                  <div className="bg-sky-400 ">
                    <img
                      className=" px-5 py-5 w-96 object-contain h-96"
                      src={pro.image}
                    ></img>
                  </div>
                  <h1 className="text-2xl">{pro.name}</h1>
                  <h1 className="text-2xl">{pro.price} eth</h1>
                  <h1 className="text-2xl">Warranty</h1>
                  <br></br>
                  <ProgressBar
                    completed={getNow()}
                    maxCompleted={pro.warranty}
                    customLabel=" "
                  />
                  <br></br>
                  <h1 className="text-2xl">Expiry in:{convert()}</h1>
                  <h1 className="text-2xl">Original Warranty:{convertW()}</h1>
                  <h1 className="text-2xl">Serial No:{pro.serialno}</h1>
                  <h1 className="text-2xl">Buyer: {buyer[0]} </h1>
                  <h1 className="text-2xl">Email: {buyer[1]} </h1>
                  <h1 className="text-2xl">Public Address: {buyer[2]} </h1>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
