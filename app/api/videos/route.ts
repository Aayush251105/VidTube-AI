import {NextRequest , NextResponse} from "next/server"
import { PrismaClient } from "@/app/generated/prisma"

const prisma = new PrismaClient()

export async function GET(request : NextRequest){
    try{
       const videos =  await prisma.video.findMany({
            orderBy: {createdAt: "desc"}

        })

        return NextResponse.json(videos)
    }
    catch(err){
        return NextResponse.json({Error: "Error fetching videos"},
            {status: 500}
        )
    } finally {
        await prisma.$disconnect()
    }
}