let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 更新是否生成报告
    var object = { id: request.id, Generate: "true" };
    var updateDetectOrder = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DetectOrder", object, "71a4dca4");
    //更新收样单
    var sydId = request.Upstreamid;
    var updateIsbg = { id: sydId, isbg: "true" };
    var updateIsbgRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", updateIsbg, "63fb1ae5");
    // 更新状态已完成
    var updateCheckStatus = { id: request.id, checkStatus: "20" };
    var updateDetectOrder = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DetectOrder", updateCheckStatus, "71a4dca4");
    //更新时间
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var strDate = date.getFullYear() + "-";
    var month = date.getMonth() + 1; //月
    var getData = date.getDate(); //日
    var hours = date.getHours(); //时
    var minutes = date.getMinutes(); //分
    var seconds = date.getSeconds(); //秒
    month = month < 10 ? "0" + month : month;
    getData = getData < 10 ? "0" + getData : getData;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    strDate += month + "-";
    strDate += getData + " ";
    strDate += hours + ":";
    strDate += minutes + ":";
    strDate += seconds;
    var updateDate = { id: request.id, generateTime: strDate };
    var updateDateRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DetectOrder", updateDate, "71a4dca4");
    //更新收样单
    var updateBgDate = { id: sydId, bgDate: strDate, checkStatus: "20" };
    var updateBgDateRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", updateBgDate, "63fb1ae5");
    return { updateBgDateRes };
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });