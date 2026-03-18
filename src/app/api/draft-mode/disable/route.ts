import { draftMode } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  ;(await draftMode()).disable()
  const url = new URL(req.nextUrl.href)
  const redirectTo = url.searchParams.get('redirectTo') ?? '/'
  return NextResponse.redirect(new URL(redirectTo, req.url))
}
