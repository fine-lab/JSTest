let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tree = request.tree;
    let conditions = request.conditions;
    let match = request.match; //{"sys_area_key":"sys_orgId"}
    let res = [];
    let searchTree = (tree) => {
      for (let i in tree) {
        let branch = tree[i];
        if (!include(branch)) {
          let rbch = judgeBranch(branch);
          if (rbch === null) {
            if (branch.children !== undefined) {
              let childtree = branch.children;
              searchTree(childtree);
            }
          } else {
            res.push(branch);
          }
        }
      }
    };
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
    // 判断是否存在
    let include = (branch) => {
      let inclu = false;
      for (let i in res) {
        if (res[i].id === branch.id) {
          inclu = true;
          break;
        }
      }
      return inclu;
    };
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });