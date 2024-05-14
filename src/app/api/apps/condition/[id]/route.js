import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const db = new PrismaClient();

export const GET = async (req, { params }) => {
    const id = parseInt(params.id);
    try {
        const condition = await db.condition.findUnique({
            where: { id: id },
        });
        return NextResponse.json({ condition, status: 200 });
    } catch (error) {
        console.log(error);
    }
}

export const PUT = async (req, { params }) => {
    const id = parseInt(params.id);
    try {
        const data = await req.json();
        const updatedCondition = await db.condition.update({
            where: { id: id },
            data: data,
        });
        return NextResponse.json({ updatedCondition, status: 200 });
    } catch (error) {
        console.log(error);
    }
}


export const DELETE = async (req, { params }) => {
    const id = parseInt(params.id);
    try {
        const condition = await db.condition.delete({
            where: { id: id },
        });
        return NextResponse.json({ condition, status: 200 })
    } catch (error) {
        console.log(error);
    }
}

