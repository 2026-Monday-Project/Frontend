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
리뷰와 체크리스트 확인
↓
팀원 누구나 Merge
↓
작업 브랜치 삭제
```

---

## 🌱 Branch Naming

### 형식

```text
타입/이슈번호-작업내용
```

### 예시

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

### 예시

```text
feat: 로그인 기능 구현
fix: 로그인 오류 수정
docs: README 업데이트
```

---

## 🚀 Pull Request

### PR 생성 전 체크리스트

- [ ] 작업 브랜치에서 기능을 직접 테스트했는지
- [ ] 최신 `develop` 내용을 반영했는지
- [ ] `npm run build`가 성공하는지
- [ ] 불필요한 `console.log`를 제거했는지
- [ ] PR의 Base 브랜치가 `develop`인지
- [ ] Issue를 연결했는지 (`Closes #번호`)

### PR 제목 예시

```text
feat: 로그인 기능 구현
fix: 회원가입 오류 수정
```

---

## 🤖 Code Review

- 모든 PR은 **CodeRabbit** 자동 리뷰를 사용합니다.
- PR 작성자는 리뷰 내용을 확인하고 필요한 수정 사항을 반영합니다.
- CodeRabbit의 제안을 반드시 모두 반영할 필요는 없지만, 주요 지적 사항은 검토합니다.
- 기능 구현 및 자체 테스트는 PR 작성자가 책임집니다.
- 리뷰, 충돌 여부, 빌드 결과, 체크리스트 확인이 완료되면 **팀원 누구나 Merge**할 수 있습니다.
- Merge를 진행한 팀원은 작업 브랜치를 삭제합니다.

---

## 🚫 Rules

- `main`, `develop` 브랜치에는 직접 Push하지 않습니다.
- 모든 작업은 Pull Request를 통해 Merge합니다.
- 기능 개발 PR은 `develop` 브랜치를 대상으로 생성합니다.
- `develop` → `main` PR은 배포 시에만 생성합니다.
- 충돌이 발생하면 PR 작성자가 해결합니다.