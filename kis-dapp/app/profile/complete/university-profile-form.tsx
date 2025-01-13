"use client";

import { useState, useEffect } from "react";
import { Input, Button } from "@nextui-org/react";
import { useKeepItSafeContract } from "@/hooks/useKeepItSafe";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function UniversityProfileForm() {
  const [universityName, setUniversityName] = useState<String>();
  const { keepItSafeContract } = useKeepItSafeContract();
  const [universityLocation, setUniversityLocation] = useState<String>();
  const { ready, authenticated, login, user, linkEmail } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const router = useRouter();

  const submitDetails = async () => {
    const id = toast.loading("Please wait, your profile is being completed", {
      position: "top-center",
    });
    console.log(user);
    try {
      if (user?.email) {
        const email = user.email.address.toString();
        console.log(email);
        const indexAt = email.indexOf("@");
        let indexDot = email.length;
        for (let i = indexAt; i < email.length; i++) {
          if (email[i] === ".") {
            indexDot = i;
            break;
          }
        }
        console.log(email);
        const _domain = email.slice(indexAt + 1, indexDot);
        console.log(_domain);
        await axios.patch(`/api/updateProfile?address=${wallet.address}`).then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
        console.log(keepItSafeContract);
        const tx = await keepItSafeContract?.addInstitute(
          universityName,
          universityLocation,
          _domain
        );
        await tx.wait();
      } else {
        console.log("User email is undefined");
      }
      toast.update(id, {
        render: "Profile submitted Successfully",
        type: "success",
        position: 'top-center',
        isLoading: false,
        autoClose: 4000,
      });
      router.back();
    } catch (err) {
      console.error(err);
      toast.error("Transaction Rejected", {
        position: "top-center",
        autoClose: 4000,
      });
      toast.dismiss(id);
    }
  };
  return (
    <div className="h-[100vh] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex flex-col items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="text-6xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 ">
        {`Type university's name & location`}
      </div>
      <Input
        size="lg"
        className="w-[50%] mt-5"
        placeholder="Name"
        autoFocus
        variant="underlined"
        onChange={(e) => setUniversityName(e.target.value)}
      />

      <Input
        size="lg"
        className="w-[50%] mt-5"
        autoFocus
        placeholder="Location"
        variant="underlined"
        onChange={(e) => setUniversityLocation(e.target.value)}
      />
      <button className="p-[3px] relative mt-10" onClick={submitDetails}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
          Submit
        </div>
      </button>
      <ToastContainer />
    </div>
  );
}
