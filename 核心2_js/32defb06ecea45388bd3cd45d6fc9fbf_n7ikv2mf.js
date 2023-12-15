let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var businessKey = request.id;
    var content = "";
    var hmd_contenttype = "application/json;charset=UTF-8";
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    };
    var object = {
      id: businessKey,
      compositions: [
        {
          name: "outsource_task_prodlineList",
          compositions: []
        },
        {
          name: "outsource_task_industryList",
          compositions: []
        },
        {
          name: "outsource_task_fieldList",
          compositions: []
        }
      ]
    };
    let workNotice = extrequire("GT30661AT5.backDefaultGroup.workNotice");
    //实体查询
    var res = ObjectStore.selectById("GT51004AT10.GT51004AT10.outsource_task", object);
    var orgid = res.org_id;
    //查询组织信息
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
    var outsource_task_industryList = res.outsource_task_industryList;
    var industryIds = [];
    if (outsource_task_industryList !== null && outsource_task_industryList !== undefined) {
      for (var industryNum = 0; industryNum < outsource_task_industryList.length; industryNum++) {
        industryIds.push(outsource_task_industryList[industryNum].industry);
      }
    }
    var industryCodes = getFiledCodes(industryIds);
    //处理产品线信息,将id转为编码
    var outsource_task_prodlineList = res.outsource_task_prodlineList;
    var prodlineIds = [];
    if (outsource_task_prodlineList !== null && outsource_task_prodlineList !== undefined) {
      for (var prodlineNum = 0; prodlineNum < outsource_task_prodlineList.length; prodlineNum++) {
        prodlineIds.push(outsource_task_prodlineList[prodlineNum].prodline);
      }
    }
    var prodlineCodes = getFiledCodes(prodlineIds);
    //处理领域信息,将id转为编码
    var outsource_task_fieldList = res.outsource_task_fieldList;
    var fieldIds = [];
    if (outsource_task_fieldList !== null && outsource_task_fieldList !== undefined) {
      for (var fieldNum = 0; fieldNum < outsource_task_fieldList.length; fieldNum++) {
        fieldIds.push(outsource_task_fieldList[fieldNum].field);
      }
    }
    var fieldCodes = getFiledCodes(fieldIds);
    let isPreInvest = res.isPreInvest === "1" ? "是" : "否";
    var pompBody = {
      code: res.code,
      customerName: res.customerName,
      industry: industryCodes,
      organization: replace(applyOrgName, "YonYou-", ""),
      location: res.location,
      deliveryMode: res.deliveryMode,
      partnerLevel: res.partnerLevel,
      outsourceType: res.outsourceType,
      isPreInvest: isPreInvest,
      subcontractModel: res.subcontractModel,
      prodLine: prodlineCodes,
      field: fieldCodes,
      expectStartDate: res.expectStartDate,
      expectEndDate: res.expectEndDate,
      type: res.type,
      startDate: formatDate(new Date()),
      endDate: res.validDate,
      publishPersonMobile: res.publishMobile,
      publishPerson: res.publishPerson,
      publishPersonEmail: res.publishEmail,
      publishOrgCode: applyOrgCode,
      publishOrgName: replace(applyOrgName, "YonYou-", ""),
      projectDesc: res.projectDesc,
      adviserReq: res.adviserReq,
      advisorNum: res.advisorNum,
      publishRange: res.publishRange,
      publishPersonId: res.creator,
      memo: res.memo,
      area: res.region,
      status: 0
    };
    //调用第三方接口推送数据
    var resultRes = {};
    var resultRet;
    let token_url = "https://www.example.com/" + res.creator;
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