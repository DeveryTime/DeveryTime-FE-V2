import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const S = {
  Nav: styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 28px;
    box-sizing: border-box;
    background-color: #b0c5fd;
    border: none;
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
    gap: 58px;
    display: flex;
  `,
  Logo: styled(Link)`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    cursor: pointer;
    text-decoration: none;

    img {
      height: 40px;
    }
  `,

  LogoName: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #fff;
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

  SearchIcon: styled.button`
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: 8px;
    flex-shrink: 0;
    border: none;
    background: none;
    padding: 0;
  `,

  Category: styled.div`
    display: flex;
    align-items: center;
    gap: 27px;
    padding: 0 0 0 58px;
    color: #fff;
    font-weight: 700;
    flex-shrink: 0;
    white-space: nowrap;

    & > a {
      color: inherit;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        color: #000;
      }
    }
  `,

  Login: styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px 17px 7px 17px;
    color: black;
    font-weight: 500;
    border: none;
    background-color: #fff;
    border-radius: 14px;
    cursor: pointer;
    flex-shrink: 0;
    text-decoration: none;
  `,

  ProfileImage: styled.img`
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  `,
};

export default S;
