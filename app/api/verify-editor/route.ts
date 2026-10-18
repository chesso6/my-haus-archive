import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json();

    const dbUrl = process.env.FIREBASE_DATABASE_URL || process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    const ownerPassword = process.env.OWNER_PASSWORD;

    if (ownerPassword && password && password.trim().toUpperCase() === ownerPassword.trim().toUpperCase()) {
      return NextResponse.json({ success: true, role: 'owner' });
    }

    if (!dbUrl) {
      return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
    }

    const res = await fetch(`${dbUrl}/hausEditors.json`);
    
    if (!res.ok) {
      return NextResponse.json({ success: false, message: 'Failed to access database' }, { status: 500 });
    }

    const editorsData = await res.json();

    if (!editorsData) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const matchedEditor = Object.values(editorsData).find(
      (editor: any) =>
        editor.password === password &&
        editor.name.toLowerCase() === (name || '').toLowerCase()
    );

    if (matchedEditor) {
      return NextResponse.json({
        success: true,
        role: 'editor',
        editorName: (matchedEditor as any).name,
      });
    }

    return NextResponse.json({ success: false, message: 'UNAUTHORIZED ACCESS' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'LOGIN FAILED' }, { status: 500 });
  }
}