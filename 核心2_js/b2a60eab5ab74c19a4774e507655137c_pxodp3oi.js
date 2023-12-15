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
const getCustSimpleName = (keHuName, companyName) => {
  let simpleName = keHuName;
  if (simpleName.length > 10) {
    let sname = simpleName.substring(0, 10);
    if (sname.split("-").length == 3) {
      simpleName = simpleName.substring(10);
      if (includes(simpleName, "(")) {
        simpleName = simpleName.split("(")[0];
      }
    }
  }
  if (simpleName.length > 50) {
    simpleName = simpleName.substring(0, 49);
  }
  return simpleName;
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let LogToDB = true;
    let businessId = request.businessId;
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
    let sqlStr =
      "select d.code,d.MingChen,d.Sales,d.tongBuZhuangTai,d.shiBaiYuanYin,b.guoJiaMingCheng,c.productName,*,xqcpx.name " + //,b.guoJiaMingCheng,b.guoJiaBianMa,b.haiGuanBianMa,b.guoJiaMingCheng_Eng,b.jianCheng2,b.jianCheng3,b.dianHuaQuHao,b.shiQu ";
      " from GT3734AT5.GT3734AT5.XunPanXSBill left join GT3734AT5.GT3734AT5.GuoJiaDangAnXinXi b on guojia = b.id " +
      " left join GT3734AT5.GT3734AT5.ProductCatagory c on xuQiuChanPin=c.id " +
      " left join " +
      gsURI +
      " d on custId=d.id " +
      " where id = '" +
      businessId +
      "'";
    let queryRes = ObjectStore.queryByYonQL(sqlStr);
    if (queryRes == null || queryRes.length == 0 || queryRes[0].d_code == undefined || queryRes[0].d_code == null) {
      return { rst: false, msg: "没有找到询盘线索无法同步!" };
    }
    let dataDetail = queryRes[0];
    let xunPanRenY = dataDetail.xunPanRenY;
    let xunPanRenY_name = "";
    if (xunPanRenY != undefined && xunPanRenY != "") {
      let xunPanRenYRes = extrequire("GT3734AT5.ServiceFunc.getBaseDocDetail").execute(null, JSON.stringify({ userId: xunPanRenY, docType: "staff" }));
      xunPanRenY_name = xunPanRenYRes.data.name; //询盘人名字
    }
    if (dataDetail.verifystate == 2) {
      //审核态
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: true, logModule: 9, description: "线索询盘-客户重传:" + businessId, reqt: "", resp: JSON.stringify(queryRes) })
      );
      let saler_id = dataDetail.yeWuYuan;
      saler_id = dataDetail.d_Sales; //从潜客中取
      if (saler_id == null || saler_id == "") {
        let updres = ObjectStore.updateById("GT3734AT5.GT3734AT5.XunPanXSBill", { id: businessId, tongBuZhuangTai: false, tongBuShiiJan: getNowDate(), shiBaiYuanYin: "业务员没有分派!" }, "66c03e66");
        return { rst: false, msg: "未设置业务员不能传递!" };
      }
      let baZhang = dataDetail.baZhang;
      //检测业务员分派记录
      sqlStr = "select zhiPaiYeWuYuan from GT3734AT5.GT3734AT5.yeWuYuanBianGEntry where XunPanXianSuo_id='" + businessId + "' order by bianGengRiQi DESC";
      let res0 = ObjectStore.queryByYonQL(sqlStr);
      if (res0.length == 0 || !includes(res0[0].zhiPaiYeWuYuan, saler_id)) {
        let newTime = getNowDate();
        let ywyObj = {
          id: businessId,
          xianSuoZhTai: "1",
          zhuangTaiBGengEntryList: [
            { hasDefaultInit: true, _status: "Insert", bianGengRiQi: newTime, bianGengZhT: "1", caozuoren: saler_id, XunPanXianSuo_id: businessId, beizhu: "业务员确认接收询盘线索" }
          ],
          yeWuYuanBianGEntryList: [
            { hasDefaultInit: true, _status: "Insert", bianGengRiQi: newTime, zhiPaiYeWuYuan: saler_id, caozuoren: baZhang, XunPanXianSuo_id: businessId, beizhu: "业务员确认接收询盘线索" }
          ]
        };
        let ywyres = ObjectStore.updateById("GT3734AT5.GT3734AT5.XunPanXSBill", ywyObj, "66c03e66");
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
          null,
          JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "业务员更新", reqt: JSON.stringify(ywyObj), resp: JSON.stringify(ywyres) })
        ); //调用领域内函数写日志
      }
      //检测并插入新派业务员
      let synFunc = extrequire("GT3734AT5.ServiceFunc.getAccessToken");
      let funcRes = synFunc.execute(null);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "调用接口获取AccessToken", reqt: "", resp: JSON.stringify(funcRes) })); //调用领域内函数写日志
      let accessToken = null;
      if (funcRes.rst) {
        accessToken = funcRes.accessToken;
      }
      if (accessToken == null || accessToken == "") {
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "AccessToken为空-无法对接富通", reqt: "", resp: "" })); //调用领域内函数写日志
        return { rst: false, msg: "未设置业务员不能传递!" };
      }
      let cust_code = dataDetail.custCode;
      let cust_name = dataDetail.d_MingChen;
      let org_id = dataDetail.org_id;
      let orgres = extrequire("GT3734AT5.ServiceFunc.getBaseDocDetail").execute(null, JSON.stringify({ orgId: org_id, docType: "org" }));
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "获取组织名称" + org_id, reqt: "", resp: JSON.stringify(orgres) })
      ); //调用领域内函数写日志
      let org_name = orgres.data.name.zh_CN;
      let customerType = "环保新询盘客户"; //游乐新线索：背景信息暂不确定 //建机新询盘客户
      if (includes(org_name, "建机")) {
        customerType = "建机新询盘客户";
      } else if (includes(org_name, "游乐")) {
        customerType = "游乐新线索：背景信息暂不确定";
      }
      let saleres = extrequire("GT3734AT5.ServiceFunc.getBaseDocDetail").execute(null, JSON.stringify({ userId: saler_id, docType: "staff" }));
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "获取员工名称" + saler_id, reqt: "", resp: JSON.stringify(saleres) })
      ); //调用领域内函数写日志
      let saler_name = saleres.data.name; //业务员名字
      let description = dataDetail.xunPanNeiRong; //xuQiuXiangQing;
      let country_id = dataDetail.guojia;
      let country_name = dataDetail.b_guoJiaMingCheng;
      let xunPanLeiXing = dataDetail.xunPanLeiXing;
      let apiRes = extrequire("GT3734AT5.APIFunc.getEmunTxtApi").execute(null, JSON.stringify({ key: xunPanLeiXing, emunURI: "developplatform.developplatform.Emun_XunPanLeiXing" }));
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logLevel: "DEBUG", logModule: 9, description: "查询枚举" + xunPanLeiXing, reqt: "", resp: apiRes }));
      let xunPanLeiXing_name = apiRes == null ? "" : apiRes;
      let cust_email = dataDetail.keHuYouXiang;
      let cust_tel = dataDetail.keHuDianHua;
      let cust_company = dataDetail.keHuGongSi;
      let productName = dataDetail.xqcpx_name; //dataDetail.c_productName;2023-11-23富森要求改成第三级物料档案
      let titleName = dataDetail.titleName;
      let contactName = getCustSimpleName(cust_name, dataDetail.cust_company);
      if (titleName.length > 50) {
        titleName = titleName.substring(0, 49);
      }
      if (cust_name.length > 100) {
        cust_name = cust_name.substring(0, 99);
      }
      let bodyParam = {
        accessToken: accessToken,
        code: cust_code,
        name: cust_name,
        shortName: contactName,
        type: customerType, //客户类型--暂时固定值
        operatorName: saler_name, //操作员名称-业务员
        isPublic: 1, //是否公海 0 公海,1 私海,-1回收箱
        description: description, //备注
        region: country_name, //国家地区--按照富通中的为标准维护到国家档案中
        province: "",
        city: "", //市
        source: xunPanLeiXing_name, //客户来源--询盘类型
        webSite: "", //公司站点--客户的网站-需在富通中维护完善
        id: "", //id-可自动生成
        contactRequestList: [
          {
            mobile: cust_tel,
            telephone: cust_tel,
            name: contactName,
            accessToken: accessToken
          }
        ], //客户联系人信息
        customerCustomizeList: [
          { customizeName: "合作状态", customizeValue: "未合作" },
          { customizeName: "询盘来源", customizeValue: xunPanRenY_name }
        ],
        mainProduct: [productName], //主营产品
        classification: "", //客户分类--无
        businessType: "", //业务类型--无
        flowStep: "建立联系", //跟进阶段--默认：销售线索
        fontColor: "" //字体颜色
      };
      if (cust_email != undefined && cust_email != null && cust_email != "") {
        bodyParam.contactRequestList[0].email = [cust_email];
      }
      let apiResponse = postman("post", "https://www.example.com/", JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify(bodyParam));
      let rstObj = JSON.parse(apiResponse);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "调用富通接口推送客户信息", reqt: JSON.stringify(bodyParam), resp: apiResponse })
      ); //调用领域内函数写日志
      let shiBaiYuanYin = "success";
      let tongBuZhuangTai = true;
      let FTCode = cust_code;
      if (rstObj != null && (rstObj.code == 2 || !rstObj.success)) {
        //失败
        shiBaiYuanYin = rstObj.errMsg;
        tongBuZhuangTai = false;
        FTCode = "";
      } else {
        //成功
        shiBaiYuanYin = rstObj.data;
      }
      let logTime = getNowDate();
      let commLogObj = { id: dataDetail.custId, tongBuZhuangTai: tongBuZhuangTai, tongBuShiiJan: logTime, shiBaiYuanYin: shiBaiYuanYin, FTCode: FTCode };
      if (gsSuffix == "_JJ") {
        commLogObj.CommToFTLog_JJList = [
          { hasDefaultInit: true, commTime: logTime, GongSi_JJ_id: dataDetail.custId, commDirection: "1", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }
        ];
      } else if (gsSuffix == "_HB") {
        commLogObj.CommToFTLog_HBList = [
          { hasDefaultInit: true, commTime: logTime, GongSi_HB_id: dataDetail.custId, commDirection: "1", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }
        ];
      } else if (gsSuffix == "_YL") {
        commLogObj.CommToFTLog_YLList = [
          { hasDefaultInit: true, commTime: logTime, GongSi_YL_id: dataDetail.custId, commDirection: "1", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }
        ];
      } else {
        commLogObj.CommToFTLogList = [
          { hasDefaultInit: true, commTime: logTime, GongSi_id: dataDetail.custId, commDirection: "1", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }
        ];
      }
      let commLogRes = ObjectStore.updateById(gsURI, commLogObj, billNo);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "更新同步状态", reqt: JSON.stringify(commLogObj), resp: JSON.stringify(commLogRes) })
      ); //调用领域内函数写日志
      return { rst: tongBuZhuangTai, msg: shiBaiYuanYin, custCode: cust_code };
    }
    return { rst: false, msg: "未审核单据不能传递!" };
  }
}
exports({ entryPoint: MyAPIHandler });