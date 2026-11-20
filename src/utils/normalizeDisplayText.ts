// 일반 유니코드는 유지하고, 화면을 무너뜨리는 과도한 결합 문자만 제거한다.
export const normalizeDisplayText = (content: string) => {
  const normalizedContent = content.normalize("NFC");
  const combiningMarks = [...normalizedContent.matchAll(/\p{M}/gu)];
  const hasExcessiveCombiningMarks =
    combiningMarks.length > 3 || /\p{M}{4,}/u.test(normalizedContent);

  if (!hasExcessiveCombiningMarks) {
    return normalizedContent;
  }

  // 결합 문자를 제거한 뒤 남는 Zalgo 기본 문자 반복도 한 글자로 축약한다.
  return normalizedContent
    .replace(/\p{M}/gu, "")
    .replace(/(.)\1{2,}/gu, "$1");
};
