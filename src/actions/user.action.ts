"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  try {
    const {userId} = await auth();
    const user = await currentUser();

    if (!user || !userId) {
      console.error("No user found or userId is missing");
      return;
    }
    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    // If the user already exists, return it
    if (existingUser) return existingUser;
    
    // If the user does not exist, create a new user in the database
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0]?.emailAddress,
        image: user.imageUrl || null,        
      },
    });

    return dbUser;

  } catch (error) {
    console.error("Error syncing user:", error);
    return;
  }
}