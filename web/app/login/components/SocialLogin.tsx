import Image from "next/image";

export default function SocialLogin() {
  const socialPlatforms = [
    { name: "카카오", src: "/icon/kakao.png" },
    { name: "네이버", src: "/icon/naver.png" },
    { name: "구글", src: "/icon/google.png" },
  ];

  return (
    <div className="w-full max-w-sm mt-6">
      <div className="flex justify-center gap-5 mt-2">
        {socialPlatforms.map((platform) => (
          <button
            key={platform.name}
            className="p-3 w-20 h-20 flex items-center justify-center"
          >
            <Image
              src={platform.src}
              alt={`${platform.name} 로그인`}
              width={64}
              height={64}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
