"use server"

import { db } from "@/db/drizzle"
import { usersTable } from "@/db/schema"
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getData = async () => {
    const data = await db.select().from(usersTable);

    return data;
}

export const addUser = async (name: string, age: number, email: string) => {
    await db.insert(usersTable).values({
        name, 
        age,
        email
    });
}

export const deleteUser = async (id: number) => {
    await db.delete(usersTable).where(eq(usersTable.id, id));

    revalidatePath('/');
}

export const editUser = async (id: number, name: string, age: number, email: string) => {
    await db.update(usersTable).set({
        name,
        age,
        email
    }).where(eq(usersTable.id, id));
}