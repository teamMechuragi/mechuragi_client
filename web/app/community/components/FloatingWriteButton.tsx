'use client';

import { useRouter } from 'next/navigation';

export default function FloatingWriteButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/community/write')}
      className="fixed right-6 bottom-24 w-14 h-14 bg-[#3CDCBA] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2FC9A8] transition-colors z-10"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>
  );
}