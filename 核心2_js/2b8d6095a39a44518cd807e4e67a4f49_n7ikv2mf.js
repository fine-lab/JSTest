let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var indexid = request.businessKey.indexOf("_");
    var businessKey = request.businessKey.substring(indexid + 1);
    let workNotice = extrequire("GT30659AT3.backDefaultGroup.workNotice");
    var object = {
      id: businessKey,
      compositions: [
        {
          name: "ssp_parter_apply_yy_applyProductLineList",
          compositions: []
        },
        {
          name: "ssp_parter_apply_yy_applyFieldList",
          compositions: []
        },
        {
          name: "ssp_parter_apply_yy_applyIndustry1List",
          compositions: []
        },
        {
          name: "ssp_parter_apply_yy_applyAreaList",
          compositions: []
        },
        {
          name: "ssp_parter_apply_yy_resourceAreaList",
          compositions: []
        },
        {
          name: "ssp_parter_apply_yy_parterIndustryList",
          compositions: []
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("GT30659AT3.GT30659AT3.ssp_parter_apply_yy", object);
    if (res.verifystate !== 2) {
      return {};
    }
    let org_id = res.org_id;
    let queryPkCrop = extrequire("GT30659AT3.yyPartnerCert.queryPkCrop");
    let PkCropRes = queryPkCrop.execute({ org_id: org_id });
    let pk_corp = PkCropRes.pk_corp;
    if (typeof pk_corp == "undefined" || pk_corp == null || pk_corp == "") {
      pk_corp = res.orgCode;
    }
    var content = "【" + res.partnerName + "】同步完成，同步结果：";
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
    var lxs = res.applyPartnerType;
    if (lxs !== null && lxs !== "" && lxs !== undefined) {
      var lx = lxs.split(",");
      for (var lxi = 0; lxi < lx.length; lxi++) {
        authItem.push({ authItemId: lx[lxi], authTypeId: "008" });
      }
    }
    let getFiledCode = extrequire("GT30659AT3.backDefaultGroup.queryFieldCode");
    //授权产品线
    var certProductLineList = res.ssp_parter_apply_yy_applyProductLineList;
    var productLineIds = [];
    if (certProductLineList !== null && certProductLineList !== undefined) {
      for (var plNum = 0; plNum < certProductLineList.length; plNum++) {
        productLineIds.push(certProductLineList[plNum].applyProductLine);
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
    var fieldList = res.ssp_parter_apply_yy_applyFieldList;
    var fieldIds = [];
    if (fieldList !== null && fieldList !== undefined) {
      for (var fdNum = 0; fdNum < fieldList.length; fdNum++) {
        fieldIds.push(fieldList[fdNum].applyField);
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
    var indList = res.ssp_parter_apply_yy_applyIndustry1List;
    var indIds = [];
    if (indList !== null && indList !== undefined) {
      for (var indNum = 0; indNum < indList.length; indNum++) {
        indIds.push(indList[indNum].applyIndustry1);
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
    var areaList = res.ssp_parter_apply_yy_applyAreaList;
    var areaIds = [];
    if (areaList !== null && areaList !== undefined) {
      for (var areaNum = 0; areaNum < areaList.length; areaNum++) {
        areaIds.push(areaList[areaNum].applyArea);
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
    var resAreaList = res.ssp_parter_apply_yy_resourceAreaList;
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
    //伙伴归属行业
    var parterIndustryList = res.ssp_parter_apply_yy_parterIndustryList;
    var parterIndustryIds = [];
    let parterIndustry = "";
    if (parterIndustryList !== null && parterIndustryList !== undefined) {
      for (var pindNum = 0; pindNum < parterIndustryList.length; pindNum++) {
        parterIndustryIds.push(parterIndustryList[pindNum].parterIndustry);
      }
      let pindParam = { ids: parterIndustryIds };
      let pindRes = getFiledCode.execute(pindParam);
      var pindCodeArray = pindRes.codes;
      if (pindCodeArray && pindCodeArray.length > 0) {
        parterIndustry = pindCodeArray.join(",");
      }
    }
    var BusinessDept = [
      "1661371679854848",
      "1832632796795136",
      "1832631302328576",
      "1832631947841792",
      "1832636438483200",
      "1832630016741632",
      "1832629075792128",
      "1681220228387072",
      "1681219869921536",
      "1681221002203392"
    ];
    let productLineId = "yourIdHere";
    if (BusinessDept.includes(org_id)) {
      productLineId = "yourIdHere";
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
      let busiInfo = res.busiInfo && res.busiInfo.length > 500 ? substring(res.busiInfo, 0, 500) : res.busiInfo;
      var body = {
        address: res.address,
        busiInfo: busiInfo,
        cityId: res.cityCode,
        provinceId: res.provinceCode,
        contactEmail: res.applyEmail,
        contactPerson: res.applyPerson,
        contactPhone: res.applyMobile,
        holdInfo: res.holdInfo,
        pkCorp: pk_corp,
        corpName: res.orgName,
        createUser: yhtUserId,
        industry: parterIndustry,
        manager: res.legalPerson,
        name: res.partnerName,
        code: "",
        shortName: res.partnerName,
        remark: res.certRemark,
        partnerType: "3",
        pkCorpgroup: "002",
        startDate: res.startDate,
        endDate: res.endDate,
        prmPartnerCertDTOList: [
          {
            certLevel: res.applyLevel,
            certOrg: res.certOrg,
            startDate: res.startDate,
            endDate: res.endDate,
            productLineId: productLineId,
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
      workNotice.execute({ title: "伙伴资质申请同步2", content: JSON.stringify(body) });
      let query_url = "https://www.example.com/";
      let detail = postman("post", query_url, JSON.stringify(header), JSON.stringify(body));
      content = content + detail;
      d = JSON.parse(detail);
      d.body = body;
    }
    var notice = { title: "伙伴资质申请同步", content: content };
    let res11 = workNotice.execute(notice);
    var object2 = { id: businessKey, synstatus: "2" };
    var res2 = ObjectStore.updateById("GT30659AT3.GT30659AT3.ssp_parter_apply_yy", object2, "31e7856f");
    return d;
  }
}
exports({ entryPoint: MyAPIHandler });