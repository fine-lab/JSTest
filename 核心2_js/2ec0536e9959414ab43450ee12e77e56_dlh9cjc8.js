let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var processInstId = request.processInstId;
    var indexid = request.businessKey.indexOf("_");
    var businessKey = request.businessKey.substring(indexid + 1);
    var object = {
      id: businessKey,
      compositions: [
        {
          name: "coordinate_apply_fieldList",
          compositions: []
        }
      ]
    };
    let workNotice = extrequire("GT30661AT5.backDefaultGroup.workNotice");
    let wres1 = workNotice.execute({ title: "ProcessEnd", content: businessKey });
    //实体查询
    var res = ObjectStore.selectById("GT30661AT5.GT30661AT5.coordinate_apply", object);
    var orgid = res.org_id;
    let wres2 = workNotice.execute({ title: "ProcessEnd", content: orgid });
    //查询组织信息
    let func1 = extrequire("GT30661AT5.backDefaultGroup.getToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    var strResponse = postman("get", "https://www.example.com/" + token + "&id=" + orgid, null, null);
    var resp = JSON.parse(strResponse);
    var applyOrgName = "";
    var applyOrgCode = "";
    if (resp.code == "200") {
      let data = resp.data;
      applyOrgName = data.name.zh_CN; //申请机构
      applyOrgCode = data.code; //申请机构编码
    }
    //基本信息
    var applyPersonName = res.applyPerson || ""; //申请人姓名
    var applyPersonCode = "";
    var applyPersonPhone = "";
    var applyPersonEmail = "";
    //获取申请人信息
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      userId: [res.creator]
    };
    var handleMoblie = function (mobile) {
      return mobile.replace("+86-", "");
    };
    var userInfos = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(body));
    var userRes = JSON.parse(userInfos);
    if (userRes.code == "200") {
      if (userRes.data.status == "1") {
        let data = userRes.data.data;
        if (data.length > 0) {
          var id = data[0].id;
          var code = data[0].code;
          applyPersonName = data[0].name || ""; //申请人姓名
          applyPersonCode = data[0].code || ""; //申请人编码
          applyPersonPhone = handleMoblie(data[0].mobile || ""); //申请人电话
          var userDetail = postman("get", "https://www.example.com/" + token + "&id=" + id + "&code=" + code, null, null);
          var userDetailRes = JSON.parse(userDetail);
          if (userDetailRes.code == "200") {
            applyPersonEmail = userDetailRes.data.email || ""; //申请人邮箱
          }
        }
      }
    }
    //处理领域信息,将id转为编码
    var coordinate_apply_fieldList = res.coordinate_apply_fieldList;
    var fieldIds = [];
    for (var fieldNum = 0; fieldNum < coordinate_apply_fieldList.length; fieldNum++) {
      fieldIds.push(coordinate_apply_fieldList[fieldNum].field);
    }
    let getFiledCode = extrequire("GT30661AT5.backDefaultGroup.getFiledName");
    let fieldParam = { ids: fieldIds };
    let fieldRes = getFiledCode.execute(fieldParam);
    var fieldCodeArray = fieldRes.codes;
    var fieldCodes = "";
    if (fieldCodeArray !== null && fieldCodeArray.length > 0) {
      fieldCodes = fieldCodeArray.join(",");
    }
    var pompBody = {
      code: res.code,
      customerName: res.customerName,
      projectName: res.projectName,
      projectDesc: res.projectDesc,
      expectMoney: res.expectMoney,
      expectDate: res.expectDate,
      ownerName: res.ownerName,
      ownerEmail: res.ownerMobile,
      ownerMobile: res.enableTime,
      bizType: res.coordinateType,
      serviceType: res.serviceType,
      industry: res.industryCode,
      productLine: res.productLineCode,
      area: res.areaCode,
      field: fieldCodes, //领域
      inputTime: res.applyDate,
      reqManager: res.reqManager,
      reqAdvisory: res.reqAdvisory,
      reqAmount: res.reqAmount,
      applyPersonName: applyPersonName,
      applyPersonCode: applyPersonCode,
      applyPersonPhone: applyPersonPhone,
      applyPersonEmail: applyPersonEmail,
      applyOrgName: applyOrgName,
      applyOrgCode: applyOrgCode
    };
    //调用第三方接口推送数据
    var resultRes = {};
    let token_url = "https://www.example.com/" + res.creator;
    let tokenResponse = postman("get", token_url, null, null);
    var tr = JSON.parse(tokenResponse);
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let pompheader = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      var resultRet = postman("post", "https://www.example.com/", JSON.stringify(pompheader), JSON.stringify(pompBody));
      resultRes = JSON.parse(resultRet);
    }
    return resultRes;
  }
}
exports({ entryPoint: MyAPIHandler });