"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../common/Header";
import Footer from "../common/Footer";
import TermsCheckbox from "./components/TermsCheckbox";
import TermsDetails from "./components/TermsDetails";

export default function TermsAgreementPage() {
  const router = useRouter();
  const [terms, setTerms] = useState({
    all: false,
    required1: false,
    required2: false,
    required3: false,
    optional: false,
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const storedTerms = localStorage.getItem("termsAgreement");
    if (storedTerms) setTerms(JSON.parse(storedTerms));
  }, []);

  const handleToggle = (name: string) => {
    if (name === "all") {
      const newState = !terms.all;
      const updatedTerms = { all: newState, required1: newState, required2: newState, required3: newState, optional: newState };
      setTerms(updatedTerms);
      localStorage.setItem("termsAgreement", JSON.stringify(updatedTerms));
    } else {
      const updatedTerms = { ...terms, [name]: !terms[name as keyof typeof terms] };
      updatedTerms.all = updatedTerms.required1 && updatedTerms.required2 && updatedTerms.required3 && updatedTerms.optional;
      setTerms(updatedTerms);
      localStorage.setItem("termsAgreement", JSON.stringify(updatedTerms));
    }
  };

  const toggleExpand = (key: string) => setExpanded(expanded === key ? null : key);
  const canProceed = terms.required1 && terms.required2 && terms.required3;

  return (
    <div className="flex justify-center items-center w-full min-h-[100dvh] bg-[#F2F4F6]">
      <div className="relative flex flex-col w-full max-w-[430px] h-[100dvh] bg-white overflow-hidden shadow-2xl">
        
        {/* [배경 그래픽] */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#3CDCBA]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[25%] -left-20 w-64 h-64 bg-[#3CDCBA]/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-20 -right-10 w-40 h-40 bg-gray-100 rounded-full blur-[50px] pointer-events-none" />

        <div className="relative z-20 pt-2">
          <Header title="회원가입" backLink="/login" isSignup />
        </div>

        {/* 상단 섹션: 줄바꿈과 여백을 조정해 답답함 해소 */}
        <div className="relative z-10 px-9 pt-16 pb-10">
          <h1 className="text-[30px] font-black text-[#1a1a1a] leading-[1.4] tracking-[-0.06em]">
            당신의 취향을 분석하고 <br /> 
            딱 맞는 메뉴를 제안하도록,
          </h1>
          <p className="mt-3 text-[19px] font-bold text-[#3CDCBA] tracking-[-0.03em]">
            서비스 이용 동의가 필요해요.
          </p>
        </div>

        {/* 중앙 섹션 (배경색 + 라운드) */}
        <div className="relative flex-1 bg-[#F8F9FA]/80 backdrop-blur-sm rounded-t-[40px] px-9 pt-8 z-10 overflow-y-auto no-scrollbar pb-32">
          
          <div className="mb-8 pb-6 border-b border-gray-200/50">
            <TermsCheckbox 
              label="모든 약관에 전체 동의"
              checked={terms.all}
              onChange={() => handleToggle("all")}
            />
          </div>

          <div className="space-y-6">
            {[
              { key: "required1", label: "(필수) 이용약관 동의", content: `제1조 (목적)\n본 약관은 메추라기(이하 "서비스")가 제공하는 AI 기반 음식 메뉴 추천, 맛집 추천, 먹방 일기, 투표 커뮤니티 등 모든 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.\n\n제2조 (회원가입 및 탈퇴)\n1. 회원가입은 이용자가 본 약관에 동의하고, 소정의 가입 양식을 작성하여 신청하면 서비스가 이를 승낙함으로써 성립합니다.\n2. 회원은 언제든지 서비스 내 설정 메뉴를 통해 탈퇴를 요청할 수 있으며, 서비스는 즉시 회원 탈퇴를 처리합니다.\n3. 탈퇴 시 회원의 개인정보 및 서비스 이용 기록은 개인정보 처리방침에 따라 처리됩니다.\n\n제3조 (서비스 이용 규칙)\n1. 회원은 AI 추천 기능, 먹방 일기 작성, 투표 참여, 커뮤니티 게시물 작성 등 서비스가 제공하는 기능을 자유롭게 이용할 수 있습니다.\n2. 커뮤니티에 게시하는 콘텐츠는 회원 본인이 작성한 것이어야 하며, 타인의 권리를 침해하지 않아야 합니다.\n\n제4조 (금지 행위)\n회원은 다음 각 호의 행위를 하여서는 안 됩니다.\n1. 타인의 개인정보를 무단으로 수집, 이용하는 행위\n2. 서비스를 이용하여 음란, 폭력, 혐오 등 불법적이거나 부적절한 콘텐츠를 게시하는 행위\n3. 서비스의 정상적인 운영을 방해하는 행위\n4. 자동화된 수단을 이용하여 서비스에 부하를 주는 행위\n5. 기타 관계 법령에 위반되는 행위\n\n제5조 (서비스 변경 및 중단)\n1. 서비스는 운영상, 기술상의 필요에 따라 제공하는 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.\n2. 서비스 변경 또는 중단 시 사전에 공지사항을 통해 회원에게 안내합니다. 다만, 불가피한 사유가 있는 경우 사후에 안내할 수 있습니다.\n\n제6조 (지적재산권)\n1. 서비스가 제공하는 콘텐츠(AI 추천 결과, 디자인, 소프트웨어 등)에 대한 지적재산권은 서비스에 귀속됩니다.\n2. 회원이 작성한 게시물에 대한 저작권은 해당 회원에게 귀속되며, 서비스는 서비스 운영 목적 범위 내에서 이를 이용할 수 있습니다.\n\n제7조 (면책사항)\n1. 서비스는 AI 추천 결과의 정확성을 보장하지 않으며, 추천 결과에 따른 이용자의 선택에 대해 책임을 지지 않습니다.\n2. 서비스는 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.\n3. 회원 간 또는 회원과 제3자 간의 분쟁에 대해 서비스는 개입할 의무가 없으며 이에 대한 책임을 지지 않습니다.` },
              { key: "required2", label: "(필수) 개인정보 수집 및 이용 동의", content: `제1조 (수집하는 개인정보 항목)\n서비스는 회원가입 및 서비스 제공을 위해 다음의 개인정보를 수집합니다.\n\n1. 필수 수집 항목\n  - 계정 정보: 이메일, 닉네임, 비밀번호(암호화 저장)\n  - 프로필 정보: 프로필 이미지\n\n2. 선택 수집 항목\n  - 음식 선호도: 식단 유형, 비건 여부, 매운맛 선호도, 알레르기 정보, 선호 음식 종류\n\n3. 서비스 이용 과정에서 수집되는 항목\n  - 먹방 일기: 텍스트, 이미지\n  - 투표 참여 기록 및 댓글\n  - AI 추천 대화 내역\n\n제2조 (개인정보의 수집 및 이용 목적)\n수집한 개인정보는 다음의 목적을 위해 이용됩니다.\n1. 계정 관리: 회원 식별, 로그인, 본인 확인\n2. AI 추천 개인화: 음식 선호도 및 이용 기록 기반 맞춤형 메뉴·맛집 추천\n3. 커뮤니티 운영: 투표, 게시물, 댓글 기능 제공\n4. 서비스 개선: 이용 통계 분석, 서비스 품질 향상\n\n제3조 (개인정보의 보유 및 이용 기간)\n1. 회원의 개인정보는 회원 탈퇴 시까지 보유·이용됩니다.\n2. 회원 탈퇴 시 개인정보는 즉시 파기합니다. 다만, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.\n  - 계약 또는 청약 철회에 관한 기록: 5년\n  - 소비자 불만 또는 분쟁 처리에 관한 기록: 3년\n  - 로그인 기록: 3개월\n\n제4조 (개인정보의 제3자 제공)\n서비스는 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.\n1. AI 추천 서비스 제공을 위해 Claude API(Anthropic)에 대화 내역 전송\n2. 서비스 인프라 운영을 위해 AWS 클라우드 서비스 이용\n3. 법령에 의해 요구되는 경우\n\n제5조 (이용자의 권리)\n1. 회원은 언제든지 자신의 개인정보를 열람, 수정할 수 있습니다.\n2. 회원은 개인정보의 삭제를 요청할 수 있으며, 이 경우 서비스 이용이 제한될 수 있습니다.\n3. 회원은 개인정보 수집·이용에 대한 동의를 철회할 수 있으며, 동의 철회 시 회원 탈퇴로 처리됩니다.` },
              { key: "required3", label: "(필수) 위치기반 서비스 이용약관 동의", content: `제1조 (목적)\n본 약관은 메추라기 서비스가 제공하는 위치기반 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.\n\n제2조 (위치정보 수집 목적)\n서비스는 회원의 위치정보를 다음의 목적으로 수집·이용합니다.\n1. 현재 위치 기반 주변 맛집 추천\n2. 위치 기반 음식점 검색 결과 제공\n\n제3조 (위치정보 수집 방식)\n서비스는 다음의 방식으로 위치정보를 수집합니다.\n1. GPS(위성항법장치)를 통한 위치 측정\n2. Wi-Fi, 이동통신 네트워크 기반 위치 측정\n\n제4조 (위치정보의 이용 및 보유 기간)\n1. 위치정보는 맛집 추천 서비스 제공 시 일시적으로 이용되며, 서비스 제공 목적 달성 후 즉시 파기합니다.\n2. 위치정보 이용·제공 사실 확인 자료는 위치정보의 보호 및 이용 등에 관한 법률에 따라 6개월간 보관합니다.\n\n제5조 (제3자 제공)\n서비스는 회원의 위치정보를 제3자에게 제공하지 않습니다. 다만, 회원의 사전 동의가 있거나 법령에 의해 요구되는 경우는 예외로 합니다.\n\n제6조 (이용자의 권리)\n1. 회원은 언제든지 위치정보 수집·이용에 대한 동의를 철회할 수 있습니다.\n2. 동의 철회는 서비스 내 설정 메뉴 또는 단말기의 위치 서비스 설정을 통해 가능합니다.\n3. 동의 철회 시 위치 기반 맛집 추천 기능의 이용이 제한될 수 있습니다.` },
              { key: "optional", label: "(선택) 마케팅 정보 수신 동의", content: `제1조 (수신 내용)\n메추라기 서비스는 회원에게 다음과 같은 마케팅 정보를 발송할 수 있습니다.\n1. 신규 기능 및 이벤트 안내\n2. AI 맞춤 추천 메뉴 알림\n3. 제휴 할인 및 프로모션 정보\n4. 서비스 활용 팁 및 먹방 트렌드 소식\n\n제2조 (수신 방법)\n마케팅 정보는 다음의 방법으로 발송됩니다.\n1. 이메일\n2. 앱 푸시 알림\n\n제3조 (동의 철회)\n1. 회원은 언제든지 마케팅 정보 수신에 대한 동의를 철회할 수 있습니다.\n2. 철회 방법: 서비스 내 설정 > 알림 설정 메뉴에서 수신 거부 가능\n3. 수신 거부 후에도 서비스 이용에 필요한 필수 공지사항(보안, 정책 변경 등)은 발송될 수 있습니다.` },
            ].map((item) => (
              <TermsDetails
                key={item.key}
                label={item.label}
                checked={terms[item.key as keyof typeof terms]}
                onChange={() => handleToggle(item.key)}
                content={item.content}
                expanded={expanded === item.key}
                onToggle={() => toggleExpand(item.key)}
              />
            ))}
          </div>
        </div>

        <Footer 
          type="button"
          buttonText="다음으로"
          disabled={!canProceed}
          onButtonClick={() => router.push("/signup")}
        />
      </div>
    </div>
  );
}