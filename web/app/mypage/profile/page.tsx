"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera } from "lucide-react";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { useUser } from "@/app/context/UserContext";
import { checkNickname, updateNickname, updateProfileImage } from "@/app/api/memberApi";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [nickname, setNickname] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);

  // ✅ 현재 확정된 프로필 이미지 (화면에 보이는 값)
  const [profileImage, setProfileImage] = useState(
    user?.profileImage || "/profile/default-profile.png"
  );

  useEffect(() => {
  return () => {
    if (profileImage.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }
  };
}, [profileImage]);

  // ✅ 선택만 한 상태 (화면에는 안 보임)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  // 이미지 파일 선택
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1️⃣ 업로드용 파일 보관
    setSelectedImageFile(file);

    // 2️⃣ 즉시 미리보기용 URL 생성
    const previewUrl = URL.createObjectURL(file);

    // 3️⃣ 화면에 즉시 반영
    setProfileImage(previewUrl);
  };

  // 저장 완료 버튼 클릭시
 const handleSave = async () => {
  if (loading) return;
  setLoading(true);

  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
      return;
    }

    const currentUser = JSON.parse(userStr);

    // 1️⃣ 닉네임 중복 체크
    if (nickname !== currentUser.username) {
      const isExist = await checkNickname(nickname);
      if (isExist) {
        alert("이미 사용중인 닉네임입니다.");
        return;
      }
    }

    // 2️⃣ 프로필 이미지 업로드 (있을 때만)
    if (selectedImageFile) {
      await updateProfileImage(selectedImageFile);
    }

    // 3️⃣ 닉네임 변경 (최종 사용자 정보는 여기서 받음)
    const updatedMember = await updateNickname({ nickname });

    // 4️⃣ 전역 사용자 정보 갱신
    const userData = {
      id: updatedMember.id,
      username: updatedMember.nickname,
      email: updatedMember.email,
      profileImage:
        updatedMember.profileImageUrl || "/profile/default-profile.png",
      emailVerified: updatedMember.emailVerified,
      provider: updatedMember.provider,
      role: updatedMember.role,
      status: updatedMember.status,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // 5️⃣ 화면 반영
    setProfileImage(userData.profileImage);
    setSelectedImageFile(null);

    alert("프로필이 저장되었습니다.");
    router.back();
  } catch (error) {
    console.error(error);
    alert("프로필 저장 중 오류가 발생했습니다.");
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
                src={profileImage}
                alt="프로필"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>

            {/* 카메라 버튼 */}
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

        {/* 닉네임 */}
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
