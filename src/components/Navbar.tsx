import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import S from "./Navbar.style";
import logoIcon from "../assets/logoIcon.svg";
import profile from "../assets/profile.svg";
import searchIcon from "../assets/searchIcon.svg";

const NavBar = () => {
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const CATEGORIES = [
    { id: 1, name: "전공" },
    { id: 2, name: "일상" },
    { id: 3, name: "교과" },
    { id: 4, name: "급식" },
    { id: 5, name: "프로젝트" },
    { id: 6, name: "기숙사" },
    { id: 7, name: "분실물" },
  ];

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
    setSearchValue("");
  };

  return (
    <S.Nav>
      <S.NavGap>
        <S.Logo to="/main">
          <img src={logoIcon} alt="Devery time 로고" />
          <S.LogoName>Devery time</S.LogoName>
        </S.Logo>

        <S.Search>
          <S.SearchInput
            type="text"
            placeholder="키워드로 게시글을 검색해보세요"
            aria-label="게시글 검색"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <S.SearchIcon type="button" aria-label="검색" onClick={handleSearch}>
            <img src={searchIcon} alt="" />
          </S.SearchIcon>
        </S.Search>
      </S.NavGap>

      <S.NavCatalog>
        <S.Category>
          {CATEGORIES.map((category) => (
            <Link key={category.id} to={`/category/${category.id}`}>
              {category.name}
            </Link>
          ))}
        </S.Category>

        <div>
          {isLoggedIn ? (
            <S.ProfileImage src={profile} alt="프로필" />
          ) : (
            <S.Login to="/login">로그인</S.Login>
          )}
        </div>
      </S.NavCatalog>
    </S.Nav>
  );
};

export default NavBar;
