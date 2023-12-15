let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let requestData = request.data;
    //验证编码
    let queryCode = requestData.code;
    let querySql = "select * from  GT101792AT1.GT101792AT1.codelibrary where code='" + queryCode + "'";
    var queryRes = ObjectStore.queryByYonQL(querySql);
    if (queryRes.length == 0) {
      throw new Error("更新码库失败，【码库编码】:" + queryCode + "未查询到对应的数据！");
    } else if (queryRes.length > 1) {
      throw new Error("更新码库失败，【码库编码】:" + queryCode + "查询到多条对应的数据！");
    }
    if (queryRes[0].verifystate == 2) {
      throw new Error("更新码库失败，【码库编码】:" + queryCode + "为已审核数据，不支持修改！");
    }
    //更新id
    let updateId = queryRes[0].id;
    //更新参数
    var object = { id: updateId };
    //验证箱码
    let boxcodeData = requestData.boxcode;
    if (boxcodeData != null && boxcodeData != "") {
      object.boxcode = boxcodeData;
    }
    //验证托码
    let supportcodeData = requestData.supportcode;
    if (supportcodeData != null && supportcodeData != "") {
      object.supportcode = supportcodeData;
    }
    //验证垛码
    let stackingcodeData = requestData.stackingcode;
    if (stackingcodeData != null && stackingcodeData != "") {
      object.stackingcode = stackingcodeData;
    }
    //更新
    var res = ObjectStore.updateById("GT101792AT1.GT101792AT1.codelibrary", object, "7e0ea034");
    let returnData = { message: "更新成功！" };
    return returnData;
  }
}
exports({ entryPoint: MyAPIHandler });