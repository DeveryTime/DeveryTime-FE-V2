import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const m ="@media (max-width: 768px)";

const S = {
  Nav: styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 28px;
    box-sizing: border-box;
    background-color: #b0c5fd;
    border: none;
    box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.1);
    width: 100%;

      ${m} {
          padding: 12px 16px;
          gap: 12px;
      }
  `,

  NavGap: styled.div`
    display: flex;
    align-items: center;
    gap: 36px;
    flex: 1;
    min-width: 0;
      
      ${m} {
          flex-wrap: wrap;
          gap: 12px 16px;
      }
  `,

  NavCatalog: styled.div`
    gap: 28px;
    display: flex;

      ${m} {
          gap: 12px;
      }
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
        
        ${m} {
            height: 32px;
        }
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
      ${m} {
          font-size: 17px;
      }
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
      ${m} {
          order: 99;
          flex: 1 1 100%;
          max-width: none;
          min-width: 0;
          height: 38px;
      }
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
      
      ${m} {
          font-size: 16px;
      }
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
          &.active {
              color: #111;
          }
      }

      ${m} {
          gap: 14px;
          font-size: 14px;
          flex-shrink: 1;
          min-width: 0;
          overflow-x: auto;
          scrollbar-width: none;
          &::-webkit-scrollbar {
              display: none;
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

      ${m} {
          padding: 6px 12px;
          font-size: 14px;
          border-radius: 12px;
      }
  `,

  ProfileImage: styled.img`
   width: 45px;
  height: 45px;
  display: block;
  flex-shrink: 0;
      object-fit: cover;
      border-radius: 50%;
      cursor: pointer;
      
      ${m} {
          width: 36px;
          height: 36px;
      }
  `
};

export default S;
