export const sendMailBody = (code: string) => {
  return `
    <div style="
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-family: 'Apple SD Gothic Neo', 'Segoe UI', sans-serif;
      background-color: #fff;
    ">
      <h2 style="
        font-size: 20px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 12px;
        margin-bottom: 24px;
      ">
        메일 인증 코드
      </h2>

      <p style="
        font-size: 15px;
        line-height: 1.6;
        color: #333;
        margin: 0 0 16px;
      ">
        본 메일은 회원가입 또는 비밀번호 재설정 요청에 따라 발송되었습니다.<br />
        아래의 인증 코드를 입력해 주세요.
      </p>

      <div style="
        margin: 24px 0;
        padding: 20px;
        background-color: #f6f6f6;
        border-radius: 8px;
        text-align: center;
      ">
        <span style="
          font-size: 28px;
          font-weight: bold;
          color: #1C69FF;
          letter-spacing: 6px;
        ">
          ${code}
        </span>
        <p style="
          font-size: 13px;
          color: #555;
          margin-top: 12px;
        ">
          인증 코드는 <strong>${getExpiredTime()}</strong> 까지 유효합니다.
        </p>
      </div>

      <p style="
        font-size: 12px;
        color: #888;
      ">
        인증 요청을 하지 않으셨다면 이 메일을 무시하셔도 됩니다.
      </p>
    </div>
  `;
};

const getExpiredTime = () => {
  const now = new Date();
  const expire = new Date(now.getTime() + 1000 * 60 * 10);

  const yyyy = expire.getFullYear();
  const MM = String(expire.getMonth() + 1).padStart(2, '0');
  const dd = String(expire.getDate()).padStart(2, '0');
  const hh = String(expire.getHours()).padStart(2, '0');
  const mm = String(expire.getMinutes()).padStart(2, '0');
  const ss = String(expire.getSeconds()).padStart(2, '0');

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
};
