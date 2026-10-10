import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";
import Button from "../../common/Button/Button";
import Input from "../../common/Input/Input";
import Modal from "../../common/Modal/Modal";

const S = {
  DetailDialog: styled(Modal)`
    width: 875px;
    height: calc(100vh - 48px);
    max-height: 1028px;

    margin: auto;
    padding: 0;
    border: none;
    background-color: ${colors.gray[0]};

    position: relative;
    overflow: hidden;

    &::backdrop {
      background-color: ${colors.alpha.black45};
    }
    &[open] {
      display: grid;
      grid-template-rows: minmax(0, 1fr) auto;
    }
  `,

  ModalScrollArea: styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;

    display: flex;
    flex-direction: column;
  `,

  PostHeader: styled.header`
    display: flex;
    align-items: center;
    gap: 15px;
  `,

  ProfileImage: styled.img`
    width: 60px;
    height: 60px;

    border-radius: 50%;
    object-fit: cover;
  `,

  PostTitle: styled.h2`
    margin-top: 35px;
    font-size: 32px;
    font-weight: 700;
    word-break: break-word;
  `,

  PostContent: styled.div`
    margin-top: 40px;
    line-height: 1.6;
    overflow-wrap: anywhere;

    & > :first-child {
      margin-top: 0;
    }

    & > :last-child {
      margin-bottom: 0;
    }

    p {
      margin: 16px 0;
      white-space: pre-wrap;
    }

    h1,
    h2,
    h3,
    h4 {
      margin: 24px 0 12px;
      line-height: 1.35;
    }

    ul,
    ol {
      margin: 16px 0;
      padding-left: 24px;
    }

    li + li {
      margin-top: 4px;
    }

    blockquote {
      margin: 16px 0;
      padding-left: 16px;
      border-left: 4px solid ${colors.gray[400]};
      color: ${colors.gray[700]};
    }

    pre {
      margin: 16px 0;
      padding: 16px;
      overflow-x: auto;
      border-radius: 8px;
      background-color: ${colors.gray[100]};
    }

    code {
      padding: 2px 4px;
      border-radius: 4px;
      background-color: ${colors.gray[100]};
      font-family: monospace;
    }

    pre code {
      padding: 0;
      background-color: transparent;
    }

    a {
      color: ${colors.primary[500]};
      text-decoration: underline;
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 16px 0;
      border-radius: 8px;
    }
  `,

  ContentImage: styled.img`
    display: block;
    max-width: 100%;
    height: auto;
  `,

  DetailContent: styled.div`
    padding: 40px;
  `,

  WriterInfo: styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  WriterName: styled.strong`
    font-weight: 600;
  `,

  PostMeta: styled.span`
    color: ${colors.gray[600]};
    font-size: 14px;
  `,

  DefaultProfileImage: styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: ${colors.gray[100]};

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,

  ImageList: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 24px;
  `,

  CategoryLabel: styled.span`
    display: inline-block;
    position: absolute;
    top: 50px;
    left: 740px;
    font-size: 14px;
    background-color: ${colors.gray[50]};
    color: ${colors.gray[700]};
    border-radius: 10px;
    padding: 10px 16px;
  `,

  ReactionBar: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 13px;
    border-top: 10px solid ${colors.gray[200]};
    margin-top: auto;
    padding-top: 9px;
    padding-left: 8px;
    padding-bottom: 8px;
  `,

  LikeCount: styled.span`
    font-size: 20px;
    font-weight: 500;
    padding-top: 3px;
  `,

  LikeButton: styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  CommentInfo: styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 13px;
    padding-top: 4px;
  `,

  CommentImage: styled.img`
    padding-bottom: 2px;
    padding-right: 2px;
  `,

  CommentCount: styled.span`
    display: inline-block;
    font-size: 20px;
    font-weight: 500;
    padding-bottom: 5px;
  `,

  CommentList: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-top: 1px solid ${colors.gray[200]};
  `,

  CommentItem: styled.article`
    padding: 10px;
    border-bottom: 1px solid ${colors.gray[200]};
    flex-direction: column;
    display: flex;
    gap: 4px;
  `,

  CommentHeader: styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
  `,

  CommentProfile: styled.img`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: ${colors.gray[100]};

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,

  CommentAuthor: styled.div`
    display: flex;
    align-items: center;
    gap: 13px;
    font-size: 16px;
    font-weight: 700;
  `,

  CommentBody: styled.p`
    padding-top: 7px;
    padding-left: 13px;
    font-size: 18px;
  `,

  CommentDateCreatedAt: styled.p`
    font-size: 18px;
    color: ${colors.gray[500]};
    font-weight: 500;
  `,

  CommentDefaultProfileImage: styled.div`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: ${colors.gray[100]};

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,

  PostMenuButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
  `,

  KebabIcon: styled.img`
    width: 16px;
    height: 16px;
    display: block;
  `,

  ReportPopoverLink: styled.a`
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 12px 16px;

    color: ${colors.gray[950]};
    text-align: left;
    white-space: nowrap;
    border-radius: 6px;

    &:hover {
      color: ${colors.red[600]};
      background-color: ${colors.red[50]};
    }
  `,

  CommentMenuArea: styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
  `,

  CommentButton: styled.button`
    display: flex;
    align-items: center;
    padding-top: 2px;
    background-color: transparent;
    border: none;
    cursor: pointer;
  `,

  CommentMenuPopover: styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 20;

    display: flex;
    flex-direction: column;

    width: 209px;
    padding: 6px;

    background-color: ${colors.gray[0]};
    border: 1px solid ${colors.gray[200]};
    border-radius: 10px;
    box-shadow: 0 4px 12px ${colors.alpha.black12};
  `,

  CommentMenuPopoverLink: styled.a`
    display: block;
    width: 100%;
    padding: 12px 16px;

    color: ${colors.gray[950]};
    text-align: left;
    white-space: nowrap;
    border-radius: 6px;

    &:hover {
      color: ${colors.red[600]};
      background-color: ${colors.red[50]};
    }
  `,

  CommentDeleteButton: styled.button`
    width: 100%;
    padding: 12px 16px;

    border: none;
    border-radius: 6px;
    background-color: transparent;

    color: ${colors.gray[950]};
    font: inherit;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      color: ${colors.red[600]};
      background-color: ${colors.red[50]};
    }
  `,

  CommentEditButton: styled.button`
    width: 100%;
    padding: 12px 16px;

    border: none;
    border-radius: 6px;
    background-color: transparent;

    color: ${colors.gray[950]};
    font: inherit;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      background-color: ${colors.blue[50]};
      color: ${colors.blue[600]};
    }
  `,

  PostMenuPopover: styled.div`
    position: absolute;
    z-index: 20;
    display: flex;
    flex-direction: column;
    width: 200px;
    padding: 6px;
    background-color: ${colors.gray[0]};
    border: 1px solid ${colors.gray[200]};
    border-radius: 10px;
    box-shadow: 0px 4px 12px ${colors.alpha.black12};
    top: calc(100% + 8px);
    right: 5px;
  `,

  PostMenuArea: styled.div`
    position: relative;
    margin-left: auto;

    display: flex;
    align-items: center;
  `,

  PostEditForm: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 35px;
  `,

  PostEditTitleInput: styled(Input)`
    font-size: 24px;
    padding: 10px;
    font-weight: 600;
  `,

  PostEditContentTextarea: styled.textarea`
    width: 100%;
    min-height: 180px;
    box-sizing: border-box;
    padding: 12px;
    font-size: 16px;
    line-height: 1.6;
    font-family: inherit;
    border: 1px solid ${colors.gray[200]};
    border-radius: 8px;
    background-color: ${colors.gray[0]};
    outline: none;
    &:focus {
      border: 1px solid ${colors.primary[500]};
    }
    resize: vertical;
  `,

  PostEditActions: styled.div`
    display: flex;
    gap: 8px;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    margin-top: 4px;
  `,

  PostEditCancelButton: styled(Button)`
    padding: 8px 14px;
    &:hover {
      background-color: ${colors.gray[50]};
    }
  `,

  PostEditSaveButton: styled(Button)`
    padding: 8px 14px;
  `,
};

export default S;
