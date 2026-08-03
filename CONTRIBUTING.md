# Contributing Guide

## 🌿 Branch Strategy

- `main` : 배포 브랜치
- `develop` : 개발 브랜치
- `feat/*`, `fix/*`, `docs/*`, `refactor/*` : 작업 브랜치

> 모든 작업은 `develop` 브랜치를 기준으로 진행합니다.

---

## 📌 Workflow

```text
Issue 생성
↓
develop에서 작업 브랜치 생성
↓
기능 구현 및 테스트
↓
Pull Request 생성 (develop)
↓
CodeRabbit 자동 리뷰
↓
필요한 수정 사항 반영
↓
팀장 Merge
```

---

## 🌱 Branch Naming

**형식**

```text
타입/이슈번호-작업내용
```

**예시**

```text
feat/2-login
fix/5-token-error
docs/7-readme
refactor/10-header
```

---

## 💬 Commit Convention

| Type | Description |
|------|-------------|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `refactor` | 코드 리팩토링 |
| `style` | 코드 스타일 수정 |
| `docs` | 문서 수정 |
| `test` | 테스트 코드 |
| `chore` | 설정 및 기타 작업 |

**예시**

```text
feat: 로그인 기능 구현
fix: 로그인 오류 수정
docs: README 업데이트
```

---

## 🚀 Pull Request

### PR 생성 전 체크

- [ ] 최신 `develop` 반영
- [ ] 기능 테스트 완료
- [ ] `npm run build` 성공
- [ ] 불필요한 `console.log` 제거
- [ ] Issue 연결 (`Closes #번호`)

**PR 제목 예시**

```text
feat: 로그인 기능 구현
fix: 회원가입 오류 수정
```

---

## 🤖 Code Review

- 모든 PR은 **CodeRabbit** 자동 리뷰를 사용합니다.
- PR 작성자는 리뷰 내용을 확인하고 필요한 수정 사항을 반영합니다.
- 팀장은 리뷰 결과를 확인한 후 `develop` 브랜치에 Merge합니다.

---

## 🚫 Rules

- `main`, `develop` 브랜치 직접 Push 금지
- 모든 작업은 Pull Request를 통해 Merge
- Merge 후 작업 브랜치는 삭제합니다.
