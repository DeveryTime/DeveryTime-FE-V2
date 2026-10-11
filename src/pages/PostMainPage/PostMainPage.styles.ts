import styled from "@emotion/styled";

const S = {
  PageContainer: styled.main`
    display: grid;
    grid-template-columns: 130px minmax(0, 1fr);
    column-gap: 56px;
    align-items: start;

    width: min(1479px, calc(100% - 32px));
    margin: 108px auto 0;

    @media (max-width: 900px) {
      grid-template-columns: minmax(0, 1fr);
      row-gap: 24px;
    }
  `,

  SortMenuArea: styled.aside`
    margin-top: 78px;

    @media (max-width: 900px) {
      margin-top: 0;
    }
  `,

  Content: styled.section`
    width: 100%;
    min-width: 0;
  `,

  Title: styled.h1`
    margin: 0 0 16px;
    font-size: 48px;
    font-weight: 600;
    line-height: 1.3;
  `,
};

export default S;
