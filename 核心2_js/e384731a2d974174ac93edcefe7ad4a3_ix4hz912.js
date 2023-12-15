let AbstractAPIHandler = require("AbstractAPIHandler");
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
function getParentOrgList(orgId) {
  let orgObjs = [
    { parentOrgId: "yourIdHere", parentOrgName: "AIMXI建机事业部", orgId: "yourIdHere", orgName: "郑州爱尔森机械设备有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "AIMXI建机事业部", orgId: "yourIdHere", orgName: "河南国立米克斯科技有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "AIMXI建机事业部", orgId: "yourIdHere", orgName: "河南米科斯机械设备有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "百特环保事业部", orgId: "yourIdHere", orgName: "河南百特设备机械有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "百特环保事业部", orgId: "yourIdHere", orgName: "河南国立百特环保机械有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "游乐事业部", orgId: "yourIdHere", orgName: "河南国立百斯特游乐设备有限公司" }
  ];
  let orgList = [];
  for (var i in orgObjs) {
    let orgObj = orgObjs[i];
    if (orgObj.parentOrgId == orgId) {
      orgList.push(orgObj);
    }
  }
  return orgList;
}
const getCuCategory = (params) => {
  let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
  let ifUrl = DOMAIN + "/yonbip/digitalModel/custcategory/tree";
  let suffix = params.suffix;
  let orgName = params.orgName;
  let country = params.country;
  if (suffix == undefined || suffix == null || suffix == "") {
    suffix = includes(orgName, "建机") ? "A" : includes(orgName, "环保") ? "C" : "B";
  }
  let body = {
    condition: {
      isExtend: true,
      simpleVOs: [
        {
          field: "level",
          op: "gt",
          value1: 2
        },
        {
          field: "code",
          op: "like",
          value1: suffix
        },
        {
          field: "name",
          op: "eq",
          value1: country
        }
      ]
    }
  };
  let apiRes = openLinker("POST", ifUrl, "GZTBDM", JSON.stringify(body));
  let apiResObj = JSON.parse(apiRes);
  if (apiResObj.code == 200 && apiResObj.data == null) {
    body = {
      condition: {
        isExtend: true,
        simpleVOs: [
          {
            field: "level",
            op: "gt",
            value1: 2
          },
          {
            field: "code",
            op: "like",
            value1: suffix + "9999"
          }
        ]
      }
    };
    apiRes = openLinker("POST", ifUrl, "GZTBDM", JSON.stringify(body));
  }
  return JSON.parse(apiRes);
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(billObj) {
    let custCode = billObj.code;
    let custId = billObj.id;
    let merchant_name = billObj.merchant_name;
    if (custId == "") {
      return;
    }
    let companyName = billObj.MingChen;
    let sqlStr =
      "select org_id.name,GuoJia.guoJiaMingCheng,*,(select * from ShangJiXinXiList) as ShangJiXinXiList,(select * from LianXiRenXinXiList) as LianXiRenXinXiList,(select * from YinHangXinXiList) as YinHangXinXiList from GT3734AT5.GT3734AT5.GongSi where id='" +
      custId +
      "'";
    var respObjs = ObjectStore.queryByYonQL(sqlStr, "developplatform");
    let respObj = respObjs[0];
    let org_id = respObj.org_id;
    let org_name = respObj.org_id_name; //组织名称/事业部
    let orgList = [
      {
        //客户适用组织
        orgId: org_id,
        isCreator: true,
        rangeType: 1,
        _status: "Insert" //操作标识, Insert:新增、Update:更新
      }
    ];
    let olist = getParentOrgList(org_id);
    for (var k in olist) {
      orgList.push({ orgId: olist[k].orgId, rangeType: 1, _status: "Insert" });
    }
    let guoJiaMingCheng = respObj.GuoJia_guoJiaMingCheng; //国家名称
    let customerClass = "1570120969749004346";
    let categoryCode = "";
    let categoryObj = getCuCategory({ orgName: org_name, country: guoJiaMingCheng });
    if (categoryObj.code == 200) {
      customerClass = categoryObj.data[0].id;
      categoryCode = categoryObj.data[0].code;
    }
    let address = respObj.address;
    let lxrName = respObj.LianXiRenXinXiList[0].XingMing;
    let xunpanlaiyuan = respObj.xunpanlaiyuan;
    let apiRes = extrequire("GT3734AT5.APIFunc.getEmunTxtApi").execute(null, JSON.stringify({ key: xunpanlaiyuan, emunURI: "developplatform.developplatform.Emun_XunPanLeiXing" }));
    let xunpanlaiyuanTxt = apiRes == null ? "" : apiRes;
    let SalesId = respObj.Sales;
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let res = AppContext();
    let obj = JSON.parse(res);
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let saveUrl = DOMAIN + "/yonbip/digitalModel/merchant/save";
    let vat0 = "1568693485824901134"; //税率0的ID
    let bodyObj = {
      data: {
        _status: "Insert", //操作标识, Insert:新增、Update:更新
        createOrg: org_id, //管理组织
        code: categoryCode + custCode, //客户编码(不能为空，新增会自动重新生成)
        name: { zh_CN: companyName },
        shortname: { zh_CN: companyName },
        enterpriseName: companyName,
        merchantAppliedDetail: {
          //业务信息
          taxRate: vat0,
          professSalesman: SalesId,
          stopstatus: false
        },
        taxPayingCategories: 0, //纳税类别, 0:一般纳税人、1:小规模纳税人、2:海外纳税、    示例：0
        customerClass: customerClass, //客户分类id--中国
        customerClass_code: categoryCode,
        customerClassErpCode: categoryCode,
        merchantOptions: false, //是否商家， true:是、false:否
        enterpriseNature: 0, //企业类型, 0:企业、1:个人、2:非营利组织
        extendCustomer: custId,
        address: address,
        extendgjdq: respObj.GuoJia, //国家
        extendkhxxlyqd: xunpanlaiyuanTxt, //客户信息来源渠道
        extendkhxxlysj: respObj.khxxlysj, //客户信息来源时间
        merchantAddressInfos: [], //地址信息
        merchantContacterInfos: [
          {
            //联系人信息
            fullName: { zh_CN: lxrName },
            isDefault: true, //默认地址, true:是、false:否
            _status: "Insert" //操作标识, Insert:新增、Update:更新
          }
        ],
        merchantApplyRanges: [
          {
            //客户适用组织
            orgId: org_id,
            isCreator: true,
            rangeType: 1,
            _status: "Insert" //操作标识, Insert:新增、Update:更新
          },
          {
            orgId: "yourIdHere",
            rangeType: 1,
            _status: "Insert" //操作标识, Insert:新增、Update:更新
          },
          {
            orgId: "yourIdHere",
            rangeType: 1,
            _status: "Insert" //操作标识, Insert:新增、Update:更新
          },
          {
            orgId: "yourIdHere",
            rangeType: 1,
            _status: "Insert" //操作标识, Insert:新增、Update:更新
          }
        ],
        merchantAgentFinancialInfos: [],
        merchantAgentInvoiceInfos: [],
        merchantCorpImages: [],
        merchantAttachments: []
      }
    };
    bodyObj.data.merchantApplyRanges = orgList;
    if (address != null && address != "") {
      bodyObj.data.merchantAddressInfos = [
        {
          //地址信息
          addressCode: custCode + "Z-1",
          address: address,
          isDefault: true, //默认地址, true:是、false:否、
          _status: "Insert" //操作标识, Insert:新增、Update:更新
        }
      ];
    }
    let jsonStr = JSON.stringify(bodyObj);
    let saveApiRes = openLinker("POST", saveUrl, "GZTBDM", JSON.stringify(bodyObj)); //添加客户档案
    let saveApiResObj = JSON.parse(saveApiRes);
    if (saveApiResObj.code == 200) {
      //成功
      let sysCustId = saveApiResObj.data.id;
      let sysCustCode = saveApiResObj.data.code;
      //回写潜客关联档案
      let biObj = { id: custId, isRelated: true, autoRelated: true, merchant: sysCustId, relateArchTime: getNowDate() };
      let biRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", biObj, "3199a3d6", "developplatform");
      return { rst: true, msg: "success", custCode: sysCustCode };
    } else {
      //失败
      let msg = saveApiResObj.message;
      if (includes(msg, "名称重复")) {
        //重复潜客-归为同一客户档案
        if (!respObj.isRelated) {
        }
      }
      return { rst: false, msg: saveApiResObj.message };
    }
    return { rst: false, msg: "异常" };
  }
}
exports({ entryPoint: MyAPIHandler });