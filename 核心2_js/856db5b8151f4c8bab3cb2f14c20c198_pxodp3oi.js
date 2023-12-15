let AbstractTrigger = require("AbstractTrigger");
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
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let batchNum = 20;
    let APPCODE = "GT3734AT5";
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    if (param == undefined || param == null) {
      return;
    }
    let sybType = param.type; //事业部类别 -建机/环保/游乐
    let sortMode = param.sortMode; //排序
    if (sortMode == undefined || sortMode == null || sortMode == "asc") {
      sortMode = "asc";
    } else {
      sortMode = "desc";
    }
    let objURI = "";
    let billNo = "";
    let srcURI = "GT3734AT5.GT3734AT5.FTCustNOrg";
    let srcBillNo = "6f9d09cb";
    let billNo_JJ = "cfacef1b"; //建机
    let billNo_HB = "3b68cf65"; //环保
    let billNo_YL = "6cfb76da"; //游乐
    let billNo_NOrg = "6f9d09cb"; //无组织
    let orgSuffix = "";
    let num = param.num;
    if (num != undefined) {
      batchNum = num;
    }
    let urlStr = DOMAIN + "/yonbip/digitalModel/merchant/detail";
    let querySql = "select * from GT3734AT5.GT3734AT5.FTCustNOrg where isExecued=0 or isExecued is null  order by pubts " + sortMode + ",id limit " + batchNum;
    let queryRes = ObjectStore.queryByYonQL(querySql, "developplatform");
    for (var i in queryRes) {
      let dataObj = queryRes[i];
      let synId = dataObj.id;
      let synContent = dataObj.synContent;
      let custObj = JSON.parse(synContent);
      let failReason = "";
      let isSuccess = true;
      let pageNum = dataObj.pageNum;
      let nowTimeStr = getNowDate();
      let biObj = { _status: "Insert", tongBuZhuangTai: true, remark: "【期初同步于富通-无组织】", laquShiJian: nowTimeStr };
      let name = custObj.name; //name : "Agada, James Oloko"
      let shortName = custObj.shortName; //shortName : "裂解尼日利亚Agada, James Oloko"
      let id = custObj.id; //id : "youridHere"
      let code = custObj.code; //富通客户编码 code : "0000092465"
      let region = custObj.region; //region : "尼日利亚"
      let source = custObj.source; //source : "优化"
      let type = custObj.type; //type : "环保D类客户：实力弱，购买潜能小"
      let operatorName = custObj.operatorName; //operatorName : "温晶"
      let zuZhiLeiBie = 1;
      if (operatorName == "刘雪玲" || operatorName == "孙伟" || operatorName == "张岩" || operatorName == "胡冉冉" || operatorName == "张岩") {
        //建机
        objURI = "GT3734AT5.GT3734AT5.GongSi_JJ";
        billNo = "b979b0e9";
        srcURI = "GT3734AT5.GT3734AT5.FTCustFJJ";
        srcBillNo = billNo_JJ;
        orgSuffix = "JJ";
        type = "建机未建档客户";
        zuZhiLeiBie = 1;
        sybType = "建机";
      } else if (operatorName == "闵星") {
        //环保
        objURI = "GT3734AT5.GT3734AT5.GongSi_HB";
        billNo = "7b52cdac";
        srcURI = "GT3734AT5.GT3734AT5.FTCustFHB";
        srcBillNo = billNo_HB;
        orgSuffix = "HB";
        type = "环保未建档客户";
        zuZhiLeiBie = 2;
        sybType = "环保";
      } else if (
        operatorName == "郭芳" ||
        operatorName == "黄闪闪" ||
        operatorName == "岳远哲" ||
        operatorName == "张卉" ||
        operatorName == "张真真" ||
        operatorName == "罗培培" ||
        operatorName == "罗蓉" ||
        operatorName == "位帅" ||
        operatorName == "余曼鑫"
      ) {
        //游乐
        objURI = "GT3734AT5.GT3734AT5.GongSi_YL";
        billNo = "04a3e644";
        srcURI = "GT3734AT5.GT3734AT5.FTCustFYL";
        srcBillNo = billNo_YL;
        orgSuffix = "YL";
        type = "游乐未建档客户";
        zuZhiLeiBie = 3;
        sybType = "游乐";
      } else {
        ObjectStore.updateById(srcURI, { id: synId, isExecued: true, execTme: nowTimeStr, isSuccess: false, failReason: "未有对应归属组织" }, srcBillNo);
        continue;
      }
      srcBillNo = "6f9d09cb";
      srcURI = "GT3734AT5.GT3734AT5.FTCustNOrg";
      //检测如果已入库就返回
      let queryCountRes = ObjectStore.queryByYonQL("select count(1) as custCount from " + objURI + " where shiBaiYuanYin='" + id + "'");
      if (queryCountRes[0].custCount > 0) {
        ObjectStore.updateById(srcURI, { id: synId, isExecued: true, execTme: nowTimeStr, isSuccess: false, failReason: "ID冲突[" + id + "]" }, srcBillNo);
        continue;
      }
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
      for (var k in customerCustomizeList) {
        if (customerCustomizeList[k].customizeName == "产品型号") {
          productModel = customerCustomizeList[k].customizeValue; //型号
          break;
        }
      }
      let mainProductId = "";
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
      biObj.pageNum = pageNum;
      biObj.ShangJiXinXiList = [
        {
          hasDefaultInit: true,
          _status: "Insert",
          code: code,
          ShangJiBianMa: code + "-01",
          ShangJiMingCheng: shortName,
          xuQiuChanPin: mainProductId,
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
      if (sybType == "建机") {
        biObj.LianXiRenXinXi_JJList = LianXiRenXinXiList;
        biObj.ShangJiXinXi_JJList = biObj.ShangJiXinXiList;
      } else if (sybType == "环保") {
        biObj.LianXiRenXinXi_HBList = LianXiRenXinXiList;
        biObj.ShangJiXinXi_HBList = biObj.ShangJiXinXiList;
      } else {
        //游乐
        biObj.LianXiRenXinXi_YLList = LianXiRenXinXiList;
        biObj.ShangJiXinXi_YLList = biObj.ShangJiXinXiList;
      }
      let biRes = ObjectStore.insert(objURI, biObj, billNo);
      let gsCode = "";
      if (biRes == null || biRes.id == undefined || biRes.id == "") {
        isSuccess = false;
        failReason = JSON.stringify(biRes);
      } else {
        gsCode = biRes.code;
        let gsShangJiId = "";
        if (sybType == "建机") {
          gsShangJiId = biRes.ShangJiXinXi_JJList[0].id;
        } else if (sybType == "环保") {
          gsShangJiId = biRes.ShangJiXinXi_HBList[0].id;
        } else {
          gsShangJiId = biRes.ShangJiXinXi_YLList[0].id;
        }
        let ShangJiXinXiList = [{ id: gsShangJiId, _status: "Update", ShangJiBianMa: gsCode + "-01", code: gsCode }];
        let updObj = { id: biRes.id };
        if (sybType == "建机") {
          updObj.ShangJiXinXi_JJList = ShangJiXinXiList;
        } else if (sybType == "环保") {
          updObj.ShangJiXinXi_HBList = ShangJiXinXiList;
        } else {
          updObj.ShangJiXinXi_YLList = ShangJiXinXiList;
        }
        ObjectStore.updateById(objURI, updObj, billNo);
      }
      ObjectStore.updateById(srcURI, { id: synId, isExecued: true, execTme: nowTimeStr, isSuccess: isSuccess, failReason: failReason, remark: gsCode }, srcBillNo);
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });