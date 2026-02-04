import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const tag = request.nextUrl.searchParams.get('tag');

  if (!REVALIDATE_SECRET) {
    console.error('REVALIDATE_SECRET is not configured');
    return NextResponse.json(
      { message: 'Server configuration error' },
      { status: 500 },
    );
  }

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ message: 'Missing tag param' }, { status: 400 });
  }

  revalidateTag(tag, 'max');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
