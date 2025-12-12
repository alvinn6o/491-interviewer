import { NextResponse } from "next/server";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Enter email and password." },
                {status: 400}
            );
        }

    const user = await db.user.findUnique({
        where: { email },
    });

    if (!user || !user.password) {
        return NextResponse.json(
            {error: "Invalid email or password."},
            {status: 401}
        );
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid){
        return NextResponse.json( {error: "Invalid email or password."}, {status: 401} );
    }
    return NextResponse.json({message: "Login successful."}, {status: 200});
}
catch(error){
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
        {error: "Error."},
        { status: 500 }
    );
}}