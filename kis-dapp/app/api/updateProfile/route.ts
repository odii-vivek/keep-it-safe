import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get("address");
  if (!walletAddress) {
    return NextResponse.json(
      { message: "Missing wallet address" },
      { status: 400 }
    );
  }

  const updateUser = await prisma.user.update({
    where: {
      address: walletAddress,
    },
    data: {
      isProfileComplete: true,
    },
  });

  return NextResponse.json({ updateUser }, { status: 200 });
}
