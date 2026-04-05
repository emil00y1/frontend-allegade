import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-upload-secret',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  const uploadSecret = process.env.FONT_UPLOAD_SECRET
  if (uploadSecret) {
    const provided = req.headers.get('x-upload-secret')
    if (provided !== uploadSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
    }
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400, headers: CORS_HEADERS })
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: CORS_HEADERS })
  }

  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
  const allowed = ['.woff2', '.woff', '.ttf', '.otf']
  if (!allowed.includes(ext)) {
    return NextResponse.json(
      { error: 'Ugyldig filtype. Tilladte formater: .woff2, .woff, .ttf, .otf' },
      { status: 400, headers: CORS_HEADERS },
    )
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Blob storage er ikke konfigureret (BLOB_READ_WRITE_TOKEN mangler)' },
      { status: 500, headers: CORS_HEADERS },
    )
  }

  const blob = await put(`fonts/${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return NextResponse.json({ url: blob.url }, { headers: CORS_HEADERS })
}
