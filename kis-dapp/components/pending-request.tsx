"use client";

import { HoverEffect } from "@/components/ui/card-hover-effect";
import { useState, useEffect, useRef } from "react";
import { useKeepItSafeContract } from "@/hooks/useKeepItSafe";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import {
  Card,
  CardBody,
  Button,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@nextui-org/react";

export default function PendingRequest() {
  const { keepItSafeContract } = useKeepItSafeContract();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [studentRequests, setStudentRequests] = useState<any>(null);
  const [expiresIn, setExpiresIn] = useState(0);
  const router = useRouter();
  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedproject, setSelectedProject] = useState<any>();
  const inputFile = useRef(null);
  const inputExpiresIn = useRef(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
    onClose: onClose2,
  } = useDisclosure();

  const submitRequest = async () => {
    const id = toast.loading("Approving Request, Please wait!", {
      position: 'top-center'
    });
    try {
      if(keepItSafeContract){
        const time = await keepItSafeContract.time();
        let newExpiresIn = 0;
        if (expiresIn !== 0) {
          newExpiresIn = parseInt(time) + parseInt(expiresIn);
        }
        const tx = await keepItSafeContract?.approveDocumentRequest(
          selectedproject?.studentAddress,
          selectedproject?.docType,
          cid,
          newExpiresIn
        );
        await tx.wait();
      }
      toast.update(id, {
        render: "Approved Request Successfully",
        type: "success",
        position: 'top-center',
        isLoading: false,
        autoClose: 4000,
      });
      onClose();
    }
    catch (err) {
      console.error(err);
      toast.error("Transaction Rejected", {
        position: 'top-center',
        autoClose: 4000,
      });
      toast.dismiss(id);
    }
  };


  useEffect(() => {
    const getStudentsRequests = async () => {
      if (keepItSafeContract) {
        const requestsData = await keepItSafeContract.getAllRequestsForInstitutes();
        const updatedRequests = await Promise.all(requestsData.map(async (request: any) => {
          const studentDetails = await getStudentDetails(request[0]);
          return {
            studentDetails,
            studentAddress: request[0],
            docType: request[1],
            exists: request[2]
          };
        }));
        setStudentRequests(updatedRequests);
      }
    };
    getStudentsRequests();
  }, []);

  async function getStudentDetails(studentAddress: any) {
    const studentDetails = await keepItSafeContract?.getStudentDetails(studentAddress);
    return studentDetails;
  }

  const uploadFile = async (fileToUpload: any) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      setCid(resData.IpfsHash);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const changeHandler = (project: any) => {
    console.log(project);
    setSelectedProject(project);
  };

  const handleChange = (e: any) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  const handleChange2 = (e: any) => {
    setExpiresIn(e.target.value);
  };

  const rejectRequest = async(project: any) =>{
    const id = toast.loading("Rejecting Request, Please wait!", {
      position: 'top-center'
    });
    console.log(project);
    console.log(project.studentAddress);
    console.log(project.docType);
    try{
      if(keepItSafeContract){
        const tx = await keepItSafeContract.rejectDocumentRequest(project.studentAddress, project.docType);
        await tx.wait();
        toast.update(id, {
          render: "Request Rejected Successfully",
          type: "success",
          position: 'top-center',
          isLoading: false,
          autoClose: 4000,
        });
        onClose();
      }
    }
    catch(err){
      console.error(err);
      toast.error("Transaction Rejected", {
        position: 'top-center',
        autoClose: 4000,
      });
      toast.dismiss(id);
    }
  }

  return (
    // <div className="h-[100vh] flex justify-center items-center flex-col mx-10">
    //   {studentRequests?.map((project: any, index: any) => (
    //     <Card
    //       className="w-full mt-4 p-3"
    //       shadow="sm"
    //       key={index}
    //       isPressable
    //       onPress={() => console.log("item pressed")}
    //     >
    //       <CardHeader className="justify-between">
    //         <div>{project.docType}</div>
    //         <div>{project?.studentDetails[0]}</div>
    //       </CardHeader>
    //       <CardBody className="flex flex-row-reverse gap-2">
    //         <Button
    //           color="success"
    //           variant="flat"
    //           onClick={() => changeHandler(project)}
    //           onPress={project.docType !== "idcard" ? onOpen : onOpen2}
    //         >
    //           Approve
    //         </Button>
    //         <Button color="danger" variant="flat">
    //           Reject
    //         </Button>
    //       </CardBody>
    //     </Card>
    //   ))}
    //   <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
    //     <ModalContent>
    //       {(onClose) => (
    //         <>
    //           <ModalHeader className="flex flex-col gap-1">
    //             Upload document
    //           </ModalHeader>
    //           <ModalBody>
    //             <Input
    //               type="file"
    //               autoFocus
    //               label="Image"
    //               placeholder="Upload document"
    //               variant="bordered"
    //               ref={inputFile}
    //               onChange={handleChange}
    //             />
    //           </ModalBody>
    //           <ModalFooter>
    //             <Button
    //               color="primary"
    //               disabled={uploading}
    //               onClick={submitRequest}
    //             >
    //               {uploading ? "Uploading..." : "Upload Your Document to IPFS"}
    //             </Button>
    //           </ModalFooter>
    //         </>
    //       )}
    //     </ModalContent>
    //   </Modal>
    //   <Modal
    //     isOpen={isOpen2}
    //     onOpenChange={onOpenChange2}
    //     placement="top-center"
    //   >
    //     <ModalContent>
    //       {(onClose2) => (
    //         <>
    //           <ModalHeader className="flex flex-col gap-1">
    //             Upload document
    //           </ModalHeader>
    //           <ModalBody>
    //             <Input
    //               type="file"
    //               autoFocus
    //               placeholder="Upload document"
    //               variant="bordered"
    //               ref={inputFile}
    //               onChange={handleChange}
    //             />
    //             <Input
    //               type="text"
    //               placeholder="Expires In"
    //               ref={inputExpiresIn}
    //               onChange={handleChange2}
    //             />
    //           </ModalBody>
    //           <ModalFooter>
    //             <Button
    //               color="primary"
    //               disabled={uploading}
    //               onClick={submitRequest}
    //             >
    //               {uploading ? "Uploading..." : "Upload Your Document to IPFS"}
    //             </Button>
    //           </ModalFooter>
    //         </>
    //       )}
    //     </ModalContent>
    //   </Modal>
    // </div>
    <div className="h-[100vh] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex flex-col items-center ">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="mt-[10%] mb-5 text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-1">
        Pending Requests
      </p>
      <div className="h-[100vh] w-[50%] flex items-center flex-col">
        {studentRequests?.map((project: any, index: any) => (
          <Card
            className="w-full mt-2 p-3"
            shadow="sm"
            key={index}
            isPressable
            onPress={() => console.log("item pressed")}
          >
            <CardHeader className="justify-between">
              <div>{project.docType}</div>
              <div>{project?.studentDetails[0]}</div>
            </CardHeader>
            <CardBody className="flex flex-row-reverse gap-2">
              <Button
                color="success"
                variant="flat"
                onClick={() => changeHandler(project)}
                onPress={project.docType !== "idcard" ? onOpen : onOpen2}
              >
                Approve
              </Button>
              <Button onClick={() => rejectRequest(project)} color="danger" variant="flat">
                Reject
              </Button>
            </CardBody>
          </Card>
        ))}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Upload document
                </ModalHeader>
                <ModalBody>
                  <Input
                    type="file"
                    autoFocus
                    label="Image"
                    placeholder="Upload document"
                    variant="bordered"
                    ref={inputFile}
                    onChange={handleChange}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    disabled={uploading}
                    onClick={submitRequest}
                  >
                    {uploading ? "Uploading..." : "Upload Your Document to IPFS"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isOpen2}
          onOpenChange={onOpenChange2}
          placement="top-center"
        >
          <ModalContent>
            {(onClose2) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Upload document
                </ModalHeader>
                <ModalBody>
                  <Input
                    type="file"
                    autoFocus
                    placeholder="Upload document"
                    variant="bordered"
                    ref={inputFile}
                    onChange={handleChange}
                  />
                  <Input
                    type="text"
                    placeholder="Expires In"
                    ref={inputExpiresIn}
                    onChange={handleChange2}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    disabled={uploading}
                    onClick={submitRequest}
                  >
                    {uploading ? "Uploading..." : "Upload Your Document to IPFS"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <ToastContainer/>
    </div>
  );
}
