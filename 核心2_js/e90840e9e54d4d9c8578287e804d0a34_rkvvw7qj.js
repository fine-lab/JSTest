let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    var salesOrgId = pdata.salesOrgId;
    let sql = "select define4 from org.func.BaseOrgDefine where id=" + salesOrgId;
    let res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
    var orgId = res[0].define4;
    var payMoney = pdata.payMoney; //含税金额
    var agentId = pdata.agentId; //客户id
    var custNo = pdata.agentId_code;
    var base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      resdata: { payMoney: pdata.payMoney, agentId: pdata.agentId, orgId, custNo: pdata.agentId_code }
    };
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res_r = func.execute("");
    var token2 = res_r.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(body));
    //加判断
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code != "200") {
      throw new Error("失败!" + obj.message);
    } else {
      var message = obj.massge;
      if (message != "ture") {
        throw new Error("信用额度不足，操作失败!");
      }
    }
    return { code: code };
  }
}
exports({ entryPoint: MyTrigger });