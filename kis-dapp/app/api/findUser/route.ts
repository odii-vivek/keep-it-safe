import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get("address");
  if (!walletAddress) {
    return NextResponse.json(
      { message: "Missing wallet address" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { address: walletAddress },
  });

  if (user) {
    return NextResponse.json({ isUniversity: user.isUniversity, isProfileComplete: user.isProfileComplete }, { status: 200 });
  } else {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }
}
