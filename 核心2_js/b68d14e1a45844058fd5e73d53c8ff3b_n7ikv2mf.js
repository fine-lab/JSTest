let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    let rres = {};
    var object = {
      id: id,
      compositions: [
        {
          name: "ssp_parter_apply_cot_applyAreaList", //授权区域
          compositions: []
        },
        {
          name: "ssp_parter_apply_cot_resourceAreaList", //资源部属地
          compositions: []
        },
        {
          name: "ssp_parter_apply_cot_train_productList", //授权培训产品
          compositions: []
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("GT30659AT3.GT30659AT3.ssp_parter_apply_cot", object);
    rres.trainRes = res;
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
    //授权信息
    var authItem = [];
    authItem.push({ authItemId: "yourIdHere", authTypeId: "008" }); //伙伴类型  培训伙伴
    //培训方向
    let train_direction = res.train_direction; //"01602,01601"
    let tds = train_direction.split(",");
    for (var tdi = 0; tdi < tds.length; tdi++) {
      authItem.push({ authItemId: tds[tdi], authTypeId: "016" });
    }
    let getFiledCode = extrequire("GT30659AT3.backDefaultGroup.queryFieldCode");
    //授权地域范围
    var areaList = res.ssp_parter_apply_cot_applyAreaList;
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
    var resAreaList = res.ssp_parter_apply_cot_resourceAreaList;
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
    //授权培训产品
    var prLList = res.ssp_parter_apply_cot_train_productList;
    var prlIds = [];
    if (prLList !== null && prLList !== undefined) {
      for (var prlNum = 0; prlNum < prLList.length; prlNum++) {
        prlIds.push(prLList[prlNum].train_product);
      }
      let prlParam = { ids: prlIds };
      let prlRes = getFiledCode.execute(prlParam);
      var prlCodeArray = prlRes.codes;
      if (prlCodeArray !== null) {
        for (var prli = 0; prli < prlCodeArray.length; prli++) {
          authItem.push({ authItemId: prlCodeArray[prli], authTypeId: "PRL" });
        }
      }
    }
    var yhtUserId = res.creator;
    let token_url = "https://www.example.com/" + yhtUserId;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let tokenResponse = postman("get", token_url, null, null);
    var d = {};
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
        cityId: "",
        provinceId: "",
        contactEmail: res.partnerContactEmail,
        contactPerson: res.partnerContact,
        contactPhone: res.partnerContactMobile,
        holdInfo: res.holdInfo,
        pkCorp: pk_corp,
        corpName: res.orgName,
        createUser: yhtUserId,
        manager: res.legalPerson,
        name: res.partnerName,
        code: "",
        shortName: res.partnerName,
        remark: "",
        partnerType: "3",
        partnerBizType: "004",
        pkCorpgroup: "002",
        startDate: res.startDate,
        endDate: res.endDate,
        prmPartnerCertDTOList: [
          {
            certLevel: "00504",
            certOrg: res.certOrg,
            startDate: res.startDate,
            endDate: res.endDate,
            productLineId: "",
            dr: 0,
            authListDTO: {
              authItem: authItem
            }
          }
        ],
        def1: res.scope,
        def2: resAreaNames,
        def3: res.partnerContactPost,
        def4: res.regMoney
      };
      rres.body = body;
      let query_url = "https://www.example.com/";
      let detail = postman("post", query_url, JSON.stringify(header), JSON.stringify(body));
      d = JSON.parse(detail);
    }
    var object2 = { id: businessKey, synstatus: "2" };
    var res2 = ObjectStore.updateById("GT30659AT3.GT30659AT3.ssp_parter_apply_cot", object2, "yb592b12d4");
    return rres;
  }
}
exports({ entryPoint: MyAPIHandler });