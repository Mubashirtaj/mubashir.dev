import dbConnect from '@/utils/db';
import User  from '@/utils/models/user.model';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    try {
        await dbConnect();

        console.log(request);
        const body = await request.json();
        
        const { email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }

        const user = await User.create({
            email,
            password,
            name,
        });

        return NextResponse.json(
            {
                id: user._id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}