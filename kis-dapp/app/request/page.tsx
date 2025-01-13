"use client";

import { useWallets, usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import PendingRequest from "../../components/pending-request";
import RaiseRequest from "../../components/raise-request";
import {CircularProgress} from "@nextui-org/react";

export default function RequestPage() {
  const router = useRouter();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [isUniversity, setIsUniversity] = useState<Boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const { ready, authenticated, login, user, linkEmail } = usePrivy();

  useEffect(() => {
    setIsLoading(true);
    axios.get(`/api/findUser?address=${wallet?.address}`).then(
      (response) => {
        setIsUniversity(response.data.isUniversity);
        if(!response.data.isProfileComplete) {
            router.push('/profile/complete');
        }
        console.log(response.data);
        setIsLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return isLoading?<div className="h-[100vh] flex justify-center items-center"><CircularProgress size="lg" color="secondary"/></div>:(isUniversity? <PendingRequest/>:<RaiseRequest/>)
}
