let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT34544AT7.authManager.getAllAreaAdmin");
    let arr = func1.execute(request).arr;
    //每一个管理区域的上级id数组
    let parentArr = [];
    //每一个管理区域的社有企业根节点
    let xParent = [];
    if (arr.length > 0) {
      for (let i in arr) {
        let sql1 = "select sys_parent from GT34544AT7.GT34544AT7.IndustryOwnOrg where sys_orgId = " + arr[i];
        let res1 = ObjectStore.queryByYonQL(sql1, "developplatform");
        if (res1 !== undefined) {
          parentArr.push(res1[0].sys_parent);
        }
      }
    }
    let bodydata = {
      tree: request.tree,
      condition: parentArr,
      top: request.top,
      down: request.down
    };
    let url = "https://www.example.com/";
    var accept = postman("post", url, null, JSON.stringify(bodydata));
    var data1 = JSON.parse(accept).data;
    var res = JSON.parse(data1);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });