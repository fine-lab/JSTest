let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tree = request.tree;
    let conditions = request.conditions;
    let match = request.match;
    let res = [];
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
    let deletetreechild = (tree) => {
      let rbch = judgeBranch(tree);
      if (rbch !== null) {
        let childtree = rbch.children;
        if (childtree !== undefined && childtree !== null) {
          let newchild = [];
          for (let i = 0; i < childtree.length; i++) {
            let c = deletetreechild(childtree[i]);
            if (c !== null) {
              newchild.push(c);
            }
          }
          if (newchild.length > 0) {
            rbch.children = [];
            for (let j = 0; j < newchild.length; j++) {
              rbch.children[j] = newchild[j];
            }
          } else {
            delete rbch["children"];
          }
        }
      }
      return rbch;
    };
    for (let i = 0; i < tree.length; i++) {
      res[i] = deletetreechild(tree[i]);
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });