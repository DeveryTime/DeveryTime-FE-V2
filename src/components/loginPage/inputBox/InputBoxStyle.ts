import styled from "@emotion/styled";

export const InputBoxWrapper = styled.div`
  width: 560px;
  height: 42px;
  display: flex;
  align-items: center;
  padding: 0px;
  padding-bottom: 12px;
  border-bottom: 2px solid #6f6f6f;
  box-sizing: border-box;
  /* position: relative;
  top: -30px; */
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  outline: none;
  padding: 0;
  font-size: 24px;
  color: #333;

  &::placeholder {
    color: #6f6f6f;
    opacity: 1;
  }
`;
