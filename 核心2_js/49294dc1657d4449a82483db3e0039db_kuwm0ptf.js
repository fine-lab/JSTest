let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let objArr = request.objArr;
    ObjectStore.updateBatch("GT39325AT4.GT39325AT4.suppliershippingschedule", objArr, "d9c012c1List");
    let searchSQL =
      "select *,vendorId.name,(select *,unit.name,(select * from suppliershippingschedulesnList) as suppliershippingschedulesnList from suppliershippingschedulebList) suppliershippingschedulebList from GT39325AT4.GT39325AT4.suppliershippingschedule ";
    var whereParam = "";
    for (var i = 0; i < objArr.length; i++) {
      if (whereParam != "") {
        whereParam = whereParam + "," + objArr[i].id;
      } else {
        whereParam = objArr[i].id;
      }
    }
    searchSQL = searchSQL + " where id in (" + whereParam + ")";
    var res = ObjectStore.queryByYonQL(searchSQL);
    if (res && res.length > 0) {
      for (var j = 0; j < res.length; j++) {
        res[j].id = res[j].source_id;
        delete res[j].pubts;
        delete res[j].source_id;
        delete res[j].tenant_id;
        delete res[j].verifystate;
        var suppliershippingschedulebList = res[j].suppliershippingschedulebList;
        if (suppliershippingschedulebList && suppliershippingschedulebList.length > 0) {
          for (var m = 0; m < suppliershippingschedulebList.length; m++) {
            suppliershippingschedulebList[m].id = suppliershippingschedulebList[m].source_id;
            delete suppliershippingschedulebList[m].source_id;
            delete suppliershippingschedulebList[m].pubts;
            delete suppliershippingschedulebList[m].tenant_id;
            var suppliershippingschedulesnList = suppliershippingschedulebList[m].suppliershippingschedulesnList;
            if (suppliershippingschedulesnList && suppliershippingschedulesnList.length > 0) {
              for (var n = 0; n < suppliershippingschedulesnList.length; n++) {
                suppliershippingschedulesnList[n].id = suppliershippingschedulesnList[n].source_id;
                delete suppliershippingschedulesnList[n].source_id;
                delete suppliershippingschedulesnList[n].pubts;
                delete suppliershippingschedulesnList[n].tenant_id;
              }
              suppliershippingschedulebList[m]["shippingschedulesnList"] = suppliershippingschedulesnList;
            }
            delete suppliershippingschedulebList[m].suppliershippingschedulesnList;
          }
          res[j]["shippingschedulebList"] = suppliershippingschedulebList;
        }
        delete res[j].suppliershippingschedulebList;
      }
      let reqData = { data: res };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "GT39325AT4", JSON.stringify(reqData));
      return { apiResponse };
    } else {
      throw new Error("查询主子孙表数据为空！");
    }
  }
}
exports({ entryPoint: MyAPIHandler });