import styled from "@emotion/styled";

const InputBoxWrapper = styled.div`
  width: min(564px, 100%);
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0;
  border-bottom: 2px solid #6f6f6f;
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  height: 64px;
  border: none;
  outline: none;
  box-sizing: border-box;
  padding: 0;
  font-size: 24px;
  color: #333;
  font-family: Pretendard, sans-serif;

  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }

  &::placeholder {
    color: #6f6f6f;
    opacity: 1;
  }
`;
const S = {
  InputBoxWrapper,
  Input,
};

export default S;
