"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
  useCallback,
} from "react";
import KeepItSafeABI from "../abi/KeepItSafe.json";
import { ethers } from "ethers";

interface ContractContextData {
  keepItSafeContract: ethers.Contract | null;
}

const ContractContext = createContext<ContractContextData>(
  {} as ContractContextData
);

export const KeepItSafeContractProvider = ({ children }: PropsWithChildren) => {
  const [keepItSafeContract, setKeepItSafeContract] =
    useState<null | ethers.Contract>(null);

  const ConnectWithContract = useCallback(async () => {
    console.log(ethers);
    const KeepItSafeContract = new ethers.Contract(
      KeepItSafeABI.address,
      KeepItSafeABI.abi,
      new ethers.providers.Web3Provider(window.ethereum).getSigner()
    );
    setKeepItSafeContract(KeepItSafeContract);
  }, []);

  useEffect(() => {
    ConnectWithContract();
  }, [ConnectWithContract]);

  return (
    <ContractContext.Provider
      value={{
        keepItSafeContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useKeepItSafeContract = () => {
  const context = useContext(ContractContext);
  return context;
};
