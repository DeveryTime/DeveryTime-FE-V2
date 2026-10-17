import styled from "@emotion/styled";

const S = {
  PageContainer: styled.main`
    display: grid;
    grid-template-columns: 130px 1293px;
    column-gap: 56px;
    align-items: start;

    width: 1479px;
    margin: 108px auto 0;
  `,

  SortMenuArea: styled.aside`
    margin-top: 78px;
  `,

  Content: styled.section`
    width: 1293px;
  `,

  Title: styled.h1`
    margin: 0 0 16px;
    font-size: 48px;
    font-weight: 600;
    line-height: 1.3;
  `,
};

export default S;
