let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //计算时间
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var now = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getUTCDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    let currentTime = `${year}-${formatSingleDigit(month)}-${formatSingleDigit(day)} ${formatSingleDigit(hour)}:${formatSingleDigit(minute)}:${formatSingleDigit(second)}`;
    var updateWrapper = new Wrapper();
    //用户名
    let user = ObjectStore.user();
    //审核单据主表id
    let id;
    let toUpdate;
    //判断是列表审批还是详情审批
    if (request.datas == null || request.datas == undefined || request.datas == "") {
      if (request.res == null || request.res == undefined || request.res.id == "") {
        return {};
      } else {
        for (var i = 0; i < request.res.length; i++) {
          updateWrapper = new Wrapper();
          id = request.res[i];
          toUpdate = {
            reviewer: user.name,
            reviewerDate: currentTime
          };
          updateWrapper.eq("id", id);
          var res = JSON.stringify(ObjectStore.update("AT17AA2EFA09C00009.AT17AA2EFA09C00009.manufacturing_order", toUpdate, updateWrapper, "ybf81544ac"));
        }
      }
    } else {
      id = request.datas.res.id;
      toUpdate = {
        reviewer: user.name,
        reviewerDate: currentTime
      };
      updateWrapper.eq("id", id);
      var res = JSON.stringify(ObjectStore.update("AT17AA2EFA09C00009.AT17AA2EFA09C00009.manufacturing_order", toUpdate, updateWrapper, "ybf81544ac"));
    }
    //计算时间函数
    function formatSingleDigit(a) {
      let result = a;
      if (a < 10) {
        result = `0${a}`;
      }
      return result;
    }
    return { toUpdate };
  }
}
exports({ entryPoint: MyAPIHandler });