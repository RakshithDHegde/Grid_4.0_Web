import Head from "next/head";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import Header from "../components/Header";
const Home = () => {
  const web3 = new Web3(Web3.givenProvider);
  const { isAuthenticated, user } = useMoralis();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone,setPhone]=useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email || !name) return;
    try{
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    let response = await contract.methods
      .storeUser(email, name,phone)
      .send({ from: user.get("ethAddress") });
    console.log(response);
    router.push("/home");
    }
    catch (err){
      alert("Error Occured")
    }
  };
  return (
    <>
      <nav class="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div class="container flex flex-wrap justify-center items-center mx-auto">
          <a href="/" class="flex items-center">
            <img
              src="https://e7.pngegg.com/pngimages/946/191/png-clipart-flipkart-e-commerce-logo-bangalore-chief-executive-others-miscellaneous-blue.png"
              class="mr-3 h-full sm:h-9"
              alt="Flipkart Logo"
            />
            <span class="self-center text-2xl font-sans font-semibold whitespace-nowrap dark:text-white">
              Flipkart Grid
            </span>
          </a>
        </div>
      </nav>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Head>
          <title>Flipkart Grid</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div class="grid grid-rows-3 grid-cols-2 gap-0 absolute lg:top-20 top-10  rights-1/3  lg:right-80 lg:left-80 z-50  mt-16  text-center ">
          <div class="row-span-3 col-span-2 ... bg-white flex flex-wrap justify-center drop-shadow-lg mx-auto ">
            <div className="block justify-center text-left drop-shadow-md mx-auto">
              <h1 className="mx-6 mt-3 text-3xl justify-center  font-semibold font-sans">
                Enter your Details
              </h1>

              <TextField
                required
                sx={{ mt: 5, ml: 3, width: 3 / 4 }}
                id="outlined-basic"
                label="Name"
                variant="outlined"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <TextField
                required
                sx={{ mt: 5, ml: 3, width: 3 / 4 }}
                id="outlined-basic"
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <TextField
                required
                sx={{ mt: 5, ml: 3, width: 3 / 4 }}
                id="outlined-basic"
                label="Phone No"
                variant="outlined"
                type="number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
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
        </div>
      </div>
    </>
  );
};

export default Home;
