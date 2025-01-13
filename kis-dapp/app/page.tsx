"use client";
import { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "../components/ui/aurora-background";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { TextGenerateEffect } from "@/components/ui/text-generate";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useKeepItSafeContract } from "@/hooks/useKeepItSafe";

import axios from "axios";

export default function Home() {
  const { ready, authenticated, login, user, linkEmail } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [role, setRoles] = useState();

  const shouldLogin = !ready || (ready && !authenticated);
  const words = `Let's Keep It Safe`;
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { keepItSafeContract } = useKeepItSafeContract();

  const getRoles = useCallback(async () => {
    const role = await keepItSafeContract?.getYourRole();
    setRoles(role);
  }, [keepItSafeContract]);

  useEffect(() => {
    wallet?.address && getRoles();
  }, [getRoles, wallet?.address]);

  const fetchUserDetails = async () => {
    onClose();
    linkEmail();
    await axios
      .get(`/api/user?address=${wallet.address}&isUniversity=false`)
      .then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const fetchUniDetails = async () => {
    onClose();
    linkEmail();
    await axios
      .get(`/api/user?address=${wallet.address}&isUniversity=true`)
      .then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          <TextGenerateEffect words={words} />
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          All your documents in one place
        </div>
        <button
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          disabled={user?.email && !shouldLogin}
          onClick={shouldLogin ? login : user?.email ? () => { } : onOpen}
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-lg font-medium text-white backdrop-blur-3xl">
            {shouldLogin
              ? "Get started"
              : user?.email
                ? wallet?.address.substring(0, 8) +
                "..." +
                wallet?.address.substring(36, wallet?.address.length)
                : "Verify your email now"}
          </span>
        </button>
      </motion.div>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          closeButton: "display-hidden",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Choose one
              </ModalHeader>
              <ModalBody className="flex-row justify-around">
                <Button
                  color="primary"
                  variant="bordered"
                  size="lg"
                  onPress={fetchUserDetails}
                >
                  Student
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  size="lg"
                  onPress={fetchUniDetails}
                >
                  University
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  size="lg"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </AuroraBackground>
  );
}
