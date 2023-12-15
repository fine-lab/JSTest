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
    if (parentArr.length > 0) {
      for (let i in parentArr) {
        let sql2 = "select sys_orgId,sys_code from GT34544AT7.GT34544AT7.IndustryOwnOrg where sys_parent = " + parentArr[i];
        let res2 = ObjectStore.queryByYonQL(sql2, "developplatform");
        //找到后对节点进行过滤
        if (res2.length > 0) {
          for (let j in res2) {
            let str = res2[j].sys_code;
            var res3 = includes(str, "P");
            if (res3) {
              xParent.push(res2[j].sys_orgId);
              break;
            }
          }
        }
      }
    }
    arr = xParent;
    return { arr };
  }
}
exports({ entryPoint: MyAPIHandler });