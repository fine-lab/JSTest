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
    let batchNum = 1;
    let submitBatchNum = 20;
    let billNo_JJ = "cfacef1b"; //建机
    let billNo_HB = "3b68cf65"; //环保
    let billNo_YL = "6cfb76da"; //游乐
    let billNo_NOrg = "6f9d09cb"; //无组织
    let APPCODE = "GT3734AT5";
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let urlStr = DOMAIN + "/yonbip/digitalModel/merchant/detail";
    let queryDelLogRes = ObjectStore.queryByYonQL("select * from GT3734AT5.GT3734AT5.FTCustArchives where isExecued=0 or isExecued is null   order by pageNum limit " + batchNum, "developplatform"); //pageNum<=1500 and (
    let clearFlag = false;
    if (clearFlag) {
      //清理处理标识--重传
      let ObjArray = [];
      for (var i in queryDelLogRes) {
        let dataObj = queryDelLogRes[i];
        let synId = dataObj.id;
        ObjArray.push({ id: synId, isExecued: false });
      }
      if (ObjArray.length > 0) {
        ObjectStore.updateBatch("GT3734AT5.GT3734AT5.FTCustArchives", ObjArray, "26bac260");
      }
      return;
    }
    if (true) {
      for (var i in queryDelLogRes) {
        let submitArray = [];
        let dataObj = queryDelLogRes[i];
        let synId = dataObj.id;
        let synContent = dataObj.synContent;
        let synContentObj = JSON.parse(synContent);
        let synContentList = synContentObj.data;
        let pageNum = dataObj.pageNum;
        let jjObjArray = [];
        let hbObjArray = [];
        let ylObjArray = [];
        let noOrgObjArray = [];
        let insertTime = getNowDate();
        let remark = dataObj.remark;
        let halfFlag = 0;
        if (remark == undefined || remark == null || remark == "") {
          halfFlag = 0;
        } else {
          halfFlag = 1;
        }
        let size = synContentList.length;
        if (halfFlag == 0) {
          size = size > 50 ? 50 : size;
        } else {
          if (size <= 50) {
            ObjectStore.updateById("GT3734AT5.GT3734AT5.FTCustArchives", { id: synId, isExecued: true, exeTime: getNowDate(), remark: "halfFlag" }, "26bac260");
            continue;
          }
        }
        for (var j = 50 * halfFlag; j < size; j++) {
          let custObj = synContentList[j];
          let type = custObj.type;
          let name = custObj.name; //name : "Agada, James Oloko"
          let region = custObj.region; //region : "尼日利亚"
          let source = custObj.source; //source : "优化"
          let operatorName = custObj.operatorName; //operatorName : "温晶"
          let tmpObj = {
            synContent: JSON.stringify(custObj),
            FTCode: custObj.code,
            type: type,
            name: name,
            region: region,
            source: source,
            operatorName: operatorName,
            insertTime: insertTime,
            pageNum: pageNum,
            idx: j + 1
          };
          let zuZhiLeiBie = 1; //建机
          let billno = "";
          if (includes(type, "环保") || includes(type, "百特")) {
            zuZhiLeiBie = 2;
            billno = billNo_HB;
            hbObjArray.push(tmpObj);
          } else if (includes(type, "游乐") || includes(type, "中豫")) {
            zuZhiLeiBie = 3;
            billno = billNo_YL;
            ylObjArray.push(tmpObj);
          } else if (includes(type, "建机")) {
            zuZhiLeiBie = 1; //建机
            billno = billNo_JJ;
            jjObjArray.push(tmpObj);
          } else {
            //无组织
            billno = billNo_NOrg;
            noOrgObjArray.push(tmpObj);
          }
          if (jjObjArray.length == submitBatchNum) {
            let batchRes = ObjectStore.insertBatch("GT3734AT5.GT3734AT5.FTCustFJJ", jjObjArray, billNo_JJ);
            jjObjArray = [];
          }
          if (hbObjArray.length == submitBatchNum) {
            let batchRes = ObjectStore.insertBatch("GT3734AT5.GT3734AT5.FTCustFHB", hbObjArray, billNo_HB);
            hbObjArray = [];
          }
          if (ylObjArray.length == submitBatchNum) {
            let batchRes = ObjectStore.insertBatch("GT3734AT5.GT3734AT5.FTCustFYL", ylObjArray, billNo_YL);
            ylObjArray = [];
          }
          if (noOrgObjArray.length == 0) {
            let batchRes = ObjectStore.insertBatch("GT3734AT5.GT3734AT5.FTCustNOrg", noOrgObjArray, billNo_NOrg);
            noOrgObjArray = [];
          }
        }
        if (jjObjArray.length > 0) {
          let batchRes = ObjectStore.insertBatch("GT3734AT5.GT3734AT5.FTCustFJJ", jjObjArray, billNo_JJ);
        }
        if (hbObjArray.length > 0) {
          let batchRes = ObjectStore.insertBatch("GT3734AT5.GT3734AT5.FTCustFHB", hbObjArray, billNo_HB);
        }
        if (ylObjArray.length > 0) {
          let batchRes = ObjectStore.insertBatch("GT3734AT5.GT3734AT5.FTCustFYL", ylObjArray, billNo_YL);
        }
        if (noOrgObjArray.length > 0) {
          let batchRes = ObjectStore.insertBatch("GT3734AT5.GT3734AT5.FTCustNOrg", noOrgObjArray, billNo_NOrg);
        }
        ObjectStore.updateById(
          "GT3734AT5.GT3734AT5.FTCustArchives",
          { id: synId, isExecued: !(halfFlag == 0), exeTime: getNowDate(), remark: halfFlag == 0 ? "halfFlag" : "all", _status: "Update" },
          "26bac260"
        );
      }
      return;
    }
    for (var i in queryDelLogRes) {
      let submitArray = [];
      let dataObj = queryDelLogRes[i];
      let synId = dataObj.id;
      let synContent = dataObj.synContent;
      let synContentObj = JSON.parse(synContent);
      let synContentList = synContentObj.data;
      let pageNum = dataObj.pageNum;
      let halfFlag = dataObj.halfFlag;
      if (halfFlag == null || halfFlag == "") {
        halfFlag = 0;
      }
      let size = synContentList.length;
      if (halfFlag == 0) {
        size = size > 50 ? 50 : size;
      } else {
        if (size <= 50) {
          ObjectStore.updateById("GT3734AT5.GT3734AT5.FTCustArchives", { id: synId, isExecued: true, exeTime: getNowDate(), halfFlag: 2 }, "26bac260");
          continue;
        }
      }
      for (var j = halfFlag * 50; j < size; j++) {
        let custObj = synContentList[j];
        let nowTimeStr = getNowDate();
        let biObj = { _status: "Insert", tongBuZhuangTai: true, remark: "【期初同步于富通】", laquShiJian: nowTimeStr };
        let name = custObj.name; //name : "Agada, James Oloko"
        let shortName = custObj.shortName; //shortName : "裂解尼日利亚Agada, James Oloko"
        let id = custObj.id; //id : "youridHere"
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
        let zuZhiLeiBie = 1;
        if (includes(type, "环保") || includes(type, "百特")) {
          zuZhiLeiBie = 2;
        } else if (includes(type, "游乐") || includes(type, "中豫")) {
          zuZhiLeiBie = 3;
        }
        let queryProductSql = "select * from GT3734AT5.GT3734AT5.ProductCatagory where productName='" + mainProduct + "' and zuZhiLeiBie='" + zuZhiLeiBie + "'";
        let queryProductRes = ObjectStore.queryByYonQL(queryProductSql);
        if (queryProductRes.length > 0) {
          mainProductId = queryProductRes[0].id;
        }
        if (source == "Alibaba询盘（修）") {
          source = "阿里巴巴(含RFQ)";
        }
        let xunpanlaiyuan = extrequire("GT3734AT5.APIFunc.getEmunTxtApi").execute(null, JSON.stringify({ key: "", txt: source, emunURI: "developplatform.developplatform.Emun_XunPanLeiXing" }));
        let GuoJia = ""; //------国家ID
        let queryGuoJia = ObjectStore.queryByYonQL("select id from GT3734AT5.GT3734AT5.GuoJiaDangAnXinXi where guoJiaMingCheng='" + region + "'");
        if (queryGuoJia.length > 0) {
          GuoJia = queryGuoJia[0].id;
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
            let telephone = contactObj.telephone;
            let mobile = contactObj.mobile;
            LianXiRenXinXiList.push({
              hasDefaultInit: true,
              _status: "Insert",
              XingMing: contactObj.name,
              DianHua: contactObj.telephone,
              mobile: contactObj.mobile,
              YouXiang: email,
              ZongJiaoXinYang: "", //宗教信仰
              JiaTingQingKuang: "", //家庭情况
              HunYinZhuangKuang: "", //婚姻状况
              AiHao: "", //爱好
              XingGe: "", //性格
              GouTongFengGe: "", //沟通风格
              QiTa: "", //其它
              FTID: contactObj.id,
              KeyContacts: true
            });
          }
        }
        biObj.LianXiRenXinXiList = LianXiRenXinXiList;
        submitArray.push(biObj);
        if (submitArray.length == batchNum) {
          let batchRes = ObjectStore.insertBatch("GT3734AT5.GT3734AT5.GongSi", submitArray, "3199a3d6");
          submitArray = [];
          break;
        }
      }
      if (submitArray.length > 0) {
        let batchRes = ObjectStore.insertBatch("GT3734AT5.GT3734AT5.GongSi", submitArray, "3199a3d6");
        submitArray = [];
      }
      ObjectStore.updateById("GT3734AT5.GT3734AT5.FTCustArchives", { id: synId, isExecued: !(halfFlag == 0), exeTime: getNowDate(), halfFlag: halfFlag == 0 ? 1 : 2 }, "26bac260");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });