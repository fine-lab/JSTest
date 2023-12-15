let AbstractAPIHandler = require("AbstractAPIHandler");
const getNowDate = (timeStamp) => {
  let date = new Date();
  if (timeStamp != undefined && timeStamp != null) {
    date = new Date(timeStamp);
  }
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
const getOrgId = (DOMAIN, custType) => {
  let orgId = "";
  if (includes(DOMAIN, "dbox")) {
    //测试
    if (includes(custType, "环保")) {
      orgId = "yourIdHere";
    } else if (includes(custType, "游乐")) {
      orgId = "yourIdHere";
    } else {
      orgId = "yourIdHere"; //建机
    }
  } else {
    //生产环境
    if (includes(custType, "环保")) {
      orgId = "yourIdHere";
    } else if (includes(custType, "游乐")) {
      orgId = "yourIdHere";
    } else {
      orgId = "yourIdHere";
    }
  }
  return orgId;
};
const getflowStepId = (flowStep) => {
  let flowStepId = 0;
  if (flowStep == "销售线索") {
    flowStepId = 0;
  } else if (flowStep == "建立联系") {
    flowStepId = 1;
  } else if (flowStep == "方案报价") {
    flowStepId = 2;
  } else if (flowStep == "客户认可") {
    flowStepId = 3;
  } else if (flowStep == "议价谈判") {
    flowStepId = 4;
  } else if (flowStep == "PI合同") {
    flowStepId = 5;
  } else if (flowStep == "订单交付") {
    flowStepId = 6;
  } else if (flowStep == "售后服务") {
    flowStepId = 7;
  } //0销售线索1建立联系2方案报价3客户认可4议价谈判5PI合同6订单交付7售后服务
  return flowStepId;
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let LogToDB = true;
    let APPCODE = "GT3734AT5";
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let mddUrl = DOMAIN + "/yonbip/hrcloud/staff/listmdd";
    let urlStr = "https://www.example.com/";
    let custCode = request.custCode;
    let custId = request.custId;
    let orgName = request.orgName;
    let billNo = "3199a3d6"; //合一潜客单据
    let gsURI = "GT3734AT5.GT3734AT5.GongSi"; //合一潜客URI
    let gsSuffix = "";
    if (orgName != undefined && orgName != null) {
      billNo = request.billNo;
      if (includes(orgName, "建机")) {
        gsSuffix = "_JJ";
      } else if (includes(orgName, "环保")) {
        gsSuffix = "_HB";
      } else if (includes(orgName, "游乐")) {
        gsSuffix = "_YL";
      } else {
        gsSuffix = "";
      }
      gsURI = gsURI + gsSuffix;
    }
    let funcRes = extrequire("GT3734AT5.ServiceFunc.getAccessToken").execute(null);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "调用接口获取AccessToken", reqt: "", resp: JSON.stringify(funcRes) })); //调用领域内函数写日志
    let accessToken = null;
    if (funcRes.rst) {
      accessToken = funcRes.accessToken;
    }
    if (accessToken == null || accessToken == "") {
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "AccessToken为空-无法对接富通", reqt: "", resp: "" })); //调用领域内函数写日志
      return { rst: false, msg: "未获取accessToken不能传递!" };
    }
    let bodyParam = {
      accessToken: accessToken,
      codeList: [custCode]
    };
    let apiResponse = postman("post", urlStr, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify(bodyParam));
    let rstObj = JSON.parse(apiResponse);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
      null,
      JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "调用富通接口获取客户信息", reqt: JSON.stringify(bodyParam), resp: apiResponse })
    ); //调用领域内函数写日志
    let nowTimeStr = getNowDate();
    let shiBaiYuanYin = "success";
    let tongBuZhuangTai = true;
    if (rstObj != null && (rstObj.code == 2 || !rstObj.success)) {
      //失败
      shiBaiYuanYin = rstObj.errMsg;
      tongBuZhuangTai = false;
    } else {
      //获取成功--可更新潜在客户档案
      if (rstObj.totalRecords == 0) {
        shiBaiYuanYin = "富通返回未查到客户【" + custCode + "】的档案";
        tongBuZhuangTai = false;
      } else {
        let custObj = rstObj.data[0]; //获取客户档案信息对象解析数据--TODO
        let biObj = { _status: "Insert", tongBuZhuangTai: true, remark: "【期初同步于富通】", laquShiJian: nowTimeStr };
        let name = custObj.name; //name : "Agada, James Oloko"
        let shortName = custObj.shortName; //shortName : "裂解尼日利亚Agada, James Oloko"
        let id = custObj.id; //id : "youridHere"
        //检测如果已入库就返回
        let queryCountRes = ObjectStore.queryByYonQL("select FTCode from " + gsURI + " where shiBaiYuanYin='" + id + "'");
        if (queryCountRes.length > 0) {
          tongBuZhuangTai = false;
          return { rst: tongBuZhuangTai, msg: "客户[" + custCode + "]已经存在(id:" + id + " & YS当前富通编码:" + queryCountRes[0].FTCode + "),不勾选'期初未同步'重试" };
        }
        let code = custObj.code; //富通客户编码 code : "0000092465"
        let region = custObj.region; //region : "尼日利亚"
        let source = custObj.source; //source : "优化"
        let type = custObj.type; //type : "环保D类客户：实力弱，购买潜能小"
        let operatorName = custObj.operatorName; //operatorName : "温晶"
        let webSite = custObj.webSite; //webSite : ""
        let attachmentList = custObj.attachmentList; //attachmentList : <null>
        let bankList = custObj.bankList; //bankList : <null>
        let address = custObj.address; //address : <null>
        if (address == null) {
          address = "";
        }
        if (address.length > 200) {
          address = substring(address, 0, 199);
          failReason = failReason + "[address过长：" + address + "]";
        }
        let addFrom = custObj.addFrom; //addFrom : 0
        let telephone = custObj.telephone; //telephone : "2347069541524"
        let updateTime = custObj.updateTime; //updateTime : 1631256565000
        let classification = custObj.classification; //classification : <null>
        let flowStep = custObj.flowStep; //flowStep : "销售线索"
        let contactList = custObj.contactList; //联系人
        let customerCustomizeList = custObj.customerCustomizeList; //自定义
        let status = custObj.status; //status : 0
        let mainProduct = custObj.mainProduct; //主营产品 mainProduct : "裂解设备"
        let productModel = ""; //----产品型号
        let createTime = custObj.createTime; // createTime: 1594260087000
        let xunPanRenYName = ""; //询盘人员姓名
        let xunPanRenY = "";
        for (var k in customerCustomizeList) {
          if (customerCustomizeList[k].customizeName == "产品型号") {
            productModel = customerCustomizeList[k].customizeValue; //型号
          } else if (customerCustomizeList[k].customizeName == "询盘来源") {
            xunPanRenYName = customerCustomizeList[k].customizeValue;
            if (productModel != "") {
              break;
            }
          }
        }
        if (xunPanRenYName != "") {
          let mddResp0 = openLinker("POST", DOMAIN + "/yonbip/hrcloud/staff/listmdd", APPCODE, JSON.stringify({ pageIndex: 1, pageSize: 10, name: xunPanRenYName }));
          let respObj0 = JSON.parse(mddResp0);
          if (respObj0.code == 200) {
            let recordList = respObj0.data.recordList;
            if (recordList.length > 0) {
              xunPanRenY = recordList[0].id;
            }
          }
        }
        let mainProductId = "";
        let zuZhiLeiBie = 1;
        if (includes(type, "环保") || includes(type, "百特")) {
          zuZhiLeiBie = 2;
        } else if (includes(type, "游乐") || includes(type, "中豫")) {
          zuZhiLeiBie = 3;
        }
        biObj.zhuyingyewu = mainProduct;
        let queryProductSql = "select * from GT3734AT5.GT3734AT5.ProductCatagory where productName='" + mainProduct + "' and zuZhiLeiBie='" + zuZhiLeiBie + "'";
        let queryProductRes = ObjectStore.queryByYonQL(queryProductSql);
        if (queryProductRes.length > 0) {
          mainProductId = queryProductRes[0].id;
        }
        if (source == "Alibaba询盘（修）") {
          source = "阿里巴巴(含RFQ)";
        }
        let xunpanlaiyuan = extrequire("GT3734AT5.APIFunc.getEmunTxtApi").execute(null, JSON.stringify({ key: "", txt: source, emunURI: "developplatform.developplatform.Emun_XunPanLeiXing" }));
        biObj.remark = biObj.remark + "[询盘来源:" + source + "]";
        let GuoJia = ""; //------国家ID
        let queryGuoJia = ObjectStore.queryByYonQL("select id from GT3734AT5.GT3734AT5.GuoJiaDangAnXinXi where guoJiaMingCheng='" + region + "'");
        if (queryGuoJia.length > 0) {
          GuoJia = queryGuoJia[0].id;
        }
        if (GuoJia == "" && region != "") {
          biObj.remark = biObj.remark + "[原国家地区:" + region + "]";
        }
        let Sales = ""; //-----业务员
        let mddResp = openLinker("POST", DOMAIN + "/yonbip/hrcloud/staff/listmdd", APPCODE, JSON.stringify({ pageIndex: 1, pageSize: 10, name: operatorName }));
        let respObj = JSON.parse(mddResp);
        if (respObj.code == 200) {
          let recordList = respObj.data.recordList;
          if (recordList.length > 0) {
            Sales = recordList[0].id;
          }
        }
        if (Sales == "" && operatorName != "") {
          biObj.remark = biObj.remark + "[原业务员:" + operatorName + "]";
        }
        biObj.MingChen = name;
        biObj.GuoJia = GuoJia;
        biObj.flowStep = flowStep;
        biObj.Sales = Sales;
        biObj.address = address;
        biObj.WangZhi = webSite;
        biObj.shiBaiYuanYin = id;
        biObj.FTCode = code;
        biObj.telephone = telephone;
        biObj.khxxlysj = getNowDate(createTime);
        biObj.custType = type;
        biObj.org_id = getOrgId(DOMAIN, type);
        biObj.productModel = productModel;
        biObj.xunPanLeiXing = xunpanlaiyuan; //询盘类型/客户来源
        biObj.xunpanlaiyuan = xunpanlaiyuan;
        biObj.pageNum = 0;
        biObj.ShangJiXinXiList = [
          {
            hasDefaultInit: true,
            _status: "Insert",
            code: code,
            ShangJiBianMa: code + "-01",
            ShangJiMingCheng: shortName,
            xuQiuChanPin: mainProductId,
            xunPanRenY: xunPanRenY,
            XunPanXXCode: "",
            XunPanXXId: "",
            ShangJiJieDuan: getflowStepId(flowStep) //0销售线索1建立联系2方案报价3客户认可4议价谈判5PI合同6订单交付7售后服务
          }
        ];
        let LianXiRenXinXiList = [];
        if (contactList != null) {
          for (var k in contactList) {
            let contactObj = contactList[k];
            let emailArray = contactObj.email;
            let email = "";
            if (emailArray != null && emailArray.length > 0) {
              email = emailArray[0];
            }
            if (email != "" && email.length > 50) {
              let mkstr = biObj.remark + "[email:" + email + "]";
              if (mkstr.length < 200) {
                biObj.remark = mkstr;
              }
              email = substring(email, 0, 49);
            }
            let telephone = contactObj.telephone;
            let mobile = contactObj.mobile;
            if (telephone != undefined && telephone != "" && telephone.length > 50) {
              let mkstr = biObj.remark + "[tel:" + telephone + "]";
              if (mkstr.length < 200) {
                biObj.remark = mkstr;
              }
              telephone = substring(telephone, 0, 49);
            }
            LianXiRenXinXiList.push({
              hasDefaultInit: true,
              _status: "Insert",
              XingMing: contactObj.name,
              DianHua: telephone,
              mobile: contactObj.mobile,
              YouXiang: email,
              FTID: contactObj.id,
              KeyContacts: true
            });
          }
        }
        biObj.LianXiRenXinXiList = LianXiRenXinXiList;
        if (gsSuffix == "_JJ") {
          biObj.LianXiRenXinXi_JJList = LianXiRenXinXiList;
          biObj.ShangJiXinXi_JJList = biObj.ShangJiXinXiList;
        } else if (gsSuffix == "_HB") {
          biObj.LianXiRenXinXi_HBList = LianXiRenXinXiList;
          biObj.ShangJiXinXi_HBList = biObj.ShangJiXinXiList;
        } else {
          //游乐
          biObj.LianXiRenXinXi_YLList = LianXiRenXinXiList;
          biObj.ShangJiXinXi_YLList = biObj.ShangJiXinXiList;
        }
        let biRes = ObjectStore.insert(gsURI, biObj, billNo);
        let gsCode = "";
        if (biRes == null || biRes.id == undefined || biRes.id == "") {
          isSuccess = false;
          failReason = JSON.stringify(biRes);
        } else {
          gsCode = biRes.code;
          let gsShangJiId = "";
          if (gsSuffix == "_JJ") {
            gsShangJiId = biRes.ShangJiXinXi_JJList[0].id;
          } else if (gsSuffix == "_HB") {
            gsShangJiId = biRes.ShangJiXinXi_HBList[0].id;
          } else {
            gsShangJiId = biRes.ShangJiXinXi_YLList[0].id;
          }
          let ShangJiXinXiList = [{ id: gsShangJiId, _status: "Update", ShangJiBianMa: gsCode + "-01", code: gsCode }];
          let updObj = { id: biRes.id };
          if (gsSuffix == "_JJ") {
            updObj.ShangJiXinXi_JJList = ShangJiXinXiList;
          } else if (gsSuffix == "_HB") {
            updObj.ShangJiXinXi_HBList = ShangJiXinXiList;
          } else {
            updObj.ShangJiXinXi_YLList = ShangJiXinXiList;
          }
          ObjectStore.updateById(gsURI, updObj, billNo);
        }
      }
    }
    return { rst: tongBuZhuangTai, msg: shiBaiYuanYin };
  }
}
exports({ entryPoint: MyAPIHandler });