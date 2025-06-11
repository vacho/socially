"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId, // Use the userId from the database
      },
    });

    revalidatePath("/"); // purge the cache for the home page

    return { success: true, post};
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, message: "Failed to create post" };
  }
}
