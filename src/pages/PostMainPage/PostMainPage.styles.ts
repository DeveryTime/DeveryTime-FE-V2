import styled from "@emotion/styled";

const S = {
  PageContainer: styled.main`
    display: grid;
    grid-template-columns: 130px minmax(0, 1fr);
    column-gap: 56px;
    align-items: start;

    @media (max-width: 900px) {
      grid-template-columns: minmax(0, 1fr);
      row-gap: 24px;
    }

    width: min(1479px, calc(100% - 48px));
    margin: 108px auto 0;
  `,

  SortMenuArea: styled.aside`
    margin-top: 78px;

    @media (max-width: 900px) {
      margin-top: 0;
    }
  `,

  Content: styled.section`
    min-width: 0;
  `,

  ContentHeader: styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  `,

  Title: styled.h1`
    margin: 0 0 16px;
    font-size: 48px;
    font-weight: 600;
    line-height: 1.3;
  `,

  WriteButton: styled.button`
    flex: 0 0 auto;
    padding: 10px 18px;
    border: 0;
    border-radius: 20px;
    background: #3769ed;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background: #2f5edc;
    }

    &:focus-visible {
      outline: 2px solid #244fc1;
      outline-offset: 3px;
    }
  `,
};

export default S;
