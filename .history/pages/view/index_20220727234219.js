import { useRouter } from "next/router";
import React from "react";
import { useEffect,useState } from "react";
import { useMoralis } from "react-moralis";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Moralis from "moralis";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import { useNewMoralisObject } from "react-moralis";
import axios from "axios"
import { stringify } from "querystring";
function  Home() {
  const web3 = new Web3(Web3.givenProvider);
  const { isAuthenticated,user, logout } = useMoralis();
  const { save } = useNewMoralisObject("Monster");
  const router = useRouter();
  const [SNo,setSNo]=useState("");
  const [pro,setPro]=useState({});
  const [buyer,setBuyer]=useState({});
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  const onSubmit=async ()=>{
    var response = await contract.methods
        .getWarranty(SNo)
        .call({ from: user.get("ethAddress") });
        if(response==="Invalid")alert("")
      var res=await axios.get(response)
    setPro(res.data);
    response=await contract.methods
        .getOwner(SNo)
        .call({ from: user.get("ethAddress") });
        setBuyer(response);
  }
  return (
    <>
      <Button variant="contained" onClick={logout}>
        Logout
      </Button>
      <div className="grid grid-cols-2 justify-center gap-20 justify-items-center ">
      <TextField
              required
              sx={{ mt: 5, ml: 3, width: 3 / 4 }}
              id="outlined-basic"
              label="SerialNo"
              variant="outlined"
              value={SNo}
              onChange={(event) => setSNo(event.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => onSubmit()}
              endIcon={<ShoppingCartIcon />}
            >
             Check Warranty
            </Button>
          {/* {console.log(buyer)}
          {console.log(pro)} */}
          {/* <div className="text-center rounded-2xl">
            <div className="bg-sky-400 ">
              <img
                className=" px-5 py-5 w-96 object-contain h-96"
                src={ar.url}
              ></img>
            </div>
            <h1 className="text-2xl">{ar.name}</h1>
            <h1 className="text-2xl">₹ {ar.price}</h1>
            <h1 className="text-2xl">Expiry in:{ar.expiry}</h1>
            <h1 className="text-2xl">Serial No:{ar.serialno}</h1>
          </div> */}
      </div>
    </>
  );
}
export default Home;
