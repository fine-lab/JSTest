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
    { parentOrgId: "yourIdHere", parentOrgName: "AIMXI建机事业部", orgId: "yourIdHere", orgName: "河南国立米科斯科技有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "AIMXI建机事业部", orgId: "yourIdHere", orgName: "河南米科斯机械设备有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "百特环保事业部", orgId: "yourIdHere", orgName: "河南百特设备机械有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "百特环保事业部", orgId: "yourIdHere", orgName: "河南国立百特环保科技有限公司" },
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
  let ifUrl = params.ifUrl;
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
  let apiRes = openLinker("POST", ifUrl, "GT3734AT5", JSON.stringify(body)); //GZTBDM
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
    apiRes = openLinker("POST", ifUrl, "GT3734AT5", JSON.stringify(body)); //GZTBDM
  }
  return JSON.parse(apiRes);
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(billObj) {
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let saveUrl = DOMAIN + "/yonbip/digitalModel/merchant/save";
    let vat0 = "1568679441441228607"; //税率0的ID
    let ifUrl = DOMAIN + "/yonbip/digitalModel/custcategory/tree";
    let logToDBUrl = DOMAIN + "/" + tid + "/selfApiClass/glSelfApi/logToDB"; //发布的写日志接口
    let staffUrl = DOMAIN + "/yonbip/hrcloud/HRCloud/getStaffDetail";
    let staffListUrl = DOMAIN + "/yonbip/hrcloud/staff/listmdd";
    let custCode = billObj.code;
    let custId = billObj.id;
    let merchant_name = billObj.merchant_name;
    if (custId == "") {
      return;
    }
    let companyName = billObj.MingChen;
    let orgName = billObj.orgName;
    let billNo = "3199a3d6"; //合一潜客单据
    let gsURI = "GT3734AT5.GT3734AT5.GongSi"; //合一潜客URI
    let gsSuffix = "";
    let zuZhiLeiBie = "";
    if (orgName != undefined && orgName != null) {
      if (includes(orgName, "建机")) {
        gsSuffix = "_JJ";
        billNo = "b979b0e9";
        zuZhiLeiBie = 1;
      } else if (includes(orgName, "环保")) {
        gsSuffix = "_HB";
        billNo = "7b52cdac";
        zuZhiLeiBie = 2;
      } else if (includes(orgName, "游乐")) {
        gsSuffix = "_YL";
        billNo = "04a3e644";
        zuZhiLeiBie = 3;
      } else {
        gsSuffix = "";
      }
      gsURI = gsURI + gsSuffix;
    }
    let sqlStr =
      "select org_id.name,GuoJia.guoJiaMingCheng,Sales.name,Sales.code,*,(select * from ShangJiXinXi" +
      gsSuffix +
      "List) as ShangJiXinXiList,(select * from LianXiRenXinXi" +
      gsSuffix +
      "List) as LianXiRenXinXiList,(select * from YinHangXinXi" +
      gsSuffix +
      "List) as YinHangXinXiList from " +
      gsURI +
      " where id='" +
      custId +
      "'";
    var respObjs = ObjectStore.queryByYonQL(sqlStr, "developplatform");
    let respObj = respObjs[0];
    let resurgent = respObj.resurgent;
    if (resurgent == undefined || resurgent == null) {
      resurgent = "";
    }
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
    orgList.push({ orgId: "yourIdHere", rangeType: 1, _status: "Insert" }); //20230921添加 河南国立控股有限公司
    let olist = getParentOrgList(org_id);
    for (var k in olist) {
      orgList.push({ orgId: olist[k].orgId, rangeType: 1, _status: "Insert" });
    }
    let guoJiaMingCheng = respObj.GuoJia_guoJiaMingCheng; //国家名称
    let customerClass = "1584170692676943877";
    let categoryCode = "A0101";
    let categoryObj = getCuCategory({ orgName: org_name, country: guoJiaMingCheng, ifUrl: ifUrl });
    if (categoryObj.code == 200) {
      customerClass = categoryObj.data[0].id;
      categoryCode = categoryObj.data[0].code;
    }
    let address = respObj.address;
    let lxrName = respObj.LianXiRenXinXiList[0].XingMing;
    let xunpanlaiyuan = respObj.xunpanlaiyuan; //两个字段一样
    let xunPanLeiXing = respObj.xunPanLeiXing;
    if (xunPanLeiXing != undefined && xunPanLeiXing != null && xunPanLeiXing != "") {
      xunpanlaiyuan = xunPanLeiXing;
    }
    if (xunpanlaiyuan == undefined || xunpanlaiyuan == "") {
      xunpanlaiyuan = 13;
    }
    let apiRes = extrequire("GT3734AT5.APIFunc.getEmunTxtApi").execute(null, JSON.stringify({ key: xunpanlaiyuan, emunURI: "developplatform.developplatform.Emun_XunPanLeiXing" }));
    let xunpanlaiyuanTxt = apiRes == null ? "" : apiRes;
    let SalesId = respObj.Sales;
    let SalesName = respObj.Sales_name;
    let SalesCode = respObj.Sales_code;
    let SalesRes = openLinker("POST", staffListUrl, "GT3734AT5", JSON.stringify({ id: SalesId, pageIndex: 1, pageSize: 10, name: SalesName, code: SalesCode }));
    let SalesDeptId = ""; //respObj.Sales_dept_id;
    let salesResObj = JSON.parse(SalesRes);
    if (salesResObj.code == 200) {
      if (salesResObj.data.recordCount > 0) {
        SalesDeptId = salesResObj.data.recordList[0].dept_id;
      }
    }
    let xunPanRenY = "";
    let shangJiXinXiList = respObj.ShangJiXinXiList;
    if (shangJiXinXiList != undefined && shangJiXinXiList.length > 0) {
      xunPanRenY = shangJiXinXiList[0].xunPanRenY == undefined ? "" : shangJiXinXiList[0].xunPanRenY;
    }
    let bodyObj = {
      data: {
        _status: "Insert", //操作标识, Insert:新增、Update:更新
        createOrg: org_id, //管理组织
        code: categoryCode + custCode, //客户编码(不能为空，新增会自动重新生成)
        name: { zh_CN: companyName },
        shortname: { zh_CN: companyName },
        enterpriseName: companyName,
        principals: [
          {
            professSalesman: SalesId,
            professSalesman_Name: SalesName,
            specialManagementDep: SalesDeptId,
            isDefault: true,
            _status: "Insert"
          }
        ],
        merchantAppliedDetail: {
          //业务信息
          taxRate: vat0,
          professSalesman: SalesId,
          professSalesman_Name: SalesName,
          stopstatus: false
        },
        taxPayingCategories: 0, //纳税类别, 0:一般纳税人、1:小规模纳税人、2:海外纳税、    示例：0
        customerClass: customerClass, //客户分类id--中国
        customerClass_code: categoryCode,
        customerClassErpCode: categoryCode,
        merchantOptions: false, //是否商家， true:是、false:否
        enterpriseNature: 0, //企业类型, 0:企业、1:个人、2:非营利组织
        extendCustomer: custId, //三合一参照
        extendCustomerId: custId,
        extendCustomerName: companyName,
        extendCustomerCode: custCode,
        extendZuZhiLeiBie: zuZhiLeiBie,
        address: address,
        extendgjdq: respObj.GuoJia, //国家
        extendkhxxlyqd: xunpanlaiyuanTxt, //客户信息来源渠道
        extendkhxxlysj: respObj.khxxlysj, //客户信息来源时间
        extendXunPanRenY: xunPanRenY,
        extendXunPanLeiXing: xunpanlaiyuan,
        "merchantDefine!define2": xunPanRenY,
        "merchantDefine!define4": resurgent, //公海转交人员
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
    let saveApiRes = openLinker("POST", saveUrl, "GT3734AT5", JSON.stringify(bodyObj)); //添加客户档案GZTBDM
    openLinker("POST", logToDBUrl, "GT3734AT5", JSON.stringify({ LogToDB: true, logModule: 9, description: "生成客户档案", reqt: jsonStr, resp: saveApiRes, usrName: usrName }));
    let saveApiResObj = JSON.parse(saveApiRes);
    if (saveApiResObj.code == 200) {
      //成功
      let sysCustId = saveApiResObj.data.id;
      let sysCustCode = saveApiResObj.data.code;
      //回写潜客关联档案
      let biObj = { id: custId, isRelated: true, autoRelated: true, merchant: sysCustId, relateArchTime: getNowDate() };
      let biRes = ObjectStore.updateById(gsURI, biObj, billNo, "developplatform");
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