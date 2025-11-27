module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새 기능
        'fix', // 버그 수정
        'docs', // 문서
        'style', // 코드 포맷팅
        'refactor', // 리팩토링
        'test', // 테스트
        'chore', // 기타
        'perf', // 성능 개선
        'ci', // CI 설정
        'build', // 빌드
        'revert', // 되돌리기
      ],
    ],
    'subject-case': [0], // 한글 허용
    'subject-max-length': [2, 'always', 100],
  },
};
