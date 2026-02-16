# 날씨 앱 (Weather App)

대한민국 행정구역 기반 날씨 정보 조회 애플리케이션입니다.
현재 위치의 날씨를 자동으로 표시하고, 시/군/구/동 단위로 장소를 검색하여 날씨를 확인할 수 있습니다.

홈페이지
| 데스크탑 | 태블릿/모바일 |
| :--: | :--: |
| <img width="2416" height="1706" alt="image" src="https://github.com/user-attachments/assets/a5da9901-bec0-4e24-8725-241c98e70ba2" /> | <img width="1434" height="1840" alt="image" src="https://github.com/user-attachments/assets/8476fc13-b9b7-4e7b-8ac7-cf945164adec" /> | 

상세페이지
| 데스크탑 | 태블릿/모바일 |
| :--: | :--: |
| <img width="2066" height="1790" alt="image" src="https://github.com/user-attachments/assets/dd06d0d2-368d-49b8-8528-540641c2f51e" /> | <img width="1338" height="1566" alt="image" src="https://github.com/user-attachments/assets/b8df7ed9-105a-4f01-827d-a398d5d5cc80" /> | 


## 프로젝트 실행 방법

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 OpenWeatherMap API 키를 설정합니다.

```bash
cp .env.example .env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

> API 키는 [OpenWeatherMap](https://openweathermap.org/)에서 무료로 발급받을 수 있습니다.

### 설치 및 실행

```bash
pnpm install
pnpm dev
```

### 빌드 및 프리뷰

```bash
pnpm build       # TypeScript 타입 체크 + Vite 프로덕션 빌드 (/dist)
pnpm preview     # 빌드 결과물 로컬 프리뷰
```

### 린트

```bash
pnpm lint        # ESLint 실행
```

## 구현 기능

### 1. 현재 위치 기반 날씨 조회

- 브라우저 Geolocation API로 현재 위치를 자동 감지
- 역지오코딩으로 좌표를 한국어 지명으로 변환하여 표시
- 현재 기온, 당일 최저/최고 기온, 습도, 풍속 표시
- 3시간 간격 24시간 시간별 예보를 가로 스크롤 위젯으로 제공

### 2. 장소 검색

- 대한민국 주소지(시, 군, 구, 동) 모든 단위로 검색 가능
- `korea_districts.json`(약 20,000건)을 클라이언트에서 필터링하여 즉시 응답
- 300ms 디바운스 적용, 최대 20개 검색 결과 표시
- 해당 장소의 날씨 정보가 없는 경우 `"해당 장소의 정보가 제공되지 않습니다."` 메시지 표시

### 3. 즐겨찾기

- 최대 6개 장소 추가 가능, 별칭 수정 가능
- 현재 날씨 정보, 당일의 최저/최고 기온을 보여주는 카드 UI
- 클릭 시 상세 페이지로 이동하여 날씨 상세 정보 조회 가능
- 추가/삭제/수정 시 토스트 알림으로 피드백 제공

### 4. 반응형 디자인

- 데스크탑: 2단 레이아웃(사이드바 + 콘텐츠 영역)
- 모바일: 단일 컬럼 스택 레이아웃

### 5. UX 처리

- 로딩 스피너로 데이터 패칭 상태 표시
- 위치 권한 거부, API 오류 등 에러 상태에 대한 안내 메시지 제공
- 토스트 알림(Sonner)으로 사용자 액션에 대한 즉각적인 피드백

## 기술적 의사결정 및 이유

### TanStack Query로 서버 상태 관리

날씨 데이터는 서버에서 가져오는 비동기 데이터이므로 TanStack Query를 사용하여 캐싱, 자동 갱신, 로딩/에러 상태를 선언적으로 관리합니다. staleTime 설정(5분)으로 불필요한 API 호출을 줄이고, 역지오코딩은 변하지 않는 데이터이므로 무한 캐싱합니다.

### OpenWeatherMap API 선택

하나의 API 키로 날씨 + 지오코딩을 모두 처리할 수 있어 구현이 단순합니다. 기상청 API는 격자 좌표 변환이 별도로 필요하고, 응답 포맷이 복잡합니다.

### FSD (Feature Sliced Design) 아키텍처

FSD는 `shared → entities → features → widgets → pages` 의존성 방향이 명확해서 날씨(entity) / 검색·즐겨찾기(feature) / 카드·상세(widget) 구분이 자연스럽습니다.

```
src/
├── app/         # 앱 설정 (providers, router, styles)
├── pages/       # 페이지 컴포넌트 (HomePage, DetailPage)
├── widgets/     # 조합 UI 블록 (현재날씨 히어로, 시간별 예보, 즐겨찾기 카드)
├── features/    # 사용자 인터랙션 단위 (위치 감지, 장소 검색)
├── entities/    # 비즈니스 엔티티 (weather, location, favorite)
├── shared/      # 공유 유틸리티, UI 컴포넌트, API 클라이언트
└── data/        # 정적 데이터 (행정구역 JSON)
```

### 장소 검색 방식

`korea_districts.json`을 클라이언트 사이드에서 필터링하여 검색합니다. 한국 행정구역 데이터는 약 20,000건 수준이라 클라이언트에서 충분히 처리 가능하고, 300ms 디바운스를 적용하여 입력마다 불필요한 연산을 방지합니다.

### 즐겨찾기 저장 방식

즐겨찾기는 최대 6개이고 데이터 크기가 매우 작습니다(수백 바이트). 별도 백엔드 없이 영속성을 제공하는 localStorage가 가장 적합합니다.

### 빌드 도구

Tailwind v4의 @tailwindcss/vite 플러그인과 바로 호환되고, SWC 기반 Fast Refresh로 개발 경험이 좋습니다.

## 기술 스택

| 분류           | 기술                              |
| -------------- | --------------------------------- |
| 프레임워크     | React 19 + TypeScript (Strict)    |
| 빌드 도구      | Vite 7 + SWC                      |
| 스타일링       | Tailwind CSS v4                   |
| 서버 상태 관리 | TanStack Query v5                 |
| 라우팅         | React Router v7                   |
| 토스트 알림    | Sonner                            |
| 날씨 API       | OpenWeatherMap                    |
| 코드 품질      | ESLint v9 + Prettier              |
| 패키지 매니저  | pnpm                              |

## 배포

별도 백엔드 없이 정적 호스팅(Vercel, Netlify 등)으로 배포할 수 있습니다.

- 빌드 결과물은 `/dist` 디렉토리에 생성됩니다.
- 프로덕션 환경에서도 `VITE_OPENWEATHER_API_KEY` 환경변수 설정이 필요합니다.
- Geolocation API 사용을 위해 HTTPS 환경이 권장됩니다.
