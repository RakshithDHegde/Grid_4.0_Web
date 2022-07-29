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
const web3 = new Web3(Web3.givenProvider);
function Home() {
  const { isAuthenticated, user, logout } = useMoralis();
  const { save } = useNewMoralisObject("Monster");
  const [products,setProducts]=useState([])
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }

  }, [isAuthenticated]);
  const onSubmit = async () => {

    try {
      
      // const tokenId = response.events.Transfer.returnValues.tokenId;
      //alert(`Nft minted successfully ${tokenId} and ${contractAddress}`);
      // const Order = Moralis.Object.extend(Moralis.User.current().id);
      // const order = new Order();

      // order
      //   .save({
      //     name: a,
      //     serialNo: serialno,
      //     AmountPaid: b,
      //   })
      //   .then(
      //     (order) => {
            // alert("CREATED");
            // // The object was saved successfully.
      //     },
      //     (error) => {
      //       // The save failed.
      //       // error is a Moralis.Error with an error code and message.
      //     }
      // );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Button variant="contained" onClick={logout}>
        Logout
      </Button>
      <div className="grid grid-cols-2 justify-center gap-20 justify-items-center ">
        {()=>{if(products)products.map((ar) => (
          <div className="text-center rounded-2xl">
            <div className="bg-sky-400 ">
              <img
                className=" px-5 py-5 w-96 object-contain h-96"
                src={ar.url}
              ></img>
            </div>
            <h1 className="text-2xl">{ar.name}</h1>
            <h1 className="text-2xl">₹ {ar.price}</h1>
            <h1 className="text-2xl">Expiry in:{ar.expiry}</h1>
            <Button
              variant="contained"
              onClick={() => onSubmit(ar.name, ar.price, ar.url, ar.expiry)}
              endIcon={<ShoppingCartIcon />}
            >
              Buy Now
            </Button>
          </div>
        ))}
}
      </div>
    </>
  );
}
export default Home;
