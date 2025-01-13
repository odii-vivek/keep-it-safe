"use client";

import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import axios from "axios";
import UniversityProfileForm from "./university-profile-form";
import StudentProfileForm from "./student-profile-form";

export default function CompleteProfile() {
  const { wallets } = useWallets();
  const [isUniversity, setIsUniversity] = useState<Boolean>(false);
  const [isProfileComplete, setIsProfileComplete] = useState<Boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  useEffect(() => {
    const wallet = wallets[0];
    setIsLoading(true);
    axios.get(`/api/findUser?address=${wallet?.address}`).then(
      (response) => {
        setIsUniversity(response.data.isUniversity);
        console.log(response.data);
        setIsLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    isLoading ? <div className="h-[100vh] flex justify-center items-center"><CircularProgress size="lg" color="secondary" /></div> : isUniversity ? <UniversityProfileForm /> : <StudentProfileForm />
  )
}