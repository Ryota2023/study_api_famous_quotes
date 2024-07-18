// Mochaテスト
// Mochaを使ってテストを実行し、コードの品質と動作を保証します。
// 基本的にデプロイ前に開発環境でテストしてみるのが通常
// テスト方法: 'npm test'コマンドを実行する

const assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.strictEqual([1, 2, 3].indexOf(4), -1);
    });
  });
});
