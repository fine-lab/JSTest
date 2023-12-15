let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    var res = "";
    for (let i = 0; i < data.length; i++) {
      let bill = data[i];
      if (bill.id == null || bill.id == "") {
        throw new Error("主表id不能为空");
      }
      bill["_status"] = "Update";
      // 查询SN表数据
      let searchSQL =
        "select *,vendorId.name,(select *,unit.name,(select * from shippingschedulesnList) as shippingschedulesnList from shippingschedulebList) shippingschedulebList from GT37595AT2.GT37595AT2.shippingschedule ";
      var whereParam = " where id in (" + bill.id + ")";
      searchSQL = searchSQL + whereParam;
      var billData = ObjectStore.queryByYonQL(searchSQL);
      var snSubMap = {}; //snSubMap:key=子表id,value=子表下所有的SN信息
      var subBills = billData[0].shippingschedulebList;
      for (var l = 0; l < subBills.length; l++) {
        var sunbill = subBills[l];
        var subSns = sunbill.shippingschedulesnList;
        var snMap = {};
        if (subSns != undefined) {
          for (var m = 0; m < subSns.length; m++) {
            var newSn = subSns[m];
            snMap[newSn.source_id] = newSn;
          }
        }
        snSubMap[sunbill.id] = snMap;
      }
      // 处理SN表数据
      let subList = bill.shippingschedulebList;
      for (let j = 0; j < subList.length; j++) {
        var subBill = subList[j];
        subBill["_status"] = "Update";
        let subSnList = subBill.shippingschedulesnList;
        var billSnMap = snSubMap[subBill.id];
        for (var k = 0; k < subSnList.length; k++) {
          var subSnBill = subSnList[k];
          if (JSON.stringify(snSubMap) == "{}") {
            //原表没有sn数据
            subSnBill["_status"] = "Insert";
          } else {
            var snId = subSnBill.id;
            if (billSnMap.hasOwnProperty(snId)) {
              if (subSnBill.sncode == billSnMap[snId].sncode && subSnBill.poCode == billSnMap[snId].poCode && subSnBill.fixedassetCode == billSnMap[snId].fixedassetCode) {
                subSnBill["_status"] = "Unchanged";
              } else {
                subSnBill["_status"] = "Update";
                subSnBill["id"] = billSnMap[snId].id;
              }
              delete billSnMap[snId];
            } else {
              subSnBill["_status"] = "Insert";
            }
          }
        }
        if (JSON.stringify(billSnMap) != "{}") {
          for (var sn in billSnMap) {
            var deleteSn = { id: billSnMap[sn].id, _status: "Delete", shippingscheduleb_id: billSnMap[sn].shippingscheduleb_id, shippingscheduleb_id_id: billSnMap[sn].shippingscheduleb_id };
            subSnList.push(deleteSn);
          }
        }
      }
      //更新
      res = ObjectStore.updateById("GT37595AT2.GT37595AT2.shippingschedule", bill, "02a3de71");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });