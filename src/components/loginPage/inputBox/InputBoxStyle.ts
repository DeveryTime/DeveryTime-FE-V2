import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

const InputBoxWrapper = styled.div`
  width: 560px;
  height: 42px;
  display: flex;
  align-items: center;
  padding: 0px;
  padding-bottom: 12px;
  border-bottom: 2px solid #6f6f6f;
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  outline: none;
  box-sizing: border-box;
  padding: 10px;
  font-size: 24px;
  color: #333;
  gap-right: 10px;

  &:focus-visible {
    outline: 2px solid ${colors.blue[400]};
    outline-offset: 2px;
    border-radius: 4px;
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
