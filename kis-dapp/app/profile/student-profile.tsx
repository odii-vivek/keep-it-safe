"use client";

import {
  Button,
  Card,
  CardBody,
  Image,
  CardFooter,
  CircularProgress,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useKeepItSafeContract } from "@/hooks/useKeepItSafe";
import { useWallets, usePrivy } from "@privy-io/react-auth";

export default function StudentProfile() {
  const [time, setTime] = useState(0);
  const router = useRouter();
  const { keepItSafeContract } = useKeepItSafeContract();
  const { ready, authenticated, login, user, linkEmail } = usePrivy();
  const { wallets } = useWallets();
  const [gotDocs, setGotDocs] = useState<any>();
  const [idCardPresent, setIdCardPresent] = useState(false);
  const [studentDetails, setStudentDetails] = useState();
  const [idCardDoc, setIdCardDoc] = useState<any>();
  const [remove, setRemove] = useState<boolean>(false);
  let idCardHash = "";

  // const GetIpfsUrlFromPinata = (pinataUrl: any) => {
  //   if (pinataUrl === null) return;
  //   var IPFSUrl = pinataUrl.split("/");
  //   const lastIndex = IPFSUrl.length;
  //   IPFSUrl = "https://ipfs.io/ipfs/" + IPFSUrl[lastIndex - 1];
  //   return IPFSUrl;
  // };

  useEffect(() => {
    const getDocsForStudent = async () => {
      if (keepItSafeContract) {
        const currTime = await keepItSafeContract.time();
        setTime(parseInt(currTime));
        const studentDocs = await keepItSafeContract.getStudentDocs();
        setGotDocs(studentDocs);
        studentDocs.map((doc: any, id: any) => {
          projects.map((proj: any, idx: any) => {
            if (proj.value === doc[0]) {
              proj.exists = true;
              proj.img = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${doc.ipfsHash}?${process.env.NEXT_PUBLIC_TOKEN}`;
            }
            if (doc[0] === "idcard") {
              console.log(parseInt(doc.expiresIn));
              setIdCardDoc(doc);
              idCardHash = doc.ipfsHash;
              setIdCardPresent(true);
            }
          });
        });
      }
    };
    const getStudentDetails = async () => {
      if (keepItSafeContract) {
        const studentDetails = await keepItSafeContract.getStudentDetails(wallets[0].address);
        setStudentDetails(studentDetails);
      }
    };
    getDocsForStudent();
    getStudentDetails();
  }, []);

  useEffect(() => {
    let countDownInterval: any;
    if (idCardDoc?.expiresIn) {
      console.log(parseInt(idCardDoc.expiresIn));
      countDownInterval = setInterval(() => {
        console.log(parseInt(idCardDoc.expiresIn) - time);
        if (parseInt(idCardDoc.expiresIn) - time <= 0) {
          setRemove(true);
        }
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (countDownInterval) {
        clearInterval(countDownInterval)
      }
    }
  }, [time, idCardDoc?.expiresIn])

  return (
    // <div className="h-[100vh] flex justify-center items-center flex-col">
    //   <div className="mb-[1%]">
    //     <h1 className="text-6xl">Profile</h1>
    //     <div className="h-20 flex justify-around">
    //         <div>Expiring docs</div>
    //         <Divider orientation="vertical" className="bg-slate-400"/>
    //         <div>Permanent docs</div>
    //     </div>
    //   </div>
    // </div>
    <div className="h-[50rem] mt-16 w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex flex-col items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="text-4xl mt-[15%] sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-5">
        {`${studentDetails ? studentDetails[0] : <CircularProgress />
          }'s documents`}
      </div>
      
      <div className=" text-4xl flex flex-col">
        <div>Expires in {(idCardDoc?.expiresIn && !remove) ? parseInt(idCardDoc.expiresIn) - parseInt(time) : 0} sec</div>
        <div>
          <Card shadow="sm" isPressable className="mt-5 items-center">
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                alt={"ID Card"}
                className="w-full object-cover h-[140px]"
                src={`${(idCardDoc?.expiresIn && !remove)
                  ? 'https://i.ibb.co/pd1H6HZ/idCard.jpg'
                  : 'https://placehold.co/600x400?text=Placeholder'
                  }`}
              />
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{"ID Card"}</b>
              <Button
                color={(idCardPresent && !remove) ? "success" : "danger"}
                isIconOnly
                onPress={() => {
                  if (!idCardPresent) {
                    router.push("/request");
                  }
                }}
              >
                {(idCardPresent && !remove) ? <FaCheck color="white" /> : <FaPlus />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className=" text-4xl mt-[3%] flex-start mb-[10%]">
        <div>Permanent documents</div>
        <div className="flex flex-row gap-5 mt-5">
          {projects.map((item, index) => (
            <Card shadow="sm" key={index} isPressable>
              <CardBody className="overflow-visible p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  alt={item.title}
                  className="w-full object-cover h-[140px]"
                  src={item.img}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{item.title}</b>
                <Button
                  color={item.exists ? "success" : "danger"}
                  isIconOnly
                  onPress={() => {
                    if (!item.exists) {
                      router.push("/request");
                    }
                  }}
                >
                  {item.exists ? <FaCheck color="white" /> : <FaPlus />}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

let defaultURL =
  "https://placehold.co/600x400?text=Placeholder"

export const projects = [
  {
    title: "LOR",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    img: defaultURL,
    value: "lor",
    exists: false,
  },
  {
    title: "Degree",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime",
    img: defaultURL,
    value: "degree",
    exists: false,
  },
  {
    title: "Gradesheet",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    img: defaultURL,
    value: "gradesheet",
    exists: false,
  },
];
