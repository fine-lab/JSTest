let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var Name = currentUser.name;
    var newDate = getNowFormatDate();
    var state = request.state;
    var id = request.id;
    // 页面状态 1 ：为列表取消确认、2 ：为列表校验 、 3 ： 卡片取消确认 、 4 ： 卡片校验、6：卡片确认
    if (state == 1) {
      let object = { id: id, Cancelone: Name, Cancelthetime: newDate };
      let res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", object, "e84ee900");
    }
    if (state == 2) {
      let object = { id: id, Acceptanceofthepeople: Name, Acceptancetime: newDate };
      let res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", object, "e84ee900");
    }
    if (state == 3) {
      let object = { id: id, Cancelone: Name, Cancelthetime: newDate };
      let res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", object, "e84ee900");
    }
    if (state == 4) {
      let object = { id: id, Acceptanceofthepeople: Name, Acceptancetime: newDate };
      let res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", object, "e84ee900");
    }
    if (state == 0) {
      let object = { id: id, Makingpeople: Name, Makethedate: newDate };
      let res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", object, "e84ee900");
    }
    if (state == 5) {
      let object = { id: id, Themodifier: Name, Modificationdate: newDate };
      let res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", object, "e84ee900");
    }
    if (state == 6) {
      let object = { id: id, notarize_Reviewing: Name, notarize_Reviewing_Date: newDate };
      let res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", object, "e84ee900");
    }
    if (state == 7) {
      let object = { id: id, notarize_Reviewing: Name, notarize_Reviewing_Date: newDate };
      let res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", object, "e84ee900");
    }
    return { currentUser: currentUser, newDate: newDate };
  }
}
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
exports({ entryPoint: MyAPIHandler });