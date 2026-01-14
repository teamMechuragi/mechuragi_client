"use client";

import Image from "next/image";

export default function SocialLogin() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined' && window.location.origin.includes('localhost')
      ? 'http://localhost:8080'
      : '');
  
  const socialPlatforms = [
    {
      name: "카카오",
      src: "/icon/kakao.png",
      loginUrl: `${apiUrl}/oauth2/authorization/kakao`,  // 이렇게 수정
    },
  ]

  const handleLogin = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="w-full max-w-sm -mt-2">
      <div className="flex justify-center gap-5 mt-2">
        {socialPlatforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleLogin(platform.loginUrl)}
            className="relative w-full h-16 flex items-center justify-center"
          >
            <Image
              src={platform.src}
              alt={`${platform.name} 로그인`}
              fill
              className="object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}