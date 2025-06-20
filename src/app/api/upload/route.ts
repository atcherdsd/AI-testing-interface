import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const files = formData.getAll('file');

    console.log('Получены файлы:', files);

    return NextResponse.json({ task_id: '11111' });
}
