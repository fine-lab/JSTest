let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    var res = "";
    for (let i = 0; i < data.length; i++) {
      let paramBill = data[i];
      var sourceId = paramBill.source_id;
      if (sourceId == null || sourceId == "") {
        throw new Error("sourceId不能为空");
      }
      let searchSQL =
        "select *,vendorId.name,(select *,unit.name,(select * from suppliershippingschedulesnList) as suppliershippingschedulesnList from suppliershippingschedulebList) suppliershippingschedulebList from GT39325AT4.GT39325AT4.suppliershippingschedule ";
      var whereParam = " where source_id in (" + paramBill.source_id + ")";
      searchSQL = searchSQL + whereParam;
      res = ObjectStore.queryByYonQL(searchSQL);
      if (res == null || res.length == 0) {
        //新增
        delete paramBill.id;
        res = ObjectStore.insert("GT39325AT4.GT39325AT4.suppliershippingschedule", paramBill, "d9c012c1");
      } else {
        //修改
        var sourceBill = res[0];
        sourceBill["po_number"] = paramBill.po_number;
        sourceBill["bill_to_address"] = paramBill.bill_to_address;
        sourceBill["po_code"] = paramBill.po_code;
        sourceBill["org_id"] = paramBill.org_id;
        sourceBill["org_id_name"] = paramBill.org_id_name;
        sourceBill["po_number"] = paramBill.po_number;
        sourceBill["_status"] = paramBill._status;
        sourceBill["agentId"] = paramBill.agentId;
        sourceBill["agentId_name"] = paramBill.agentId_name;
        sourceBill["bustype"] = paramBill.bustype;
        sourceBill["bustype_name"] = paramBill.bustype_name;
        sourceBill["code"] = paramBill.code;
        sourceBill["creation_date"] = paramBill.creation_date;
        sourceBill["estimated_packing_date"] = paramBill.estimated_packing_date;
        sourceBill["last_update_date"] = paramBill.last_update_date;
        sourceBill["order_remark"] = paramBill.order_remark;
        sourceBill["pickdate"] = paramBill.pickdate;
        sourceBill["publish_time"] = paramBill.publish_time;
        sourceBill["request_date"] = paramBill.request_date;
        sourceBill["vendorId"] = paramBill.vendorId;
        sourceBill["vendor"] = paramBill.vendor;
        let subList = sourceBill.suppliershippingschedulebList;
        for (var j = 0; j < subList.length; j++) {
          var subBill = subList[j];
          for (var k = 0; k < paramBill.suppliershippingschedulebList.length; k++) {
            var subParamBill = paramBill.suppliershippingschedulebList[k];
            if (subParamBill.id == subBill.source_id) {
              subBill["item_code"] = subParamBill.item_code;
              subBill["item_code_name"] = subParamBill.item_code_name;
              subBill["quantitiy"] = subParamBill.quantitiy;
              subBill["unit"] = subParamBill.unit;
              subBill["unit_name"] = subParamBill.unit_name;
              subBill["batch"] = subParamBill.batch;
              subBill["bill_quantitiy"] = subParamBill.bill_quantitiy;
              subBill["item_type"] = subParamBill.item_type;
              subBill["_status"] = "Update";
              let subSnList = subBill.suppliershippingschedulesnList;
              if (!subSnList) {
                continue;
              }
              for (var l = 0; l < subSnList.length; l++) {
                var subSn = subSnList[l];
                let subParamSnList = subParamBill.suppliershippingschedulesnList;
                for (var m = 0; m < subParamSnList.length; m++) {
                  var subSnParam = subParamSnList[m];
                  if (subSnParam.id == subSn.source_id) {
                    subSn["sncode"] = subSnParam.sncode;
                    subSn["_status"] = subSnParam._status;
                  }
                }
              }
            }
          }
        }
        //更新
        res = ObjectStore.updateById("GT39325AT4.GT39325AT4.suppliershippingschedule", sourceBill, "d9c012c1");
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });