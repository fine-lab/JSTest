let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tree = request.tree;
    let conditions = request.conditions;
    let match = request.match;
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
    let getAllLeaf = (data) => {
      let result = {};
      let getLeaf = (data) => {
        for (let i in data) {
          let item = data[i];
          if (judgeBranch(item) !== null) {
            result[item.id] = item;
          } else if (item.children !== undefined) {
            let childs = item.children;
            getLeaf(childs);
          }
        }
      };
      getLeaf(data);
      return result;
    };
    // 判断下级是否有满足条件的树
    let childtrue = (branch, realbranchlist) => {
      // 如果branch在realbranchlist里面
      if (realbranchlist[branch.id]) {
        return true;
      } else {
        let childs = branch.children;
        // 如果他还有下级
        if (childs) {
          for (let n in childs) {
            let child = childs[n];
            if (childtrue(child, realbranchlist)) {
              return true;
            }
          }
          return false;
        }
        // 否则就是末级不满足，返回false
        else {
          return false;
        }
      }
    };
    let atree = tree;
    let judge = (tree1, real) => {
      for (let i in tree1) {
        let item = tree1[i];
        if (!childtrue(item, real)) {
          tree1.splice(i, 1);
          i--;
        } else {
          let childs = item.children;
          if (childs) {
            for (let n in childs) {
              let child = childs[n];
              judge(child);
            }
          }
          judge(child);
        }
      }
    };
    let ns = getAllLeaf(tree);
    judge(atree, ns);
    let res = atree;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });