let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var indexid = request.businessKey.indexOf("_");
    var businessKey = request.businessKey.substring(indexid + 1);
    var object = {
      id: businessKey,
      compositions: [
        {
          name: "ssp_parter_apply_certProductLineList",
          compositions: []
        },
        {
          name: "ssp_parter_apply_certFieldList",
          compositions: []
        },
        {
          name: "ssp_parter_apply_certIndustryList",
          compositions: []
        },
        {
          name: "ssp_parter_apply_certAreaList",
          compositions: []
        },
        {
          name: "ssp_parter_apply_resourceAreaList",
          compositions: []
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("GT30659AT3.GT30659AT3.ssp_parter_apply", object);
    if (res.verifystate !== 2) {
      return {};
    }
    var content = "【" + res.orgName + "】同步完成，同步结果：";
    //授权信息
    var authItem = [];
    //授权伙伴等级
    var djs = res.certLevel;
    if (djs !== null && djs !== "" && djs !== undefined) {
      var dj = djs.split(",");
      for (var i = 0; i < dj.length; i++) {
        authItem.push({ authItemId: dj[i], authTypeId: "005" });
      }
    }
    //授权伙伴类型
    var lxs = res.certPartnerType;
    if (lxs !== null && lxs !== "" && lxs !== undefined) {
      var lx = lxs.split(",");
      for (var lxi = 0; lxi < lx.length; lxi++) {
        authItem.push({ authItemId: lx[lxi], authTypeId: "008" });
      }
    }
    let getFiledCode = extrequire("GT30659AT3.backDefaultGroup.queryFieldCode");
    //授权产品线
    var certProductLineList = res.ssp_parter_apply_certProductLineList;
    var productLineIds = [];
    if (certProductLineList !== null && certProductLineList !== undefined) {
      for (var plNum = 0; plNum < certProductLineList.length; plNum++) {
        productLineIds.push(certProductLineList[plNum].certProductLine);
      }
      let plParam = { ids: productLineIds };
      let prolineRes = getFiledCode.execute(plParam);
      var prolineCodeArray = prolineRes.codes;
      if (prolineCodeArray !== null) {
        for (var cpxi = 0; cpxi < prolineCodeArray.length; cpxi++) {
          authItem.push({ authItemId: prolineCodeArray[cpxi], authTypeId: "PRL" });
        }
      }
    }
    //授权领域
    var fieldList = res.ssp_parter_apply_certFieldList;
    var fieldIds = [];
    if (fieldList !== null && fieldList !== undefined) {
      for (var fdNum = 0; fdNum < fieldList.length; fdNum++) {
        fieldIds.push(fieldList[fdNum].certField);
      }
      let fieldParam = { ids: fieldIds };
      let fieldRes = getFiledCode.execute(fieldParam);
      var fieldCodeArray = fieldRes.codes;
      if (fieldCodeArray !== null) {
        for (var lyi = 0; lyi < fieldCodeArray.length; lyi++) {
          authItem.push({ authItemId: fieldCodeArray[lyi], authTypeId: "FID" });
        }
      }
    }
    //授权行业
    var indList = res.ssp_parter_apply_certIndustryList;
    var indIds = [];
    if (indList !== null && indList !== undefined) {
      for (var indNum = 0; indNum < indList.length; indNum++) {
        indIds.push(indList[indNum].certIndustry);
      }
      let indParam = { ids: indIds };
      let indRes = getFiledCode.execute(indParam);
      var indCodeArray = indRes.codes;
      if (indCodeArray !== null) {
        for (var hyi = 0; hyi < indCodeArray.length; hyi++) {
          authItem.push({ authItemId: indCodeArray[hyi], authTypeId: "IDT" });
        }
      }
    }
    //授权地域范围
    var areaList = res.ssp_parter_apply_certAreaList;
    var areaIds = [];
    if (areaList !== null && areaList !== undefined) {
      for (var areaNum = 0; areaNum < areaList.length; areaNum++) {
        areaIds.push(areaList[areaNum].certArea);
      }
      let areaParam = { ids: areaIds };
      let areaRes = getFiledCode.execute(areaParam);
      var areaCodeArray = areaRes.codes;
      if (areaCodeArray !== null) {
        for (var dyfwi = 0; dyfwi < areaCodeArray.length; dyfwi++) {
          authItem.push({ authItemId: areaCodeArray[dyfwi], authTypeId: "ARE" });
        }
      }
    }
    //资源部署地
    let getFiledName = extrequire("GT30659AT3.backDefaultGroup.queryFieldName");
    var resAreaList = res.ssp_parter_apply_resourceAreaList;
    var resAreaIds = [];
    var resAreaNames = "";
    if (resAreaList !== null && resAreaList !== undefined) {
      for (var resAreaNum = 0; resAreaNum < resAreaList.length; resAreaNum++) {
        resAreaIds.push(resAreaList[resAreaNum].resourceArea);
      }
      let resAreaParam = { ids: resAreaIds };
      let resAreaRes = getFiledName.execute(resAreaParam);
      var resAreaNameArray = resAreaRes.names;
      if (resAreaNameArray !== null) {
        resAreaNames = resAreaNameArray.join(",");
      }
    }
    var yhtUserId = res.creator;
    let token_url = "https://www.example.com/" + yhtUserId;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let tokenResponse = postman("get", token_url, null, null);
    var d;
    var tr = JSON.parse(tokenResponse);
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let header = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      var body = {
        address: res.address,
        busiInfo: res.busiInfo,
        cityId: res.cityCode,
        provinceId: res.provinceCode,
        contactEmail: res.applyEmail,
        contactPerson: res.applyPerson,
        contactPhone: res.applyMobile,
        holdInfo: res.holdInfo,
        pkCorp: res.manageOrgCode,
        corpName: res.manageOrgName,
        createUser: yhtUserId,
        manager: res.legalPerson,
        name: res.orgName,
        code: res.orgCode,
        shortName: res.orgName,
        remark: res.certRemark,
        partnerType: "3",
        pkCorpgroup: "002",
        startDate: res.startDate,
        endDate: res.endDate,
        prmPartnerCertDTOList: [
          {
            certLevel: res.certLevel,
            certOrg: res.certOrg,
            startDate: res.startDate,
            endDate: res.endDate,
            productLineId: "yourIdHere",
            dr: 0,
            authListDTO: {
              authItem: authItem
            }
          }
        ],
        def1: res.scope,
        def2: resAreaNames,
        def3: res.applyDuty,
        def4: res.regMoney
      };
      let query_url = "https://www.example.com/";
      let detail = postman("post", query_url, JSON.stringify(header), JSON.stringify(body));
      content = content + detail;
      d = JSON.parse(detail);
    }
    let workNotice = extrequire("GT30659AT3.backDefaultGroup.workNotice");
    workNotice.execute({ title: "伙伴资质申请同步参数", content: JSON.stringify(body) });
    var notice = { title: "伙伴资质申请同步", content: content };
    let res11 = workNotice.execute(notice);
    var object2 = { id: businessKey, synstatus: "2" };
    var res2 = ObjectStore.updateById("GT30659AT3.GT30659AT3.ssp_parter_apply", object2);
    return d;
  }
}
exports({ entryPoint: MyAPIHandler });