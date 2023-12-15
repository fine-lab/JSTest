let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let dataObj = param.data[0];
    let id = dataObj.id;
    let res = AppContext();
    let obj = JSON.parse(res);
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let logToDBUrl = DOMAIN + "/" + tid + "/selfApiClass/glSelfApi/logToDB"; //发布的写日志接口
    let resCount = ObjectStore.queryByYonQL("select count(1) as relateNum from GT3734AT5.GT3734AT5.QYSQD where kehumingchen='" + id + "'", "developplatform");
    let logToDBResp = openLinker(
      "POST",
      logToDBUrl,
      "GT3734AT5",
      JSON.stringify({ LogToDB: false, logModule: 9, description: "测试--控制删除客户档案", reqt: JSON.stringify(param), resp: JSON.stringify(resCount), usrName: usrName })
    ); //写日志
    if (resCount[0].relateNum > 0) {
      throw new Error("档案已被签约申请单关联引用，不能删除!");
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });