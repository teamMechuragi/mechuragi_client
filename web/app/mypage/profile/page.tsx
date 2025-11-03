"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera } from "lucide-react";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { useUser } from "@/app/context/UserContext";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [username, setUsername] = useState(user?.username || "아이디");
  const [profileImage, setProfileImage] = useState("/profile/default-profile.png");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 이미지 파일 선택 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 저장하기
  const handleSave = async () => {
    try {
      // ========== 실제 서버 연결 시 사용할 코드 ==========
      // 1. FormData 생성 (이미지 + 아이디)
      const formData = new FormData();
      formData.append("username", username);
      
      // 2. 이미지 파일이 있으면 추가
      const fileInput = document.getElementById("profile-image") as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append("profileImage", fileInput.files[0]);
      }
      
      // 3. 서버에 업로드 요청
      const response = await fetch("http://13.125.127.106/api/user/profile", {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      
      // 4. 응답 처리
      if (!response.ok) {
        throw new Error("프로필 업데이트 실패");
      }
      
      const data = await response.json();
      
      // 5. 서버에서 받은 이미지 URL로 사용자 정보 업데이트
      const userData = {
        username: data.username,
        email: data.email,
        profileImage: data.profileImageUrl, // 서버에서 받은 이미지 URL
      };
      
      // 6. Context와 localStorage에 저장
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      // ========== 실제 서버 연결 코드 끝 ==========

      alert("프로필이 저장되었습니다.");
      router.back();
    } catch (error) {
      alert("프로필 저장 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <div className="w-full max-w-sm mx-auto">
        <Header title="프로필 설정" backLink="/mypage" isSignup />
      </div>

      {/* 컨텐츠 */}
      <div className="flex flex-col items-center flex-1 px-6 pb-24">
        {/* 프로필 이미지 */}
        <div className="mt-12 mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-[#3CDCBA] rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src={previewImage || profileImage}
                alt="프로필"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            {/* 카메라 아이콘 버튼 */}
            <label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 w-10 h-10 bg-[#3CDCBA] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#35c4a9] shadow-lg"
            >
              <Camera size={20} className="text-white" />
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* 아이디 입력 */}
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              아이디
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-b-2 border-[#3CDCBA] focus:outline-none text-center text-lg"
              placeholder="아이디를 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <Footer
        type="button"
        buttonText="저장하기"
        onButtonClick={handleSave}
      />
    </div>
  );
}