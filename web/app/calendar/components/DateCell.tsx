'use client';

import { useRef } from 'react';

interface DateCellProps {
  day: number | null;
  images: string[];
  dayOfWeek: number;
  onImageUpload: (day: number, files: FileList) => void;
}

export default function DateCell({ day, images, dayOfWeek, onImageUpload }: DateCellProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!day) return <div className="aspect-square" />;

  const hasImages = images.length > 0;

  const handleClick = () => {
    if (!hasImages) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageUpload(day, files);
    }
  };

  return (
    <div 
      className="aspect-square relative rounded-lg cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <span className={`text-sm mb-1 ${
          dayOfWeek === 0 ? 'text-red-500' : 
          dayOfWeek === 6 ? 'text-blue-500' : 
          'text-gray-900'
        }`}>
          {day}
        </span>
        
        {hasImages ? (
          <img 
            src={images[0]} 
            alt={`${day}일`}
            className="w-16 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-12 flex items-center justify-center text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}