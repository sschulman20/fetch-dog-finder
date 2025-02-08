// app/api/get-dogs/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Now use your token to fetch the dog data from your service
    // Example: const dogs = await getDogsFromDatabase(token);
    return NextResponse.json({ dogs: [] }); // Placeholder response

  } catch (error) {
    console.error("Error fetching dogs:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
