// 일반 유니코드는 유지하고, 화면을 무너뜨리는 과도한 결합 문자만 제거한다.
export const normalizeDisplayText = (content: string) => {
  const normalizedContent = content.normalize("NFC");
  const combiningMarks = [...normalizedContent.matchAll(/\p{M}/gu)];
  const hasExcessiveCombiningMarks =
    combiningMarks.length > 3 || /\p{M}{4,}/u.test(normalizedContent);

  return hasExcessiveCombiningMarks
    ? normalizedContent.replace(/\p{M}/gu, "")
    : normalizedContent;
};
