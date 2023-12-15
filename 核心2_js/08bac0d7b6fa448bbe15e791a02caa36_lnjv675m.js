let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tree = request.tree;
    let func1 = extrequire("GT34544AT7.authManager.getAll_areaAdmin");
    let conditions = func1.execute(request).arr;
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
      for (let i = 0; i < conditions.length; i++) {
        let condition = conditions[i];
        if (branch.sys_orgId === condition) {
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
    searchTree(tree);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });