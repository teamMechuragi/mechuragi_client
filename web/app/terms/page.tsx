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
    if (storedTerms) {
      setTerms(JSON.parse(storedTerms));
    }
  }, []);

  const handleToggle = (name: string) => {
    if (name === "all") {
      const newState = !terms.all;
      const updatedTerms = {
        all: newState,
        required1: newState,
        required2: newState,
        required3: newState,
        optional: newState,
      };
      setTerms(updatedTerms);
      localStorage.setItem("termsAgreement", JSON.stringify(updatedTerms));
    } else {
      const updatedTerms = { ...terms, [name]: !terms[name as keyof typeof terms] };
      setTerms(updatedTerms);
      localStorage.setItem("termsAgreement", JSON.stringify(updatedTerms));
    }
  };

  const toggleExpand = (key: string) => {
    setExpanded(expanded === key ? null : key);
  };

  const isAllChecked = terms.required1 && terms.required2 && terms.required3 && terms.optional;
  const canProceed = terms.required1 && terms.required2 && terms.required3;

  return (
    <div className="flex flex-col items-center justify-between min-h-screen px-4 pt-4 pb-50 bg-white-100">
      <div className="w-full max-w-sm">
        
        {/* 헤더 */}
        <Header title="이용약관" backLink="/login" />

        {/* 제목 */}
        <h3 className="text-[26px] font-bold mb-2">서비스 이용 약관에 <br></br> 동의해 주세요.</h3> <br></br>
        
        {/* 전체 동의 */}
        <div className="flex items-center mb-4 border-b border-gray-200 pb-3">
          <TermsCheckbox 
            label="전체 동의"
            checked={isAllChecked}
            onChange={() => handleToggle("all")}
          />
        </div>

        {/* 개별 약관 동의 */}
        {[
          { key: "required1", label: "(필수) 이용약관 동의", content: "이용약관 상세 내용 1" },
          { key: "required2", label: "(필수) 이용약관 동의", content: "이용약관 상세 내용 2" },
          { key: "required3", label: "(필수) 이용약관 동의", content: "이용약관 상세 내용 3" },
          { key: "optional", label: "(선택) 이용약관 동의", content: "이용약관 상세 내용 (선택)" },
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
      
      {/* 푸터 (회원가입 페이지로 이동) */}
      <Footer type="button" buttonText="다음" onButtonClick={() => router.push("/signup")} />
    </div>
  );
}
