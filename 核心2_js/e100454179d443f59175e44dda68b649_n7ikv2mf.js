let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    };
    var handleCertList = function (certList, id, status, type, entityName) {
      var isExist = false;
      for (var p = 0; p < certList.length; p++) {
        if (certList[p][type] == id) {
          isExist = true;
          certList[p]._status = status;
          break;
        }
      }
      if (!isExist && status !== "Delete") {
        let para = {};
        para["_entityName"] = entityName;
        para["_keyName"] = "id";
        para["_status"] = "Insert";
        para[type] = id;
        certList.push(para);
      }
      return certList;
    };
    var verifystate = param.data[0].verifystate;
    if (verifystate == "0") {
    }
    //审批中
    else if (verifystate == "1") {
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });