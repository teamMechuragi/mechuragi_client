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
              { key: "required1", label: "(필수) 이용약관 동의", content: "이용약관 상세 내용 1" },
              { key: "required2", label: "(필수) 개인정보 수집 및 이용 동의", content: "이용약관 상세 내용 2" },
              { key: "required3", label: "(필수) 위치기반 서비스 이용약관 동의", content: "이용약관 상세 내용 3" },
              { key: "optional", label: "(선택) 마케팅 정보 수신 동의", content: "이용약관 상세 내용 (선택)" },
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