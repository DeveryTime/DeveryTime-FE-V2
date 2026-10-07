import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { colors } from "../styles/tokens/colors";

const S = {
  Nav: styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 28px;
    box-sizing: border-box;
    background-color: ${colors.blue[100]};
    box-shadow: 0px 1px 4px -1px rgba(0, 0, 0, 0.1);
    width: 100%;
  `,

  NavGap: styled.div`
    display: flex;
    align-items: center;
    gap: 36px;
    flex: 1;
    min-width: 0;
  `,

  NavCatalog: styled.div`
    display: flex;
    align-items: center;
    gap: 58px;
  `,

  Logo: styled(Link)`
    display: flex;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
    cursor: pointer;
    text-decoration: none;
  `,

  LogoName: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: ${colors.blue[900]};
    font-weight: 700;
    flex-shrink: 0;
    white-space: nowrap;
  `,

  Search: styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 600px;
    min-width: 200px;
    height: 42px;
    background-color: #fff;
    border-radius: 100px;
    padding: 0 16px;
    box-sizing: border-box;
    flex: 1;
  `,

  SearchInput: styled.input`
    flex: 1;
    width: 100%;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    padding: 0;
    margin: 0;
  `,

  SearchIcon: styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: 8px;
    flex-shrink: 0;
  `,

  ProfileImage: styled.img`
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    background-color: #fff;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    display: block;
  `,

  Category: styled.div`
    display: flex;
    align-items: center;
    gap: 27px;
    padding: 0 0 0 58px;
    color: ${colors.blue[900]};
    font-weight: 700;
    flex-shrink: 0;
    white-space: nowrap;

    & > a {
      color: inherit;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        color: ${colors.blue[700]};
      }
    }
  `,

  Login: styled.button`
    align-items: center;
    justify-content: center;
    padding: 9px 23px 10px 22px;
    color: ${colors.blue[900]};
    font-weight: 500;
    border: none;
    background-color: #fff;
    border-radius: 16px;
    cursor: pointer;
    flex-shrink: 0;
  `,
};

export default S;
