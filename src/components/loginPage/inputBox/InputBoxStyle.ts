import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

export const InputBoxWrapper = styled.div`
  width: min(560px, 100%);
  height: 42px;
  display: flex;
  align-items: center;
  padding: 0px;
  padding-bottom: 12px;
  border-bottom: 2px solid #6f6f6f;
  box-sizing: border-box;
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  outline: none;
  box-sizing: border-box;
  padding: 0;
  font-size: 24px;
  color: #333;

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
