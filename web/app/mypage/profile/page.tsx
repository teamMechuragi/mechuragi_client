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
  const [nickname, setNickname] = useState(user?.username || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "/profile/default-profile.png");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (loading) return;
    
    setLoading(true);

    try {
      // ✅ localStorage에서 사용자 정보 가져오기
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        alert('로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
        setLoading(false);
        return;
      }
      
      const currentUser = JSON.parse(userStr);
      const memberId = currentUser.id;

      // ✅ 닉네임 중복 체크 (기존 닉네임과 다를 때만)
      if (nickname !== currentUser.username) {
        const checkResponse = await fetch(
          `https://mechuragi.kro.kr/api/members/check/nickname?nickname=${encodeURIComponent(nickname)}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        
        const isExist = await checkResponse.json();
        
        if (isExist) {
          alert('이미 사용중인 닉네임입니다.');
          setLoading(false);
          return;
        }
      }

      // TODO: 이미지 파일 업로드가 필요하면 여기서 S3 등에 업로드하고 URL 받기
      // const uploadedImageUrl = await uploadImageToS3(file);
      
      // ✅ 수정: 올바른 엔드포인트로 요청
      const response = await fetch(
        `https://mechuragi.kro.kr/api/members/${memberId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            nickname: nickname,
            profileImageUrl: profileImage, // 실제로는 업로드된 이미지 URL
          }),
        }
      );

      if (!response.ok) {
        throw new Error("프로필 업데이트 실패");
      }

      const data = await response.json();
      
      // ✅ 수정: API 명세서 응답 구조에 맞게
      const userData = {
        id: data.id,
        username: data.nickname,
        email: data.email,
        profileImage: data.profileImageUrl,
        emailVerified: data.emailVerified,
        provider: data.provider,
        role: data.role,
        status: data.status,
      };
      
      // Context와 localStorage에 저장
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      alert("프로필이 저장되었습니다.");
      router.back();
    } catch (error) {
      alert("프로필 저장 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
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

        {/* 닉네임 입력 */}
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border-b-2 border-[#3CDCBA] focus:outline-none text-center text-lg"
              placeholder="닉네임을 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <Footer
        type="button"
        buttonText={loading ? "저장 중..." : "저장하기"}
        onButtonClick={handleSave}
        disabled={loading || !nickname.trim()}
      />
    </div>
  );
}