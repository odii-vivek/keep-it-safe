"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";
import axios from "axios";
import UniversityProfile from "./university-profile";
import StudentProfile from "./student-profile";
import { CircularProgress } from "@nextui-org/react";
export default function AuroraBackgroundDemo() {
    const router = useRouter();
    const { wallets } = useWallets();
    const wallet = wallets[0];
    const [isUniversity, setIsUniversity] = useState<Boolean>(false);
    const [isLoading, setIsLoading] = useState<Boolean>(false);
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
  
    return isLoading?<div className="h-[100vh] flex justify-center items-center"><CircularProgress size="lg" color="secondary"/></div>:(isUniversity? <UniversityProfile/>:<StudentProfile/>)
}
