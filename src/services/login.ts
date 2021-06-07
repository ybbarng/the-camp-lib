import { Cookie } from '../models';
import {
  addLog,
  buildRequestUrl,
  extractCookies,
  request,
  RequestOption,
} from '../utils';

/**
 * 더 캠프에 로그인해 세션 쿠키를 얻는다.
 * @param id - 계정 아이디
 * @param password - 계정 비밀번호
 */
async function login(id: string, password: string) {
  const options: RequestOption = {
    url: buildRequestUrl('login/loginA.do'),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      state: 'email-login',
      autoLoginYn: 'N',
      userId: id,
      userPwd: password,
    },
  };
  let result: Cookie | null = null;

  const response = await request(options);
  addLog('login', `${response.status} ${response.statusText}`);
  const body = await response.data;

  if (response.status === 200 && body.resultCd !== '0000') {
    throw new Error(body.resultMsg || '알 수 없는 에러.');
  }

  if (!response.headers['set-cookie']) {
    throw new Error('쿠키를 찾을 수 없습니다.');
  }

  result = extractCookies(response.headers['set-cookie']);

  if (!response || !result) {
    throw new Error('응답 값이 없습니다.');
  }

  return result;
}

export { login };
