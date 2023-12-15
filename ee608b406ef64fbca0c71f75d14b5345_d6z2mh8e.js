let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let id = param.data[0].id; // 主表id
    let suppliershippingschedulebList = param.data[0].suppliershippingschedulebList;
    let res;
    let deleteArr = [];
    let deleteObj = { id: id };
    if (suppliershippingschedulebList && suppliershippingschedulebList.length > 0) {
      for (var j = 0; j < suppliershippingschedulebList.length; j++) {
        let suppliershippingschedulesnList = suppliershippingschedulebList[j].suppliershippingschedulesnList;
        if (suppliershippingschedulesnList && suppliershippingschedulesnList.length > 0) {
          let whereStr = "";
          let errorMsg = "";
          for (var k = 0; k < suppliershippingschedulesnList.length; k++) {
            let suppliershippingschedulesn = suppliershippingschedulesnList[k];
            let deleteSnItem = {};
            if (suppliershippingschedulesn["_status"] == "Insert" || suppliershippingschedulesn["_status"] == "Update") {
              whereStr += "'" + suppliershippingschedulesn["sncode"] + "',";
              errorMsg += suppliershippingschedulesn["sncode"] + ",";
            }
          }
          if (whereStr && whereStr.length > 0) {
            whereStr = whereStr.substring(0, whereStr.length - 1);
            let searchSQL =
              "select * from GT39325AT4.GT39325AT4.suppliershippingschedulesn where sncode in (" + whereStr + ") and suppliershippingscheduleb_id <> " + suppliershippingschedulebList[j].id;
            res = ObjectStore.queryByYonQL(searchSQL);
            if (res && res.length > 0) {
              errorMsg = errorMsg.substring(0, errorMsg.length - 1);
              throw new Error("SN:" + errorMsg + " 重复，请检查！");
            }
          }
        }
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyTrigger });