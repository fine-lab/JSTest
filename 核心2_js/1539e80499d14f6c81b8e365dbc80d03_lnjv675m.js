let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tree = request.tree;
    let conditions = request.conditions;
    let match = request.match;
    let res = [];
    // 判断是否存在
    // 判断是否满足条件
    let judgeBranch = (branch) => {
      let rst = null;
      for (let i in conditions) {
        let condition = conditions[i];
        let kl = Object.keys(condition).length;
        let n = 0;
        for (let key in condition) {
          for (let y in match) {
            if (key === y) {
              let llk = match[y];
              if (branch[llk] === condition[key]) {
                n++;
              }
            }
          }
        }
        if (n === kl) {
          rst = branch;
          break;
        }
      }
      return rst;
    };
    // 加入节点
    let addtree = (tree) => {};
    for (let i = 0; i < tree.length; i++) {
      res[i] = deletetreechild(tree[i]);
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });