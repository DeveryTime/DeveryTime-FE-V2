import { isAxiosError } from "axios";

interface ApiErrorDefinition {
  status: number;
  message: string;
}

// 공통 에러 메시지
const GLOBAL_ERROR_MESSAGES: Record<string, ApiErrorDefinition> = {
  UNAUTHORIZED: {
    status: 401,
    message: "로그인이 필요한 API에 접근했습니다.",
  },
  FORBIDDEN: {
    status: 403,
    message: "인증은 되었지만 요청을 수행할 권한이 없습니다.",
  },
  USER_NOT_FOUND: {
    status: 404,
    message: "사용자를 찾을 수 없습니다.",
  },
  PROFILE_NOT_FOUND: {
    status: 404,
    message: "프로필을 찾을 수 없습니다.",
  },
  USERNAME_CHANGE_LIMIT_EXCEEDED: {
    status: 429,
    message: "아이디 변경 가능 횟수를 초과했습니다.",
  },
  INVALID_IMAGE_TYPE: {
    status: 400,
    message: "지원하지 않는 이미지 형식입니다.",
  },
  TOO_MANY_REQUESTS: {
    status: 429,
    message: "일정 시간 동안 허용된 요청 횟수를 초과했습니다.",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "서버 내부 오류가 발생했습니다.",
  },
  SERVICE_UNAVAILABLE: {
    status: 503,
    message: "서버 점검 또는 외부 서비스 장애로 서비스를 이용할 수 없습니다.",
  },
};

// 게시글 에러 메시지
const POST_ERROR_MESSAGES: Record<string, ApiErrorDefinition> = {
  VALIDATION_ERROR: {
    status: 400,
    message: "게시글 입력값을 확인해주세요.",
  },
  POST_ACCESS_DENIED: {
    status: 403,
    message: "게시글에 접근할 권한이 없습니다.",
  },
  POST_NOT_FOUND: {
    status: 404,
    message: "게시글을 찾을 수 없습니다.",
  },
  CATEGORY_NOT_FOUND: {
    status: 404,
    message: "카테고리를 찾을 수 없습니다.",
  },
};

// 댓글 에러 메시지
const COMMENT_ERROR_MESSAGES: Record<string, ApiErrorDefinition> = {
  COMMENT_ACCESS_DENIED: {
    status: 403,
    message: "본인이 작성하지 않은 댓글을 수정하거나 삭제할 수 없습니다.",
  },
  COMMENT_NOT_FOUND: {
    status: 404,
    message: "존재하지 않거나 이미 삭제된 댓글입니다.",
  },
};

// 좋아요 에러 메시지
const LIKE_ERROR_MESSAGES: Record<string, ApiErrorDefinition> = {
  NOT_LIKED: {
    status: 404,
    message: "좋아요를 누르지 않은 상태에서 좋아요 취소 요청을 보냈습니다.",
  },
  ALREADY_LIKED: {
    status: 409,
    message: "이미 좋아요를 누른 게시글에 다시 좋아요 요청을 보냈습니다.",
  },
};

// 전체 에러 메시지를 하나로 합친다.
const API_ERROR_MESSAGES: Record<string, ApiErrorDefinition> = {
  ...GLOBAL_ERROR_MESSAGES,
  ...POST_ERROR_MESSAGES,
  ...COMMENT_ERROR_MESSAGES,
  ...LIKE_ERROR_MESSAGES,
};

// 에러 코드가 없을 때 사용하는 상태 코드별 메시지
const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: "요청값을 확인해주세요.",
  401: "로그인이 필요합니다.",
  403: "요청을 수행할 권한이 없습니다.",
  404: "요청한 대상을 찾을 수 없습니다.",
  429: "잠시 후 다시 시도해주세요.",
  500: "서버 내부 오류가 발생했습니다.",
  503: "현재 서버를 이용할 수 없습니다.",
};

interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
  errorCode?: string;
  message?: string;
}
// 서버 에러를 화면용 메시지로 변환한다.
const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (!isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  const errorResponse = error.response?.data;
  const errorCode = errorResponse?.error?.code ?? errorResponse?.errorCode;
  const codeError = errorCode ? API_ERROR_MESSAGES[errorCode] : undefined;

  if (codeError) {
    return codeError.message;
  }

  const status = error.response?.status;
  const statusMessage = status ? HTTP_STATUS_MESSAGES[status] : undefined;

  return (
    errorResponse?.error?.message ??
    errorResponse?.message ??
    statusMessage ??
    fallbackMessage
  );
};

export default getApiErrorMessage;
