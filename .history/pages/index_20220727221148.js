import Head from "next/head";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { useEffect, useRef } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
const Home = () => {
  const { authenticate, isAuthenticated } = useMoralis();
  const router = useRouter();
  const checkUsers=as()=>{
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const response = await contract.methods
        .checkUser()
        .send({ from: user.get("ethAddress") });
        console.log(response.events.Transfer.returnValues)
        let userExists=response.events.Transfer.returnValues;
        if(userExists)
      router.push("/home");
      else 
      router.push("/signup")
  }
  useEffect(() => {
    if (isAuthenticated) {
      
      
      
    }
  }, [isAuthenticated]);
  const onSubmit1 = async (event) => {
    event.preventDefault();
    await authenticate();
  };
  const phoneNumberInputElement = useRef();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Flipkart Grid</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div class="grid grid-rows-3 grid-cols-2 gap-0 absolute lg:top-20 top-10  rights-1/3  lg:right-80 lg:left-80 z-50  mt-16  text-center ">
        <div class="row-span-3 col-span-2 ... bg-white flex flex-wrap justify-center drop-shadow-lg mx-auto ">
          <div className="block justify-center text-left drop-shadow-md mx-auto">
            <h1 className="mx-6 mt-3 text-3xl justify-center  font-semibold font-sans">
              Sign up
            </h1>
            <div className="flex">
              <button
                onClick={authenticate}
                className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 flex mx-7 mt-5"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
