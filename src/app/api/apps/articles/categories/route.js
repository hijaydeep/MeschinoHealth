import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

const db = new PrismaClient();

export const GET = async (req) => {
    try {
        const categories = await db.condition.findMany({
            orderBy: [
                { name: 'desc' }
            ]
        });
        return NextResponse.json({ categories, status: 200 })
    } catch (error) {
        console.log(error);
    }
}
