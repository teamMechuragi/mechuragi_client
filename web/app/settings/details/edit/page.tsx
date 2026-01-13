'use client';

import EditDetailsClient from '../[id]/EditDetailsClient';
import { useSearchParams } from 'next/navigation';

export default function EditDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'new';
  
  return <EditDetailsClient id={id} />;
}
