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
              if (branch.fund_arrangemode !== undefined) {
                if (branch[llk] === condition[key]) {
                  n++;
                }
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
      //先判断这个顶级主表是否切块。
      //如果不切块则直接调用方法，看安排方式是否向下转移支付，管理机构是否当前登录用户所在机构。
      //如果切块，则直接循环children，将children当参数调用该方法。这个时候方法返回值则只是一个children，需要套上上级主表赋值给res。
      if (tree[i].CutPieces && tree[i].children !== undefined) {
        for (let j in tree[i].children) {
          if (tree[i].children[j]) {
            let children = deletetreechild(tree[i].children[j]);
            if (children !== null) {
              tree[i].children = [];
              tree[i].children.push(children);
              res[i] = tree[i];
            }
          }
        }
      } else {
        res[i] = deletetreechild(tree[i]);
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });