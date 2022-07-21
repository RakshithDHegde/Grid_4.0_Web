import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Moralis from "moralis";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import { useNewMoralisObject } from "react-moralis";
const web3 = new Web3(Web3.givenProvider);
function Home() {
  const arr = [
    {
      name: "Laptop",
      url: "https://m.media-amazon.com/images/I/81KoSSAwH2L._SL1500_.jpg",
      price: "50000",
    },
    {
      name: "Phone",
      url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZXxlbnwwfHwwfHw%3D&w=1000&q=80",
      price: "15000",
    },
    {
      name: "Fridge",
      url: "https://rukminim1.flixcart.com/image/416/416/kfbfr0w0/refrigerator-new/v/u/y/563gsmqs-na-marq-by-flipkart-original-imafvtfahqa9hzgg.jpeg?q=70",
      price: "25000",
    },
    {
      name: "Mixer",
      url: "https://5.imimg.com/data5/YW/VZ/FT/SELLER-85407527/mixer-png-500x500.png",
      price: "7000",
    },
    {
      name: "TV",
      url: "https://media.croma.com/image/upload/v1652358374/Croma%20Assets/Entertainment/Television/Images/251388_1_bnz4vl.png",
      price: "17000",
    },
    {
      name: "Watch",
      url: "https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/wearables/watch-3/img/id/huawei-watch-3-strap-3-1.png",
      price: "5000",
    },
  ];

  const { isAuthenticated, user, logout } = useMoralis();
  const { save } = useNewMoralisObject("Monster");
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);
  const onSubmit = async (a, b, c) => {
    console.log("HEllo");

    // console.log(a, b, c);
    let name = `${a}`;
    let description = `${parseInt(Math.random() * 10000000000)}`;
    // console.log(description);
    const Order = Moralis.Object.extend(Moralis.User.current().id);
    const order = new Order();

    order
      .save({
        name: a,
        serialNo: description,
        AmountPaid: b,
      })
      .then(
        (monster) => {
          alert("CREATED");
          // The object was saved successfully.
        },
        (error) => {
          // The save failed.
          // error is a Moralis.Error with an error code and message.
        }
      );
    let url = `${c}`;
    try {
      const metadata = { name, description, image: url };
      const f2 = new Moralis.File(`${name}metadata.json`, {
        base64: Buffer.from(JSON.stringify(metadata)).toString("base64"),
      });
      await f2.saveIPFS();
      const meturl = f2.ipfs();

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const response = await contract.methods
        .mint(meturl)
        .send({ from: user.get("ethAddress") });
      const tokenId = response.events.Transfer.returnValues.tokenId;
      alert(`Nft minted successfully ${tokenId} and ${contractAddress}`);
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
        {arr.map((ar) => (
          <div className="text-center rounded-2xl">
            <div className="bg-sky-400 ">
              <img
                className=" px-5 py-5 w-96 object-contain h-96"
                src={ar.url}
              ></img>
            </div>
            <h1 className="text-2xl">{ar.name}</h1>
            <h1 className="text-2xl">₹ {ar.price}</h1>
            <Button
              variant="contained"
              onClick={() => onSubmit(ar.name, ar.price, ar.url)}
              endIcon={<ShoppingCartIcon />}
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
export default Home;
