viewModel.on("beforeSearch", function (args) {
  var commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "isShow",
    value1: 1
  });
  commonVOs.push({
    itemName: "custCategory",
    value1: 1
  });
});
viewModel.on("beforeBatchsave", function (args) {
  Date.prototype.Format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "H+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return fmt;
  };
  debugger;
  args.data.forEach((item) => {
    item.groupOptIndperson = viewModel.getAppContext().user.userName;
    item.groupOptIndTime = new Date().Format("yyyy-MM-dd HH:mm:ss");
    item.transferStatus = "";
    item.handedOrg_name = "";
    item.handedOrg = "";
    item.handedIsTrue = "";
    item.handedIsTrueTime = "";
    item.handedAttachment = "";
    item.handedRemark = "";
    item.handedOpetator = "";
    item.handedTime = "";
    item.receivePerson_name = "";
    item.receivePerson = "";
    item.receiveIsTrue = "";
    item.receiveTime = "";
    item.receiveAttachment = "";
    item.receiveRemark = "";
  });
});