# 날씨 앱 (Weather App)

대한민국 행정구역 기반 날씨 정보 조회 애플리케이션입니다.
현재 위치의 날씨를 자동으로 표시하고, 시/군/구/동 단위로 장소를 검색하여 날씨를 확인할 수 있습니다.

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

### 빌드

```bash
pnpm build
pnpm preview
```

## 구현 기능

### 1. 현재 위치 기반 날씨 조회

- 날씨 정보: 현재 기온, 당일의 최저 기온, 당일의 최고 기온, 시간대 별 기온 표시

### 2. 장소 검색

- 대한민국 주소지(시, 군, 구, 동) 모든 단위로 검색 가능
- 검색어 입력 시 매칭되는 장소 리스트 표시
- 해당 장소의 날씨 정보가 없는 경우 `"해당 장소의 정보가 제공되지 않습니다."` 메시지 표시

### 3. 즐겨찾기

- 최대 6개 장소 추가 가능, 별칭 수정 가능
- 현재 날씨 정보, 당일의 최저/최고 기온을 보여주는 카드 UI
- 클릭 시 상세 페이지 이동하여 '날씨 정보' 조회 가능

### 4. 반응형 디자인

- 데스크탑 뷰, 모바일 뷰를 지원

## 기술적 의사결정 및 이유

### TanStack Query로 서버 상태 관리

날씨 데이터는 서버에서 가져오는 비동기 데이터이므로 TanStack Query를 사용하여 캐싱, 자동 갱신, 로딩/에러 상태를 선언적으로 관리합니다. staleTime 설정으로 불필요한 API 호출을 줄입니다.

### OpenWeatherMap API 선택

하나의 API 키로 날씨 + 지오코딩을 모두 처리할 수 있어 구현이 단순합니다. 기상청 API는 격자 좌표 변환이 별도로 필요하고, 응답 포맷이 복잡합니다.

### FSD (Feature Sliced Design) 아키텍처

FSD는 `shared → entities → features → widgets → pages` 의존성 방향이 명확해서 날씨(entity) / 검색·즐겨찾기(feature) / 카드·상세(widget) 구분이 자연스럽습니다.

```
src/
├── app/         # 앱 설정 (providers, router, styles)
├── pages/       # 페이지 컴포넌트
├── widgets/     # 조합 UI 블록 (카드·상세)
├── features/    # 사용자 인터랙션 단위 (검색·즐겨찾기)
├── entities/    # 비즈니스 엔티티 (weather, location)
├── shared/      # 공유 유틸리티, UI, API 클라이언트
└── data/        # 정적 데이터 (행정구역 JSON)
```

### 장소 검색 방식

제공된 `korea_districts.json`을 클라이언트 사이드에서 필터링하여 검색합니다. 한국 행정구역 데이터는 수천 건 수준이라 클라이언트에서 충분히 처리 가능합니다. 디바운스를 적용하면 성능 문제도 없습니다.

### 즐겨찾기 저장 방식

즐겨찾기는 최대 6개이고 데이터 크기가 매우 작습니다(수백 바이트). 별도 백엔드 없이 영속성을 제공하는 localStorage가 가장 적합합니다.

### 빌드 도구

Tailwind v4의 @tailwindcss/vite 플러그인과 바로 호환되고, SWC 기반 Fast Refresh로 개발 경험이 좋습니다.

## 기술 스택

| 분류           | 기술                  |
| -------------- | --------------------- |
| 프레임워크     | React 19 + TypeScript |
| 빌드 도구      | Vite 7                |
| 스타일링       | Tailwind CSS v4       |
| 서버 상태 관리 | TanStack Query v5     |
| 라우팅         | React Router v7       |
| 날씨 API       | OpenWeatherMap        |
