let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let LogToDB = true;
    let APPCODE = "GT3734AT5";
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let urlStr = "https://www.example.com/";
    let pdata = param.data[0];
    let id = pdata.id;
    let sqlStr = "select *,yeWuYuan.name from GT3734AT5.GT3734AT5.XunPanXSBill where id='" + id + "'";
    let queryRes = ObjectStore.queryByYonQL(sqlStr, "developplatform");
    let resData = queryRes[0];
    //先检测是否重复
    let newYeWuYuan = resData.yeWuYuan;
    let shouPaiYeWuYuan = resData.shouPaiYeWuYuan;
    if (newYeWuYuan == undefined || newYeWuYuan == null || newYeWuYuan == "" || shouPaiYeWuYuan == undefined || shouPaiYeWuYuan == null || shouPaiYeWuYuan == "") {
      return { rst: true };
    }
    if (newYeWuYuan == shouPaiYeWuYuan) {
      return { rst: true };
    }
    let yeWuYuan_name = resData.yeWuYuan_name;
    let custId = resData.custId;
    let custCode = resData.custCode;
    let gsURI = "GT3734AT5.GT3734AT5.GongSi"; //合一潜客URI
    if (custCode != undefined && custCode != null) {
      gsURI = gsURI + "_" + substring(custCode, 0, 2);
    }
    //业务员与首派业务员不同(线索重复)
    let youXiangJiaoYan = resData.youXiangJiaoYan;
    if (youXiangJiaoYan != undefined && youXiangJiaoYan != null && includes(youXiangJiaoYan, "有重复数据")) {
      //获取富通客户档案，比较业务员名称是否一致，不一致则要求先进行变更
      //查询重复的潜客信息
      let queryGSRes = ObjectStore.queryByYonQL("select * from " + gsURI + " where id='" + custId + "'", "developplatform");
      let ftuuid = "";
      if (queryGSRes.length > 0) {
        let qdataObj = queryGSRes[0];
        let tongBuZhuangTai = qdataObj.tongBuZhuangTai;
        if (tongBuZhuangTai == undefined || !tongBuZhuangTai) {
          //尚未同步--通过
          return { rst: true };
        } else {
          ftuuid = qdataObj.shiBaiYuanYin;
        }
      } else {
        throw new Error("根据重复线索对应潜客找不到相关记录，请确认是否已删除!");
      }
      let funcRes = extrequire("GT3734AT5.ServiceFunc.getAccessToken").execute(null);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "调用接口获取AccessToken", reqt: "", resp: JSON.stringify(funcRes) })); //调用领域内函数
      let accessToken = null;
      if (funcRes.rst) {
        accessToken = funcRes.accessToken;
      }
      if (accessToken == null || accessToken == "") {
        throw new Error("从富通获取accessToken异常，请检查富通接口!");
        return { rst: false, msg: "未获取accessToken不能传递!" };
      }
      let bodyParam = {
        accessToken: accessToken,
        belong: 2, //查公海或私海：1公海，2私海
        id: ftuuid
      };
      let apiResponse = postman("post", urlStr, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify(bodyParam));
      let rstObj = JSON.parse(apiResponse);
      if (rstObj != null && (rstObj.code == 2 || !rstObj.success)) {
        //失败
        throw new Error("从富通获取客户档案异常!" + rstObj.errMsg);
      } else {
        //获取成功
        if (rstObj.totalRecords == 0) {
          return { rst: true, msg: "私海中没有，公海随便改业务员" };
        }
        let custObj = rstObj.data[0]; //获取客户档案信息对象解析数据--TODO
        let operatorName = custObj.operatorName; //业务员名字 : "温晶"
        if (operatorName != yeWuYuan_name) {
          throw new Error("富通中与该线索重复的客户尚未变更到[" + yeWuYuan_name + "]名下,当前业务员:" + operatorName);
        }
      }
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });