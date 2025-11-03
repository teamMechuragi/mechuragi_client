import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images') as File[];

    // 나중에 실제 저장 로직 추가 (Supabase, S3 등)
    const uploadedImages = images.map((image) => ({
      id: Date.now().toString(),
      url: `/uploads/${image.name}`,
      name: image.name,
    }));

    return NextResponse.json(uploadedImages);
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}