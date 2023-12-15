let AbstractTrigger = require("AbstractTrigger");
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
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let LogToDB = true;
    let debugging = false;
    if (debugging) {
      let queryCustRes = ObjectStore.queryByYonQL("select pageNum from GT3734AT5.GT3734AT5.FTCustArchives order by pageNum asc", "developplatform");
      let pageNumList = [];
      for (var i = 1; i < 3893; i++) {
        let fg = false;
        for (var j = 0; j < queryCustRes.length; j++) {
          let obj = queryCustRes[j];
          if (obj.pageNum < i) {
            continue;
          }
          if (obj.pageNum == i) {
            fg = true;
            break;
          }
          if (obj.pageNum > i && !fg) {
            pageNumList.push[i];
            break;
          }
        }
      }
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "补漏", reqt: pageNumList.length, resp: pageNumList.toString() })); //调用领域内函数写日志
      return;
      let count = 10;
      if (pageNumList.length <= 10) {
        count = pageNumList.length;
      }
      for (var i = 0; i < count; i++) {
        let pageNum = pageNumList[i];
        let pageSize = 100;
        let urlStr = "https://www.example.com/";
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
          size: pageSize,
          num: pageNum,
          sortField: "createTime",
          sortMode: "asc"
        };
        let apiResponse = postman("post", urlStr, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify(bodyParam));
        let resObj = JSON.parse(apiResponse);
        if (includes(apiResponse, "超过当天接口调用限制") || resObj.data.length == 0) {
          return;
        }
        ObjectStore.insert(
          "GT3734AT5.GT3734AT5.FTCustArchives",
          { pageNum: pageNum, synTime: getNowDate(), reqContent: JSON.stringify(bodyParam), synContent: apiResponse, timeIdx: new Date().getTime() },
          "26bac260"
        );
      }
      return;
    }
    let num = 10;
    let pageSize = 100;
    let pageNum = 0;
    let queryCustRes = ObjectStore.queryByYonQL("select pageNum from GT3734AT5.GT3734AT5.FTCustArchives order by pageNum desc limit 1", "developplatform");
    if (queryCustRes.length > 0) {
      pageNum = queryCustRes[0].pageNum;
    }
    pageNum++;
    for (var i = 0; i < num; i++) {
      let urlStr = "https://www.example.com/";
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
        size: pageSize,
        num: pageNum + i,
        sortField: "createTime",
        sortMode: "asc"
      };
      let apiResponse = postman("post", urlStr, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify(bodyParam));
      let resObj = JSON.parse(apiResponse);
      if (includes(apiResponse, "超过当天接口调用限制") || resObj.data.length == 0) {
        return;
      }
      ObjectStore.insert(
        "GT3734AT5.GT3734AT5.FTCustArchives",
        { pageNum: pageNum + i, synTime: getNowDate(), reqContent: JSON.stringify(bodyParam), synContent: apiResponse, timeIdx: new Date().getTime() },
        "26bac260"
      );
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });