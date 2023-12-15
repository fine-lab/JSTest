let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    ObjectStore.insert("GT65292AT10.GT65292AT10.prelog", { new1: JSON.stringify(param) });
    let func1 = extrequire("GT65292AT10.backDefaultGroup.getTokenNew");
    let paramToken = {};
    let resToken = func1.execute(paramToken);
    let token = resToken.access_token;
    let api_url = resToken.api_url;
    let billData = param.data[0];
    let billnum = param.billnum;
    let staffId = "yourIdHere";
    let staffInfo = extrequire("GT65292AT10.backDefaultGroup.queryStaffById").execute({ id: staffId });
    let body = {
      tenantId: "yourIdHere",
      typeName: "业绩确认",
      srcMsgId: billData.id,
      yyUserIds: [staffInfo.apiResponse.data.user_id],
      title: "售前业绩确认单" + billData.code,
      content: "发起人:" + billData.proposer_name + "\r\n" + "商机编码:" + billData.Oppt_code,
      appId: "0",
      businessKey: billnum + "_" + billData.id,
      webUrl:
        "https://www.example.com/" +
        billnum +
        "/" +
        billData.id +
        "?domainKey=developplatform&apptype=mdf&bipCasTag&taskFlag=todo&typecode=approve&tenantId=fwgk33yl&qzId=307193&source=developplatform&yssource=developplatform&code=${esncode}",
      mUrl:
        "https://www.example.com/" +
        billnum +
        "MobileArchive?mode=browse&_id=" +
        billData.id +
        "&readOnly=true&terminalType=3&taskFlag=todo&typecode=approve&tenantId=fwgk33yl&qzId=307193&code=${esncode}&isReturnNative=true&source=developplatform&yssource=developplatform",
      doneStatus: 0
    };
    ObjectStore.insert("GT65292AT10.GT65292AT10.prelog", { new1: JSON.stringify(body) });
    let url = api_url + "/yonbip/uspace/rest/todo/tenant/item/v2?access_token=" + token;
    let apiResponse = null;
    try {
      apiResponse = postman("POST", url, null, JSON.stringify(body));
    } catch (e) {
      return {
        e
      };
    }
    return {
      apiResponse: apiResponse,
      version: "20220614",
      api_url: api_url
    };
  }
}
exports({ entryPoint: MyTrigger });