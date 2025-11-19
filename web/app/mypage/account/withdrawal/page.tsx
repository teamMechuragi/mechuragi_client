'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/common/Header';
import { useUser } from '@/app/context/UserContext';

export default function WithdrawalPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isChecked, setIsChecked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const withdrawalReasons = [
    '계정 및 프로필 정보 삭제',
    '메뉴 조회 및 분석 기록 삭제',
    '상세검색 설정값 삭제',
    '캘린더 저장 정보 삭제',
  ];

  const handleWithdrawal = async () => {
    if (isWithdrawing) return;
    
    setIsWithdrawing(true);

    try {
      // ✅ 수정: localStorage에서 사용자 정보 가져오기
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        alert('로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
        setIsWithdrawing(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      const memberId = user.id;

      // ✅ 수정: 엔드포인트 경로 변경
      const response = await fetch(`https://mechuragi.kro.kr/api/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // ✅ 수정: 204 No Content 처리
      if (response.ok) {
        // 회원 탈퇴 성공
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        alert('회원 탈퇴가 완료되었습니다.');
        router.replace('/login');
      } else {
        alert('회원 탈퇴 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="회원 탈퇴" backLink="/mypage/account" />

      <div className="px-6 py-6">
        <h2 className="text-xl font-bold mb-4">유의사항</h2>
        
        <p className="text-sm text-gray-700 mb-6">
          회원 탈퇴 시 회원 정보는 모두 삭제되며 복구가 불가능합니다.
        </p>

        <div className="space-y-3 mb-8">
          {withdrawalReasons.map((reason, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600">{reason}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-700 mb-6">
          투표 게시글 유저
        </p>

        {/* 동의 체크박스 */}
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <div 
            onClick={() => setIsChecked(!isChecked)}
            className="flex items-center justify-center cursor-pointer"
          >
            {isChecked ? (
              <div className="w-6 h-6 bg-[#3CDCBA] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            )}
          </div>
          <p className="text-sm text-gray-700 flex-1">
            위 유의사항을 모두 숙지했고, 탈퇴에 동의합니다.
          </p>
        </div>
      </div>

      {/* 탈퇴하기 버튼 */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-6 py-4 bg-white">
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={!isChecked}
          className={`w-full py-3 rounded-[50px] font-bold transition-all ${
            isChecked
              ? 'bg-[#3CDCBA] text-white cursor-pointer'
              : 'bg-[#CCCCCC] text-white cursor-not-allowed'
          }`}
        >
          탈퇴하기
        </button>
      </div>

      {/* 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h2 className="text-lg font-bold text-center mb-4">
              정말 탈퇴하시겠습니까?
            </h2>
            <p className="text-sm text-gray-600 text-center mb-8">
              탈퇴 후 모든 데이터는 복구할 수 없습니다.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isWithdrawing}
                className={`flex-1 py-3 bg-gray-300 text-gray-700 rounded-full font-bold transition-all ${
                  isWithdrawing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
                }`}
              >
                취소
              </button>
              <button
                onClick={handleWithdrawal}
                disabled={isWithdrawing}
                className={`flex-1 py-3 bg-[#3CDCBA] text-white rounded-full font-bold transition-all ${
                  isWithdrawing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2CBCA0]'
                }`}
              >
                {isWithdrawing ? '탈퇴 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}