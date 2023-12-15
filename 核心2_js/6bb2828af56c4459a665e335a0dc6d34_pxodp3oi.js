let AbstractTrigger = require("AbstractTrigger");
const getNowDate = (num, idx) => {
  let offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
  let offset_timeStamp = offset_GMT * 60 * 1000 + 8 * 60 * 60 * 1000;
  let date = new Date(new Date().getTime() + offset_timeStamp);
  if (idx == 2) {
    date = new Date(date.getTime() + 86400000 * num);
  } else if (idx == 1) {
    date = new Date(offset_timeStamp + num);
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
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let LogToDB = false; //日志关闭
    let pageSize = 10;
    let pageNum = 1;
    let lastPageNum = 1;
    let ftNewTime = "";
    let APPCODE = "GT3734AT5";
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let mddUrl = DOMAIN + "/yonbip/hrcloud/staff/listmdd";
    let urlStr = "https://www.example.com/";
    let ftSyncRst = ObjectStore.queryByYonQL("select * from GT3734AT5.GT3734AT5.autoUpdateFromFT order by ftNewTime desc,idx desc limit 1", "developplatform");
    let queryConditions = "";
    if (ftSyncRst.length > 0) {
      let ftSyncObj = ftSyncRst[0];
      ftNewTime = ftSyncObj.ftNewTime;
      let lastFTId = ftSyncObj.lastFTId;
      lastPageNum = ftSyncObj.pageNum;
      if (lastPageNum == undefined || lastPageNum == null || lastPageNum == "" || lastPageNum == 0) {
        lastPageNum = 1;
      }
      queryConditions = ftNewTime;
    } else {
      queryConditions = getNowDate(-1, 2); //从提前一天查起
    }
    let funcRes = extrequire("GT3734AT5.ServiceFunc.getAccessToken").execute(null);
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
      sortField: "updateTime",
      sortMode: "asc",
      updateDateStart: queryConditions,
      size: pageSize,
      num: lastPageNum
    };
    let apiResponse = postman("post", urlStr, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify(bodyParam));
    let rstObj = JSON.parse(apiResponse);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
      null,
      JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "调用富通接口获取客户信息", reqt: JSON.stringify(bodyParam), resp: apiResponse })
    ); //调用领域内函数写日志
    let nowTimeStr = getNowDate(0, 0);
    let shiBaiYuanYin = "success";
    let tongBuZhuangTai = true;
    let nowFTCustomerUpdTime = "";
    let nowFTCustomerUpdUUID = "";
    let nowFTCustomerUpdTimeStr = "";
    if (rstObj != null && (rstObj.code == 2 || !rstObj.success)) {
      //失败
      shiBaiYuanYin = rstObj.errMsg;
      tongBuZhuangTai = false;
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: true, logModule: 1, description: "自动同步数据-调用富通接口获取客户信息-异常", reqt: JSON.stringify(bodyParam), resp: apiResponse })
      ); //调用领域内函数写日志
    } else {
      //获取成功--可更新潜在客户档案
      if (rstObj.totalRecords == 0) {
        //没有数据
        return { rst: true, msg: "没有更新数据记录" };
      }
      let ftCustomerList = rstObj.data;
      let gsURI = "GT3734AT5.GT3734AT5.GongSi"; //合一潜客URI
      for (var i in ftCustomerList) {
        let custObj = ftCustomerList[i];
        let source = custObj.source; //客户来源--eg：优化
        let type = custObj.type; //type : "环保D类客户：实力弱，购买潜能小"
        let ftuuid = custObj.id;
        if (type == undefined || type == null || type == "") {
          continue;
        }
        let billNo = "3199a3d6"; //合一潜客单据
        let gsSuffix = "";
        if (includes(type, "建机")) {
          gsSuffix = "_JJ";
          billNo = "b979b0e9";
        } else if (includes(type, "环保")) {
          gsSuffix = "_HB";
          billNo = "7b52cdac";
        } else if (includes(type, "游乐")) {
          gsSuffix = "_YL";
          billNo = "04a3e644";
        } else {
          continue;
        }
        gsURI + gsSuffix;
        let queryGSSql =
          "select *,(select * from LianXiRenXinXi" +
          gsSuffix +
          "List) as LianXiRenXinXiList,(select * from ShangJiXinXi" +
          gsSuffix +
          "List) as ShangJiXinXiList,Sales.name,GuoJia.guoJiaMingCheng from GT3734AT5.GT3734AT5.GongSi" +
          gsSuffix +
          " where shiBaiYuanYin='" +
          ftuuid +
          "'";
        let queryRes = ObjectStore.queryByYonQL(queryGSSql, "developplatform");
        if (queryRes.length == 0) {
          //没有查到对应的客户信息
          continue;
        }
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "自动同步-查询", reqt: queryGSSql, resp: JSON.stringify(queryRes) })); //调用领域内函数写日志
        let ysCustomerObj = queryRes[0];
        let custId = ysCustomerObj.id;
        let MingChen = ysCustomerObj.MingChen;
        let GuoJia_guoJiaMingCheng = ysCustomerObj.GuoJia_guoJiaMingCheng;
        let Sales_name = ysCustomerObj.Sales_name;
        let LianXiRenXinXiList = ysCustomerObj.LianXiRenXinXiList;
        let ShangJiXinXiList = ysCustomerObj.ShangJiXinXiList;
        //更新YS中客户
        let name = custObj.name; //客户名称
        let shortName = custObj.shortName; //shortName : "裂解尼日利亚Agada, James Oloko"
        let code = custObj.code; //富通客户编码 code : "0000092465"
        let region = custObj.region; //国家名称
        let operatorName = custObj.operatorName; //业务员名字 : "温晶"
        let webSite = custObj.webSite; //webSite : ""
        let attachmentList = custObj.attachmentList; //attachmentList : <null>
        let bankList = custObj.bankList; //bankList : <null>
        let address = custObj.address; //address : <null>
        if (address == undefined || address == null) {
          address = "";
        }
        let failReason = "";
        if (address != null && address.length > 200) {
          address = substring(address, 0, 199);
          failReason = failReason + "[address过长：" + address + "]";
        }
        let flowStep = custObj.flowStep; //跟进阶段 --建立联系/资料获得...flowStep : "销售线索"
        let telephone = custObj.telephone; //telephone : "2347069541524"
        let updateTime = custObj.updateTime; //updateTime : 1631256565000
        if (updateTime > 9999999999) {
        }
        let updateTimeStr = getNowDate(updateTime, 1);
        let classification = custObj.classification; //classification : <null>
        let contactList = custObj.contactList; //联系人
        let customerCustomizeList = custObj.customerCustomizeList; //自定义
        let status = custObj.status; //status : 0
        let mainProduct = custObj.mainProduct; //主营产品 mainProduct : "裂解设备"
        let productModel = ""; //----产品型号
        let createTime = custObj.createTime; // createTime: 1594260087000
        //询盘来源&合作状态 都是在自定义项中，这里不需要同步
        let xunPanRenYName = ""; //询盘人员姓名
        let xunPanRenY = "";
        let resurgentName = ""; //公海转交人员
        let resurgentId = "";
        for (var k in customerCustomizeList) {
          if (customerCustomizeList[k].customizeName == "产品型号") {
            productModel = customerCustomizeList[k].customizeValue; //型号
          } else if (customerCustomizeList[k].customizeName == "询盘来源") {
            xunPanRenYName = customerCustomizeList[k].customizeValue;
            if (productModel != "") {
            }
          } else if (customerCustomizeList[k].customizeName == "公海转交人员") {
            resurgentName = customerCustomizeList[k].customizeValue;
            if (resurgentName != undefined && resurgentName != null && resurgentName != "") {
              let staffRes = ObjectStore.queryByYonQL("select id,name,code,user_id,sex,mobile from bd.staff.StaffNew where name = '" + resurgentName + "'", "ucf-staff-center");
              if (staffRes.length > 0) {
                resurgentId = staffRes[0].id;
              }
            }
          }
        }
        let YSxunPanRenY = "";
        if (ShangJiXinXiList != null && ShangJiXinXiList.length > 0) {
          YSxunPanRenY = ShangJiXinXiList[0].xunPanRenY;
          if (YSxunPanRenY == undefined || YSxunPanRenY == null) {
            YSxunPanRenY = "";
          }
        }
        //询盘人不需要更新--正常的话是从YS->富通
        if (xunPanRenYName != null && xunPanRenYName != "" && YSxunPanRenY == "") {
          let staffSql = "select id,name,code,user_id,sex,mobile from bd.staff.StaffNew where name like '" + xunPanRenYName + "'";
          let staffRes = ObjectStore.queryByYonQL(staffSql, "ucf-staff-center");
          extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
            null,
            JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "自动同步-根据xunPanRenYName获取询盘-DB", reqt: staffSql, resp: JSON.stringify(staffRes) })
          );
          if (staffRes.length > 0) {
            for (var m in staffRes) {
              let staffObj = staffRes[m];
              if (staffObj.name == xunPanRenYName) {
                xunPanRenY = staffObj.id;
                break;
              }
            }
            if (xunPanRenY == "") {
              xunPanRenY = staffRes[0].id;
            }
          }
        }
        let mainProductId = "";
        let mainProductPId = "";
        let zuZhiLeiBie = 1;
        if (includes(type, "环保") || includes(type, "百特")) {
          zuZhiLeiBie = 2;
        } else if (includes(type, "游乐") || includes(type, "中豫")) {
          zuZhiLeiBie = 3;
        }
        if (mainProduct != undefined && mainProduct != null && mainProduct != "") {
          let queryProductSql = "select * from GT3734AT5.GT3734AT5.ProductCatagory where productName='" + mainProduct + "' and zuZhiLeiBie='" + zuZhiLeiBie + "'";
          let queryProductRes = ObjectStore.queryByYonQL(queryProductSql);
          if (queryProductRes != undefined && queryProductRes.length > 0) {
            mainProductId = queryProductRes[0].id;
          }
        }
        if (mainProduct != undefined && mainProduct != null && mainProduct != "") {
          let queryProductSql = "select id,parent from pc.cls.ManagementClass where name='" + mainProduct + "'";
          let queryProductRes = ObjectStore.queryByYonQL(queryProductSql, "productcenter");
          if (queryProductRes != undefined && queryProductRes.length > 0) {
            mainProductId = queryProductRes[0].id;
            mainProductPId = queryProductRes[0].parent;
          }
        }
        if (source == "Alibaba询盘（修）") {
          source = "阿里巴巴(含RFQ)";
        }
        //更新潜在客户单据信息
        let biObj = { id: custId, flowStep: flowStep, custType: type, FTCode: code, zhuyingyewu: mainProduct, laquShiJian: nowTimeStr, resurgent: resurgentId };
        if (MingChen != name) {
          //客户名称变更
          biObj.MingChen = name;
        }
        if (GuoJia_guoJiaMingCheng != region) {
          //国家变更
          let queryGuoJia = ObjectStore.queryByYonQL("select id from GT3734AT5.GT3734AT5.GuoJiaDangAnXinXi where guoJiaMingCheng='" + region + "'");
          if (queryGuoJia.length > 0) {
            biObj.GuoJia = queryGuoJia[0].id;
          }
        }
        if (Sales_name == undefined || Sales_name == null || Sales_name == "" || Sales_name != operatorName) {
          //业务员变更了-- 获取业务员ID
          let staffSql = "select id,name,code,user_id,sex,mobile from bd.staff.StaffNew where name like '" + operatorName + "'";
          let staffRes = ObjectStore.queryByYonQL(staffSql, "ucf-staff-center");
          extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
            null,
            JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "自动同步-根据operatorName获取业务员-DB", reqt: staffSql, resp: JSON.stringify(staffRes) })
          );
          if (staffRes.length > 0) {
            for (var m in staffRes) {
              let staffObj = staffRes[m];
              if (staffObj.name == operatorName) {
                biObj.Sales = staffObj.id;
                break;
              }
            }
            if (biObj.Sales == undefined || biObj.Sales == null || biObj.Sales == "") {
              biObj.Sales = staffRes[0].id;
            }
          }
        }
        if (productModel != "") {
        }
        var getDbLxrObj = (LianXiRenXinXiList, contactId, i, contactListSize) => {
          if (LianXiRenXinXiList == undefined || LianXiRenXinXiList == null || LianXiRenXinXiList.length == 0) {
            return { _status: "Insert", GongSi_id: custId, FTID: contactId, GongSi_JJ_id: custId, GongSi_HB_id: custId, GongSi_YL_id: custId };
          }
          for (var k in LianXiRenXinXiList) {
            let lxr = LianXiRenXinXiList[k];
            if (lxr.FTID != undefined && lxr.FTID == contactId) {
              if (gsSuffix == "_JJ") {
                return { id: lxr.id, _status: "Update", GongSi_JJ_id: lxr.GongSi_JJ_id, FTID: contactId };
              } else if (gsSuffix == "_HB") {
                return { id: lxr.id, _status: "Update", GongSi_HB_id: lxr.GongSi_HB_id, FTID: contactId };
              } else if (gsSuffix == "_YL") {
                return { id: lxr.id, _status: "Update", GongSi_YL_id: lxr.GongSi_YL_id, FTID: contactId };
              } else {
                return { id: lxr.id, _status: "Update", GongSi_id: lxr.GongSi_id, FTID: contactId };
              }
            }
          }
          if (i + 1 <= LianXiRenXinXiList.length && LianXiRenXinXiList.length == 1 && contactListSize == 1) {
            let lxr = LianXiRenXinXiList[i];
            if (gsSuffix == "_JJ") {
              return { id: lxr.id, _status: "Update", GongSi_JJ_id: lxr.GongSi_JJ_id, FTID: contactId };
            } else if (gsSuffix == "_HB") {
              return { id: lxr.id, _status: "Update", GongSi_HB_id: lxr.GongSi_HB_id, FTID: contactId };
            } else if (gsSuffix == "_YL") {
              return { id: lxr.id, _status: "Update", GongSi_YL_id: lxr.GongSi_YL_id, FTID: contactId };
            } else {
              return { id: lxr.id, _status: "Update", GongSi_id: lxr.GongSi_id, FTID: contactId };
            }
          } else {
            return { _status: "Insert", GongSi_id: custId, FTID: contactId, GongSi_JJ_id: custId, GongSi_HB_id: custId, GongSi_YL_id: custId };
          }
        };
        let contactArray = [];
        if (contactList != null && contactList.length > 0) {
          for (var i in contactList) {
            let contactObj = contactList[i];
            let contactName = contactObj.name; //姓名
            let contactTel = contactObj.telephone; //电话
            if (contactTel != undefined && contactTel != null && contactTel.length > 50) {
              contactTel = substring(contactTel, 0, 50);
            }
            let contaceEmail = "";
            if (contactObj.email != undefined && contactObj.email != null && contactObj.email.length > 0) {
              contaceEmail = contactObj.email[0];
              if (contaceEmail.length > 50) {
                contaceEmail = substring(contaceEmail, 0, 50);
              }
            }
            let contactSex = contactObj.sex; //1男2女
            let contactSexTxt = contactSex == 1 ? "男" : contactSex == 2 ? "女" : ""; //性别
            let facebookId = contactObj.contactObj;
            let facebookName = contactObj.facebookName;
            let twitterId = contactObj.twitterId;
            let twitterName = contactObj.twitterName;
            let contactMobile = contactObj.mobile; //手机
            let contactId = contactObj.id; //富通联系人ID
            let whatsApp = ""; //接口暂缺
            let lxrObj = getDbLxrObj(LianXiRenXinXiList, contactId, i, contactList.length);
            lxrObj.XingMing = contactName;
            lxrObj.DianHua = contactTel;
            lxrObj.mobile = contactMobile;
            lxrObj.YouXiang = contaceEmail;
            lxrObj.FSex = contactSexTxt;
            lxrObj.WhatsApp = whatsApp;
            contactArray.push(lxrObj);
          }
        }
        let updSJXXObj = { _status: "Update", id: ShangJiXinXiList[0].id }; //商机信息就不用更新了 "xunPanRenY":xunPanRenY,
        if (mainProductId != "") {
        }
        if (mainProductPId != "") {
        }
        if (xunPanRenY != "") {
          updSJXXObj.xunPanRenY = xunPanRenY;
        }
        if (gsSuffix == "_JJ") {
          biObj.LianXiRenXinXi_JJList = contactArray;
          if (xunPanRenY != "" && ShangJiXinXiList.length > 0) {
            biObj.ShangJiXinXi_JJList = updSJXXObj;
          }
        } else if (gsSuffix == "_HB") {
          biObj.LianXiRenXinXi_HBList = contactArray;
          if (xunPanRenY != "" && ShangJiXinXiList.length > 0) {
            biObj.ShangJiXinXi_HBList = updSJXXObj;
          }
        } else if (gsSuffix == "_YL") {
          biObj.LianXiRenXinXi_YLList = contactArray;
          if (xunPanRenY != "" && ShangJiXinXiList.length > 0) {
            biObj.ShangJiXinXi_YLList = updSJXXObj;
          }
        } else {
          biObj.LianXiRenXinXiList = contactArray;
        }
        let biRes = ObjectStore.updateById(gsURI + gsSuffix, biObj, billNo);
        nowFTCustomerUpdTime = updateTime;
        nowFTCustomerUpdTimeStr = updateTimeStr;
        nowFTCustomerUpdUUID = ftuuid;
      }
      if (nowFTCustomerUpdTime != "") {
        let addResp = ObjectStore.insert(
          "GT3734AT5.GT3734AT5.autoUpdateFromFT",
          {
            pageNum: nowFTCustomerUpdTimeStr == ftNewTime ? lastPageNum + 1 : 1,
            updateTime: nowTimeStr,
            ftNewTime: nowFTCustomerUpdTimeStr,
            ftNewTimeStr: nowFTCustomerUpdTime,
            lastFTId: nowFTCustomerUpdUUID,
            reqt: JSON.stringify(bodyParam),
            resp: apiResponse,
            idx: new Date().getTime()
          },
          "yb561ac616"
        );
      }
    }
    //根据三大事业部判断属于哪个事业部--根据ID从DB查询对应的数据，然后进行更新操作
    return { rst: true, msg: "success" };
  }
}
exports({ entryPoint: MyTrigger });