let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT34544AT7.authManager.getAllP");
    let resx = func1.execute(request);
    let tree = request.tree;
    let condition = resx.arr;
    //根据条件找节点，多条件下，可能会有重复节点
    function familyTree(tree, condition) {
      var temp = [];
      var forFn = function (arr, sys_orgId) {
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i];
          if (item.sys_orgId === sys_orgId) {
            temp.push(item);
            forFn(tree, item.sys_parent);
            break;
          } else {
            if (item.children) {
              forFn(item.children, sys_orgId);
            }
          }
        }
      };
      //循环之心判断条件
      for (let index = 0; index < condition.length; index++) {
        const element = condition[index];
        forFn(tree, condition[index]);
      }
      return temp;
    }
    //出去重复
    function duplicateChecking(arr, condition) {
      let temp = [];
      for (let item of arr) {
        item.children = [];
        if (temp.indexOf(item) === -1) {
          temp.push(item);
        }
      }
      return temp;
    }
    // 将去除重复的 节点 转换为节点
    function transTree(data) {
      let result = [];
      let map = {};
      if (!Array.isArray(data)) {
        console.log("not array");
        return [];
      }
      data.forEach((item) => {
        map[item.id] = item;
      });
      data.forEach((item) => {
        let parent = map[item.parent];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          result.push(item);
        }
      });
      return result;
    }
    //  根据条sys org ID条件筛选出所有节点  棉麻："2411297426480128" 公司1："2413075453221888"
    let res1 = familyTree(tree, condition);
    //  删除重复的 节点，将所有节点的children设为[]
    let res2 = duplicateChecking(res1, condition);
    // 将原来的数组转换为树，此对象 为返回结果
    let res = transTree(res2);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });