let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var content = "";
    var hmd_contenttype = "application/json;charset=UTF-8";
    var orgid = request.org_id;
    let orgurl = "https://www.example.com/" + orgid;
    let strResponse = openLinker("GET", orgurl, "GT30661AT5", JSON.stringify({}));
    var resp = JSON.parse(strResponse);
    var applyOrgName = "";
    var applyOrgCode = "";
    if (resp.code == "200") {
      let data = resp.data;
      applyOrgName = data.name.zh_CN; //申请机构
      applyOrgCode = data.code; //申请机构编码
    }
    let header = {
      "Content-Type": hmd_contenttype
    };
    function getFiledCodes(ids) {
      let getFiledCode = extrequire("GT30661AT5.backDefaultGroup.getFiledName");
      let fieldParam = { ids: ids };
      let fieldRes = getFiledCode.execute(fieldParam);
      var fieldCodeArray = fieldRes.codes;
      var codes = "";
      if (fieldCodeArray !== null && fieldCodeArray.length > 0) {
        codes = fieldCodeArray.join(",");
      }
      return codes;
    }
    //处理行业信息,将id转为编码
    var outsource_task_industryList = request.outsource_task_industryList;
    var industryIds = [];
    if (outsource_task_industryList !== null && outsource_task_industryList !== undefined) {
      for (var industryNum = 0; industryNum < outsource_task_industryList.length; industryNum++) {
        industryIds.push(outsource_task_industryList[industryNum].industry);
      }
    }
    var industryCodes = getFiledCodes(industryIds);
    //处理产品线信息,将id转为编码
    var outsource_task_prodlineList = request.outsource_task_prodlineList;
    var prodlineIds = [];
    if (outsource_task_prodlineList !== null && outsource_task_prodlineList !== undefined) {
      for (var prodlineNum = 0; prodlineNum < outsource_task_prodlineList.length; prodlineNum++) {
        prodlineIds.push(outsource_task_prodlineList[prodlineNum].prodline);
      }
    }
    var prodlineCodes = getFiledCodes(prodlineIds);
    //处理领域信息,将id转为编码
    var outsource_task_fieldList = request.outsource_task_fieldList;
    var fieldIds = [];
    if (outsource_task_fieldList !== null && outsource_task_fieldList !== undefined) {
      for (var fieldNum = 0; fieldNum < outsource_task_fieldList.length; fieldNum++) {
        fieldIds.push(outsource_task_fieldList[fieldNum].field);
      }
    }
    var fieldCodes = getFiledCodes(fieldIds);
    var pompBody = {
      industry: industryCodes,
      partnerLevel: request.partnerLevel,
      prodLine: prodlineCodes,
      field: fieldCodes,
      publishOrgCode: applyOrgCode,
      publishOrgName: replace(applyOrgName, "YonYou-", ""),
      publishRange: request.publishRange,
      area: request.region
    };
    //调用第三方接口推送数据
    var resultRes = {};
    var resultRet;
    let token_url = "https://www.example.com/" + request.yhtUserId;
    let tokenResponse = postman("get", token_url, null, null);
    var tr = JSON.parse(tokenResponse);
    if (tr.code === 200) {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let pompheader = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      resultRet = postman("post", "https://www.example.com/", JSON.stringify(pompheader), JSON.stringify(pompBody));
      resultRes = JSON.parse(resultRet);
    }
    return resultRes;
  }
}
exports({ entryPoint: MyAPIHandler });