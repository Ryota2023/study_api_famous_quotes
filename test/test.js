// 本番環境でデプロイする前に一度テスト実行してみるための画面
// 本番環境のターミナルで'npm test'コマンドを実行する

const assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.strictEqual([1, 2, 3].indexOf(4), -1);
    });
  });
});
