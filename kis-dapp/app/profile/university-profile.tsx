import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
  getKeyValue,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useKeepItSafeContract } from "@/hooks/useKeepItSafe";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export default function UniversityProfile() {
  const [allStudents, setAllStudents] = useState<any>(null);
  const { keepItSafeContract } = useKeepItSafeContract();
  const { user } = usePrivy();

  useEffect(() => {
    const getAllStudents = async () => {
      if (keepItSafeContract && user?.email) {
        try {
          const students = await keepItSafeContract.getAllStudentsOfInstitute();
          const arrObj = students?.map((a: any, i: any) => ({
            key: i + 1,
            name: a[0],
            address: a[1],
            domain: "iiits",
          }));
          setAllStudents(arrObj);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      }
    };

    getAllStudents();
  }, [keepItSafeContract, user]);

  const rows = [
    {
      key: "1",
      name: "Vaibhav",
      address: "0xVaibhav",
      id_card: "Yes",
      degree: "Yes",
      gradesheet: "No",
      lor: "No",
    },
    {
      key: "2",
      name: "Dhrupad",
      address: "0xDhrupad",
      id_card: "No",
      degree: "Yes",
      gradesheet: "No",
      lor: "Yes",
    },
    {
      key: "3",
      name: "Abhishek",
      address: "0xAbhishek",
      id_card: "Yes",
      degree: "Yes",
      gradesheet: "No",
      lor: "No",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "address",
      label: "ADDRESS",
    },
    {
      key: "domain",
      label: "Domain",
    },
  ];

  return (
    <div className="h-[100vh] flex flex-col mt-[7%]">
      <div className="text-6xl mt-[12%] flex-start ml-[10%]">IIITS Students</div>
      <Table
        aria-label="Example table with dynamic content"
        className="mt-5 px-20"
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody items={allStudents ?? []}>
          {allStudents?.map((item: any) => (
            <TableRow key={item.key}>
              {columns.map((column) => (
                <TableCell key={column.key}>{item[column.key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
