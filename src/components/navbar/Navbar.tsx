import {useEffect, useState} from "react";
import { useNavigate, Link } from "react-router-dom";

import S from "./Navbar.style";
import logoIcon from "../../assets/logoIcon.svg";
import profile from "../../assets/profile.svg";
import searchIcon from "../../assets/searchIcon.svg";
import profileApi from "../../api/profile/profile.api.ts";

import { CATEGORIES } from "../../constants/categories";
import toast from "react-hot-toast";


const NavBar = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  // localStorage에 token이 있으면 로그인 상태로 판단
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  useEffect(() => {
    if(!isLoggedIn)return;
    const fetchProfile =  () => {
      profileApi
        .getMyProfile()
        .then((data)  => setProfileImage(data.profileImageUrl) )
        .catch((e) => console.error(e));
    };
    fetchProfile();
    window.addEventListener("profile-updated", fetchProfile);
    return () => window.removeEventListener("profile-updated", fetchProfile);

  },[isLoggedIn]);

  // 검색 실행
  const handleSearch = () => {
    const keyword = searchValue.trim();

    if (!keyword) return;

    navigate(`/searchPage?keyword=${encodeURIComponent(keyword)}`);
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
            <Link
              key={category.id}
              to={`/Categorypage?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`}
              onClick={(e) =>{
                if (!isLoggedIn) {
                  e. preventDefault();
                  toast.error("로그인이 필요합니다.")
                  navigate("/login");
                }}}
            >
              {category.name}
            </Link>
          ))}
        </S.Category>

        {/* 로그인 상태에 따라 프로필 또는 로그인 버튼 표시 */}
        <div>
          {isLoggedIn ? (
            <Link to="/info"><S.ProfileImage src={profileImage || profile} alt="프로필" /></Link>
          ) : (
            <S.Login to="/login">로그인</S.Login>
          )}
        </div>
      </S.NavCatalog>
    </S.Nav>
  );
};

export default NavBar;
