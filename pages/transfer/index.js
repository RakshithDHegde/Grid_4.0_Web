import Head from "next/head";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import Header from "../components/Header";
import { Alert } from "@mui/material";
const Home = () => {
  const web3 = new Web3(Web3.givenProvider);
  const { isAuthenticated, user } = useMoralis();
  const [address, setAddress] = useState("");
  const [prodId, setProdId] = useState("");
  const router = useRouter();
  const [success, setSucess] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!address) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
      return;
    }
    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      let response = await contract.methods
        .tranferProduct(address, prodId)
        .send({ from: user.get("ethAddress") });
      setSucess(true);
      setTimeout(() => {
        setSucess(false);
      }, 5000);
    } catch (err) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Header />

        {success && (
          <Alert
            variant="filled"
            className="fixed top-9 z-50"
            severity="success"
            color=""
          >
            Congratulations transfer Has been Successfully Placed
          </Alert>
        )}
        {error && (
          <Alert
            variant="filled"
            className="fixed top-9 z-50"
            severity="error"
            color=""
          >
            Transfer Could not be initiated. Please try again!
          </Alert>
        )}
        <div class="grid grid-rows-3 grid-cols-2 gap-0 absolute lg:top-20 top-10  rights-1/3  lg:right-80 lg:left-80 z-50  mt-16  text-center ">
          <div class="row-span-3 col-span-2 ... bg-white flex flex-wrap justify-center drop-shadow-lg mx-auto ">
            <div className="block justify-center text-left drop-shadow-md mx-auto">
              <h1 className="mx-6 mt-3 text-3xl justify-center  font-semibold font-sans">
                Enter the Details
              </h1>

              <TextField
                required
                sx={{ mt: 5, ml: 3, width: 3 / 4 }}
                id="outlined-basic"
                label="To: address"
                variant="outlined"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
              <TextField
                required
                sx={{ mt: 5, ml: 3, width: 3 / 4 }}
                id="outlined-basic"
                label="Serial No"
                variant="outlined"
                value={prodId}
                onChange={(event) => setProdId(event.target.value)}
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
