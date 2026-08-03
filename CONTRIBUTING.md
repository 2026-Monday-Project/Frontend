# Contributing Guide

프로젝트 협업 규칙입니다.

## 🌿 Branch

- `main` : 배포
- `develop` : 개발
- `feat/*`, `fix/*`, `docs/*`, `refactor/*` : 작업

> 모든 작업은 `develop` 브랜치 기준으로 진행합니다.

---

## 📌 Workflow

- Issue 생성
- `develop`에서 작업 브랜치 생성
- 기능 구현 및 테스트
- `develop`으로 Pull Request 생성
- CodeRabbit 리뷰 확인
- 필요한 수정 사항 반영
- 팀장 Merge

---

## 🌱 Branch Naming

- `feat/2-login`
- `fix/5-token-error`
- `docs/7-readme`

형식: `타입/이슈번호-작업내용`

---

## 💬 Commit

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링
- `style`: 스타일 수정
- `docs`: 문서 수정
- `test`: 테스트
- `chore`: 설정

예시

- `feat: 로그인 기능 구현`
- `fix: 로그인 오류 수정`

---

## 🚀 Pull Request

PR 전 확인

- 최신 `develop` 반영
- 기능 테스트 완료
- `npm run build` 성공
- `console.log` 제거
- `Closes #번호` 연결

---

## 🤖 Code Review

- CodeRabbit 자동 리뷰 확인
- 리뷰 반영 후 Push
- 팀장 확인 후 Merge

---

## 🚫 Rules

- `main`, `develop` 직접 Push 금지
- 모든 작업은 PR을 통해 Merge
- Merge 후 작업 브랜치 삭제
