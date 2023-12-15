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
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let LogToDB = true;
    let urlStr = "https://www.example.com/";
    let custCode = request.custCode;
    let custId = request.custId;
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
    var commLogObj = {
      id: custId,
      CommToFTLogList: [{ hasDefaultInit: true, commTime: nowTimeStr, GongSi_id: custId, commDirection: "2", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }]
    };
    var res = ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", commLogObj, "3199a3d6");
    let queryRes = ObjectStore.queryByYonQL(
      "select *,(select * from LianXiRenXinXiList) as LianXiRenXinXiList,(select * from ShangJiXinXiList) as ShangJiXinXiList,Sales.name,GuoJia.guoJiaMingCheng from GT3734AT5.GT3734AT5.GongSi where id='" +
        custId +
        "'"
    );
    let LianXiRenXinXiList = queryRes[0].LianXiRenXinXiList; //联系人
    let ShangJiXinXiList = queryRes[0].ShangJiXinXiList; //商机
    let Sales_name = queryRes[0].Sales_name; //业务员姓名
    let GuoJia_guoJiaMingCheng = queryRes[0].GuoJia_guoJiaMingCheng; //国家名称
    let MingChen = queryRes[0].MingChen; //客户名称
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
        let name = custObj.name; //客户名称
        let region = custObj.region; //国家名称
        let mainProduct = custObj.mainProduct; //主营产品
        let type = custObj.type; //客户类型--建机新询盘客户
        let source = custObj.source; //客户来源--eg：优化
        let flowStep = custObj.flowStep; //跟进阶段 --建立联系/资料获得...
        let operatorName = custObj.operatorName; //业务员名字
        //询盘来源&合作状态 都是在自定义项中，这里不需要同步
        let contactList = custObj.contactList; //联系人
        let customerCustomizeList = custObj.customerCustomizeList; //客户自定义项
        let productModel = customerCustomizeList[2].customizeValue; //型号
        //更新潜在客户单据信息
        let biObj = { id: custId, flowStep: flowStep, laquShiJian: nowTimeStr };
        if (MingChen != name) {
          //客户名称变更
          biObj.MingChen = name;
        }
        if (GuoJia_guoJiaMingCheng != region || true) {
          //国家变更
          let queryGuoJia = ObjectStore.queryByYonQL("select id from GT3734AT5.GT3734AT5.GuoJiaDangAnXinXi where guoJiaMingCheng='" + region + "'");
          if (queryGuoJia.length > 0) {
            biObj.GuoJia = queryGuoJia[0].id;
          }
        }
        if (Sales_name != operatorName || true) {
          //业务员变更了-- 获取业务员ID
          let APPCODE = "GT3734AT5";
          let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
          let mddUrl = DOMAIN + "/yonbip/hrcloud/staff/listmdd";
          let mddResp = openLinker("POST", mddUrl, APPCODE, JSON.stringify({ pageIndex: 1, pageSize: 10, name: operatorName }));
          let respObj = JSON.parse(mddResp);
          if (respObj.code == 200) {
            let recordList = respObj.data.recordList;
            if (recordList.length > 0) {
              biObj.Sales = recordList[0].id;
            }
          }
        }
        if (productModel != "") {
        }
        var getDbLxrObj = (LianXiRenXinXiList, contactId, i) => {
          if (LianXiRenXinXiList.length == 0) {
            return { _status: "Insert", GongSi_id: custId, FTID: contactId };
          }
          for (var k in LianXiRenXinXiList) {
            let lxr = LianXiRenXinXiList[k];
            if (lxr.FTID != undefined && lxr.FTID == contactId) {
              return { id: lxr.id, _status: "Update", GongSi_id: lxr.GongSi_id, FTID: contactId };
            }
          }
          if (i + 1 <= LianXiRenXinXiList.length) {
            let lxr = LianXiRenXinXiList[i];
            return { id: lxr.id, _status: "Update", GongSi_id: lxr.GongSi_id, FTID: contactId };
          } else {
            return { _status: "Insert", GongSi_id: custId, FTID: contactId };
          }
        };
        let contactArray = [];
        if (contactList.length > 0) {
          for (var i in contactList) {
            let contactObj = contactList[i];
            let contactName = contactObj.name; //姓名
            let contactTel = contactObj.telephone; //电话
            let contaceEmail = "";
            if (contactObj.email.length > 0) {
              contaceEmail = contactObj.email[0];
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
            let lxrObj = getDbLxrObj(LianXiRenXinXiList, contactId, i);
            lxrObj.XingMing = contactName;
            lxrObj.DianHua = contactTel;
            lxrObj.mobile = contactMobile;
            lxrObj.YouXiang = contaceEmail;
            lxrObj.FSex = contactSexTxt;
            lxrObj.WhatsApp = whatsApp;
            contactArray.push(lxrObj);
          }
        }
        biObj.LianXiRenXinXiList = contactArray;
        let biRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", biObj, "3199a3d6");
      }
    }
    return { rst: tongBuZhuangTai, msg: shiBaiYuanYin, apiResponse: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });