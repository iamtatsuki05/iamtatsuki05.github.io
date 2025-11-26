module.exports = {
  ci: {
    collect: {
      // 静的エクスポートされたディレクトリを指定 (next export / output: 'export')
      staticDistDir: './out',
      // 計測回数
      numberOfRuns: 3,
    },
    upload: {
      // 一時的なパブリックストレージにレポートをアップロード (セットアップ不要)
      target: 'temporary-public-storage',
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // 必要に応じてしきい値を調整してください
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
      },
    },
  },
};
