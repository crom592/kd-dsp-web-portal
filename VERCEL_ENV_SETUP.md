# Vercel 환경 변수 설정 가이드

웹 포털이 Railway 백엔드 API와 통신하도록 Vercel 환경 변수를 설정하는 방법입니다.

## 🚨 현재 문제

웹 포털이 잘못된 URL로 API 요청을 보내고 있습니다:
```
❌ https://kd-dsp-web-portal.vercel.app/kd-dsp-backend-production.up.railway.app/api/auth/login
```

올바른 URL:
```
✅ https://kd-dsp-backend-production.up.railway.app/api/auth/login
```

---

## 🔧 해결 방법: Vercel 환경 변수 설정

### 1. Railway 백엔드 URL 확인

1. **Railway 대시보드** 접속
   - https://railway.app
   - 백엔드 프로젝트 선택

2. **Settings → Domains** 탭에서 배포 URL 확인
   - 예: `https://kd-dsp-backend-production.up.railway.app`
   - 또는 커스텀 도메인이 있다면 해당 URL

### 2. Vercel 환경 변수 설정

1. **Vercel 대시보드** 접속
   - https://vercel.com
   - `kd-dsp-web-portal` 프로젝트 선택

2. **Settings → Environment Variables** 클릭

3. 다음 환경 변수 추가:

#### Production 환경
```bash
# 변수 이름: VITE_API_BASE_URL
# 값: https://kd-dsp-backend-production.up.railway.app
# 환경: Production

# 변수 이름: VITE_WS_URL
# 값: wss://kd-dsp-backend-production.up.railway.app
# 환경: Production

# 변수 이름: VITE_GOOGLE_MAPS_API_KEY
# 값: AIzaSyCQBeec4tZ-AOBAoSaYNT0xaUbNJtiTiW0
# 환경: Production
```

#### Preview 환경 (선택)
```bash
# 변수 이름: VITE_API_BASE_URL
# 값: https://kd-dsp-backend-production.up.railway.app
# 환경: Preview

# 변수 이름: VITE_WS_URL
# 값: wss://kd-dsp-backend-production.up.railway.app
# 환경: Preview

# 변수 이름: VITE_GOOGLE_MAPS_API_KEY
# 값: AIzaSyCQBeec4tZ-AOBAoSaYNT0xaUbNJtiTiW0
# 환경: Preview
```

### 3. 재배포

환경 변수 설정 후 재배포:

**방법 1: Vercel 대시보드에서**
- Deployments → 최신 배포 → "Redeploy" 클릭

**방법 2: Git Push로 자동 배포**
```bash
cd kd-dsp-web-portal
git commit --allow-empty -m "chore: Trigger Vercel redeploy with new env vars"
git push
```

---

## ✅ 확인 방법

재배포 후 브라우저 개발자 도구(F12)에서 Network 탭 확인:

**성공 시**:
```
✅ POST https://kd-dsp-backend-production.up.railway.app/api/auth/login
Status: 200 OK (또는 401 Unauthorized - 정상, 인증 필요)
```

**실패 시**:
```
❌ POST https://kd-dsp-web-portal.vercel.app/...
Status: 404 Not Found
```

---

## 📋 전체 환경 변수 목록

### Vercel (웹 포털)
```bash
VITE_API_BASE_URL=https://kd-dsp-backend-production.up.railway.app
VITE_WS_URL=wss://kd-dsp-backend-production.up.railway.app
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCQBeec4tZ-AOBAoSaYNT0xaUbNJtiTiW0
VITE_ENV=production
```

### Railway (백엔드)
```bash
NODE_ENV=production
PORT=3000
API_PREFIX=api
DATABASE_URL=(PostgreSQL 플러그인이 자동 생성)
JWT_SECRET=b27ece029db65d2d5c9cea033687c4869bfef76b2a7dbb3d7a412d05001f5d4e
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=bdd13c8da14418033596aebfd9a7fa5b81e123780eef3e8196a4a7f3d9c10fa6
JWT_REFRESH_EXPIRES_IN=30d
GOOGLE_MAPS_API_KEY=AIzaSyCQBeec4tZ-AOBAoSaYNT0xaUbNJtiTiW0
CORS_ORIGIN=https://kd-dsp-web-portal.vercel.app
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

---

## 🔒 CORS 설정 확인

Railway 백엔드의 `CORS_ORIGIN` 환경 변수가 웹 포털 도메인을 포함하는지 확인:

```bash
# Railway Variables에서 설정
CORS_ORIGIN=https://kd-dsp-web-portal.vercel.app,https://kd-dsp-web-portal-*.vercel.app
```

여러 도메인을 허용하려면 쉼표로 구분합니다.

---

## 🐛 문제 해결

### 1. 여전히 404 에러가 발생하는 경우
- Vercel 환경 변수가 올바르게 설정되었는지 확인
- 재배포가 완료되었는지 확인
- 브라우저 캐시 삭제 (Ctrl+Shift+R 또는 Cmd+Shift+R)

### 2. CORS 에러가 발생하는 경우
```
Access to XMLHttpRequest has been blocked by CORS policy
```
- Railway 백엔드의 `CORS_ORIGIN` 환경 변수 확인
- Vercel 도메인이 포함되어 있는지 확인

### 3. Railway 백엔드가 응답하지 않는 경우
- Railway 대시보드에서 배포 상태 확인
- Railway 로그 확인: `railway logs`
- 백엔드가 정상 실행 중인지 확인

---

**작성일**: 2026-01-10
