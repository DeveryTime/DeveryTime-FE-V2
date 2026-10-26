import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import S from "./Navbar.style";
import logoIcon from "../assets/logoIcon.svg";
import profile from "../assets/profile.svg";
import searchIcon from "../assets/searchIcon.svg";

const NavBar = () => {
  // 검색어 입력값 관리
  const [searchValue, setSearchValue] = useState("");

  // 페이지 이동을 위한 navigate
  const navigate = useNavigate();

  // localStorage에 token이 있으면 로그인 상태로 판단
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // 카테고리 목록
  const CATEGORIES = [
    { id: 1, name: "전공" },
    { id: 2, name: "일상" },
    { id: 3, name: "교과" },
    { id: 4, name: "급식" },
    { id: 5, name: "프로젝트" },
    { id: 6, name: "기숙사" },
    { id: 7, name: "분실물" },
  ];

  // 검색 실행
  const handleSearch = () => {
    // 검색어가 비어 있으면 검색하지 않음
    if (!searchValue.trim()) return;

    // 검색어를 URL Query Parameter로 전달
    navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);

    // 검색 후 입력창 초기화
    setSearchValue("");
  };

  return (
    <S.Nav>
      <S.NavGap>
        {/* 로고 클릭 시 메인 페이지로 이동 */}
        <S.Logo to="/main">
          <img src={logoIcon} alt="Devery time 로고" />
          <S.LogoName>Devery time</S.LogoName>
        </S.Logo>

        {/* 게시글 검색 영역 */}
        <S.Search>
          <S.SearchInput
            type="text"
            placeholder="키워드로 게시글을 검색해보세요"
            aria-label="게시글 검색"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              // Enter 키를 누르면 검색 실행
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          {/* 검색 아이콘 클릭 시 검색 실행 */}
          <S.SearchIcon type="button" aria-label="검색" onClick={handleSearch}>
            <img src={searchIcon} alt="" />
          </S.SearchIcon>
        </S.Search>
      </S.NavGap>

      <S.NavCatalog>
        {/* 카테고리 메뉴 */}
        <S.Category>
          {CATEGORIES.map((category) => (
            <Link key={category.id} to={`/category/${category.id}`}>
              {category.name}
            </Link>
          ))}
        </S.Category>

        <div>
          {/* 로그인 상태에 따라 프로필 이미지 또는 로그인 버튼 표시 */}
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
