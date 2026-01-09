# Google Maps 설정 가이드

## 📋 개요

KD-DSP 웹 포털은 실시간 차량 위치 모니터링을 위해 Google Maps API를 사용합니다.

---

## 🔑 API 키 발급

### 1. Google Cloud Console 접속
https://console.cloud.google.com/

### 2. 프로젝트 생성
1. 상단의 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 선택
3. 프로젝트 이름 입력 (예: "kd-dsp-maps")
4. "만들기" 클릭

### 3. Maps JavaScript API 활성화
1. 좌측 메뉴에서 "APIs & Services" → "Library" 선택
2. "Maps JavaScript API" 검색
3. "사용 설정" 클릭

### 4. API 키 생성
1. "APIs & Services" → "Credentials" 이동
2. "+ CREATE CREDENTIALS" 클릭
3. "API key" 선택
4. 생성된 API 키 복사

---

## 🔒 보안 설정 (필수)

### HTTP 리퍼러 제한 설정

1. 생성된 API 키 옆의 편집 아이콘 클릭
2. "Application restrictions" 섹션에서 "HTTP referrers (web sites)" 선택
3. "Add an item" 클릭하여 허용할 도메인 추가:
   ```
   localhost:5173/*
   localhost:3000/*
   yourdomain.com/*
   *.yourdomain.com/*
   ```

### API 제한 설정

1. "API restrictions" 섹션에서 "Restrict key" 선택
2. "Maps JavaScript API" 선택
3. "Save" 클릭

---

## ⚙️ 프로젝트 설정

### 1. 환경 변수 파일 생성

프로젝트 루트에 `.env` 파일 생성:

```bash
# .env
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
VITE_ENV=development
```

**⚠️ 주의**: `.env` 파일은 절대 Git에 커밋하지 마세요!

### 2. .gitignore 확인

`.gitignore` 파일에 다음이 포함되어 있는지 확인:

```
.env
.env.local
.env.*.local
```

---

## 🧪 테스트

### 개발 서버 실행

```bash
npm run dev
```

### 모니터링 페이지 접속

http://localhost:5173/monitoring

### 확인 사항

1. ✅ 지도가 정상적으로 로드되는지 확인
2. ✅ 차량 마커가 표시되는지 확인
3. ✅ 콘솔에 에러가 없는지 확인

---

## 💰 비용 관리

### 무료 크레딧

- Google Maps Platform은 매월 $200 무료 크레딧 제공
- 대부분의 소규모 프로젝트는 무료 범위 내에서 사용 가능

### 사용량 모니터링

1. Google Cloud Console → "APIs & Services" → "Dashboard"
2. Maps JavaScript API 사용량 확인
3. 예상 비용 확인

### 할당량 설정 (권장)

1. "APIs & Services" → "Quotas" 이동
2. Maps JavaScript API 선택
3. 일일 요청 제한 설정 (예: 10,000 requests/day)

---

## 🐛 문제 해결

### 지도가 표시되지 않는 경우

1. **API 키 확인**
   ```bash
   # .env 파일 확인
   cat .env | grep GOOGLE_MAPS
   ```

2. **브라우저 콘솔 확인**
   - F12 → Console 탭
   - Google Maps 관련 에러 메시지 확인

3. **API 활성화 확인**
   - Google Cloud Console에서 Maps JavaScript API가 활성화되어 있는지 확인

### "This page can't load Google Maps correctly" 에러

- **원인**: API 키가 유효하지 않거나 청구가 활성화되지 않음
- **해결**: 
  1. Google Cloud Console에서 청구 계정 연결
  2. API 키 재생성

### 리퍼러 제한 에러

- **원인**: HTTP 리퍼러 제한 설정이 잘못됨
- **해결**: 
  1. API 키 설정에서 현재 도메인 추가
  2. 개발 환경에서는 `localhost:5173/*` 추가

---

## 📚 참고 자료

- [Google Maps JavaScript API 문서](https://developers.google.com/maps/documentation/javascript)
- [가격 정책](https://mapsplatform.google.com/pricing/)
- [API 키 모범 사례](https://developers.google.com/maps/api-security-best-practices)

---

## 🔄 프로덕션 배포 시 체크리스트

- [ ] 프로덕션 도메인을 HTTP 리퍼러에 추가
- [ ] API 키를 환경 변수로 안전하게 관리
- [ ] 사용량 알림 설정
- [ ] 일일 할당량 제한 설정
- [ ] 청구 알림 설정
- [ ] 백업 API 키 준비

---

**작성일**: 2026-01-09
**버전**: 1.0
