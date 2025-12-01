"use client";

import Image from "next/image";

export default function SocialLogin() {
  const socialPlatforms = [
    {
      name: "카카오",
      src: "/icon/kakao.png",
      loginUrl: "https://mechuragi.kro.kr/oauth2/authorization/kakao",
    },
  ];

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