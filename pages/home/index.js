import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Moralis from "moralis";
import Web3 from "web3";

import { contractABI, contractAddress } from "../../contract";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { QRCodeSVG } from "qrcode.react";
// import {
//   MDBCard,
//   MDBCardBody,
//   MDBCardTitle,
//   MDBCardText,
//   MDBCardImage,
// } from "mdb-react-ui-kit";

import Header from "../components/Header";
const web3 = new Web3(Web3.givenProvider);
function Home() {
  const [qr, setQr] = useState(false);
  const [productno, setProductno] = useState("");
  const [success, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const [button, setButton] = useState(true);

  const converttoYear = (expiry) => {
    return expiry / 31556952000;
  };

  const qrGen = () => {
    return <QRCodeSVG value={productno} />;
  };
  const arr = [
    {
      name: "Laptop",
      url1: "https://sketchfab.com/models/f34c1400926e430a9ef10bb180986b42/embed",
      price: 0.43,
      url: "https://m.media-amazon.com/images/I/81KoSSAwH2L._SL1500_.jpg",
      expiry: 300000,
      productNo: "prod1",
      wei: "430000000000000000",
    },
    {
      name: "Phone",
      url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZXxlbnwwfHwwfHw%3D&w=1000&q=80",
      url1: "https://sketchfab.com/models/39a5c7eec46e4ac3b4d4f96eb4206157/embed",
      price: 0.12,
      expiry: 63113904000,
      productNo: "prod2",
      wei: "120000000000000000",
    },
    {
      name: "Fridge",
      url: "https://rukminim1.flixcart.com/image/416/416/kfbfr0w0/refrigerator-new/v/u/y/563gsmqs-na-marq-by-flipkart-original-imafvtfahqa9hzgg.jpeg?q=70",
      url1: "https://sketchfab.com/models/a631f83ec0ad4815b966e7f8271b6011/embed",
      price: 0.05,
      expiry: 63113904000,
      productNo: "prod3",
      wei: "180000000000000000",
    },
    {
      name: "Mixer",
      url: "https://5.imimg.com/data5/YW/VZ/FT/SELLER-85407527/mixer-png-500x500.png",
      url1: "https://sketchfab.com/models/562acb4e5abb4f5f87ff676d1908464b/embed",
      price: 0.12,
      expiry: 31556952000,
      productNo: "prod4",
      wei: "50000000000000000",
    },
    {
      name: "TV",
      url: "https://media.croma.com/image/upload/v1652358374/Croma%20Assets/Entertainment/Television/Images/251388_1_bnz4vl.png",
      url1: "https://sketchfab.com/models/8e00b6e657284a819c3264cc7c8efe1d/embed",
      price: 0.036,
      expiry: 31556952000,
      productNo: "prod5",
      wei: "120000000000000000",
    },
    {
      name: "Watch",
      url: "https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/wearables/watch-3/img/id/huawei-watch-3-strap-3-1.png",
      url1: "https://sketchfab.com/models/53969e713bfb42f3abd94b2af8b43d5b/embed",
      price: 0.036,
      expiry: 31556952000,
      productNo: "prod6",
      wei: "36000000000000000",
    },
  ];

  const { isAuthenticated, user, logout } = useMoralis();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  const removeModal = () => {
    setQr(false);
  };
  const onSubmit = async (a, b, c, d, e, f) => {
    setButton(false);
    let n = Date.now() - 1534567891012;

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    let response = await contract.methods
      .getUser()
      .call({ from: user.get("ethAddress") });

    const phone = "+91" + response.phone;
    // console.log(a, b, c);
    let name = `${a}`;
    let warranty = `${d}`;
    let boughtTime = `${Date.now()}`;
    let serialno = `${a + n}`;

    let message =
      "Hello " +
      response.name +
      " Your order for " +
      name +
      " has been succesfully placed. Your Product Serial Number is: " +
      serialno +
      " Thank you for buying from us ☺️ ";
    let price = b;
    let url = `${c}`;
    let productNo = f;

    try {
      const metadata = {
        name,
        warranty,
        boughtTime,
        image: url,
        serialno,
        price,
        productNo,
      };
      const f2 = new Moralis.File(`${name}metadata.json`, {
        base64: Buffer.from(JSON.stringify(metadata)).toString("base64"),
      });
      await f2.saveIPFS();
      const meturl = f2.ipfs();
      console.log(meturl);

      response = await contract.methods
        .createWarranty(meturl, serialno, productNo)
        .send({ from: user.get("ethAddress"), value: e });

      const res = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phone, message: message }),
      });
      const apiResponse = await res.json();

      if (apiResponse.success) {
        console.log("Suceess");
        setSucess(true);

        setTimeout(() => {
          setSucess(false);
          setButton(true);
        }, 10000);
      } else {
        console.log(apiResponse);
        setError(true);
        setTimeout(() => {
          setError(false);
          setButton(true);
        }, 10000);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="grid grid-cols-1 justify-center gap-20 justify-items-center ">
        <Header />

        {success && (
          <Alert
            variant="filled"
            className="fixed top-9 z-50"
            severity="success"
            color=""
          >
            Congratulations your Order Has been Successfully Placed
          </Alert>
        )}
        {error && (
          <Alert
            variant="filled"
            className="fixed top-9 z-50"
            severity="error"
            color=""
          >
            Order Could not be placed. Please try again!
          </Alert>
        )}
        <div class="grid grid-rows-6 grid-cols-1 gap-0 absolute lg:top-20 top-10 justify-center items-center align-items-center z-10  mt-16  text-center ">
          {qr && (
            <div
              tabindex="-1"
              class=" fixed bottom-1/2 right-0 left-0 z-10 md:inset-0 backdrop-blur-sm  md:h-full"
              onClick={removeModal}
            >
              <div class="fixed p-4  top-1/4 left-1/3 right-2/3 -bottom-1/3  mx-auto  w-full max-w-md h-full md:h-auto">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    onClick={removeModal}
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                    data-modal-toggle="popup-modal"
                  >
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="sr-only">Close modal</span>
                  </button>
                  <div class="p-6 items-center justify-center mx-auto content-center text-center">
                    <ViewInArIcon fontSize="large" className="h-1/2" />
                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Try AR through our App
                    </h3>
                    <div className="mx-auto justify-center items-center relative left-1/3 right-2/3">
                      {qrGen()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* <div class="row-span-3 col-span-2 ... bg-white flex flex-wrap justify-center drop-shadow-lg mx-auto "> */}
          {/* <div className="block justify-center text-left drop-shadow-md mx-auto"> */}
          {arr.map((ar) => (
            // <div className="text-center rounded-2xl justify-center items-center">
            //   <div className="bg-sky-400 justify-center ">
            //     {/* <img
            //     className=" px-5 py-5 w-96 object-contain h-96"
            //     src={ar.url}
            //   ></img> */}
            //     <div class="sketchfab-embed-wrapper justify-center mx-auto items-center object-cover w-full h-96 rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-l-lg">
            //       {" "}
            //       <iframe
            //         title="Gaming Laptop"
            //         frameborder="0"
            //         allowfullscreen
            //         mozallowfullscreen="true"
            //         webkitallowfullscreen="true"
            //         allow="autoplay; fullscreen; xr-spatial-tracking"
            //         xr-spatial-tracking
            //         execution-while-out-of-viewport
            //         execution-while-not-rendered
            //         web-share
            //         src={ar.url1}
            //         className="w-96 h-96"
            //       >
            //         {" "}
            //       </iframe>{" "}
            //     </div>
            //   </div>
            //   <h1 className="text-2xl">{ar.name}</h1>
            //   <h1 className="text-2xl">{ar.price} eth</h1>
            //   {/* <img src="./etherium-eth-logo.png" alt="eth symbol"/> */}
            //   <h1 className="text-2xl">
            //     Warranty :{converttoYear(ar.expiry)} years
            //   </h1>
            //   <Button
            //     variant="contained"
            //     onClickCapture={() =>
            //       onSubmit(
            //         ar.name,
            //         ar.price,
            //         ar.url,
            //         ar.expiry,
            //         ar.wei,
            //         ar.productNo
            //       )
            //     }
            //     endIcon={<ShoppingCartIcon />}
            //   >
            //     Buy Now
            //   </Button>
            //   <Button
            //     variant="contained"
            //     onClickCapture={() => {
            //       localStorage.setItem("productNo", ar.productNo);
            //       router.push("/qr");
            //     }}
            //   >
            //     AR View
            //   </Button>
            // </div>

            <div class="flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row w-full my-12 lg:w-full hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 mx-auto -z-50">
              <iframe
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
                className="w-96 h-96 "
              >
                {" "}
              </iframe>
              <div class="flex flex-col items-center p-4 leading-normal text-center content-center lg:mx-auto">
                <h5 class="mb-3  text-3xl font-bold tracking-tight text-center text-gray-900 dark:text-white mx-auto">
                  {ar.name}
                </h5>
                <h1 class="mb-5  font-normal text-xl text-gray-700 dark:text-gray-400">
                  <span className="font-bold"> Price:</span> {ar.price} Eth{" "}
                </h1>
                <h1 class="mb-10 font-normal text-xl text-gray-700 dark:text-gray-400">
                  <span className="font-bold">Warranty valid for:</span>
                  {converttoYear(ar.expiry)} Year{" "}
                </h1>{" "}
                <div>
                  {button && (
                    <Button
                      variant="outlined"
                      onClickCapture={() =>
                        onSubmit(
                          ar.name,
                          ar.price,
                          ar.url,
                          ar.expiry,
                          ar.wei,
                          ar.productNo
                        )
                      }
                      endIcon={<ShoppingCartIcon />}
                    >
                      Buy Now
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    onClickCapture={() => {
                      // localStorage.setItem("productNo", ar.productNo);
                      // router.push("/qr");

                      setProductno(ar.productNo);
                      setQr(true);
                    }}
                    className="mx-3"
                    endIcon={<ViewInArIcon />}
                  >
                    View in AR{" "}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default Home;
