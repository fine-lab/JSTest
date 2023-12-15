let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var locationCode = "" + request.locationCode;
    var clientCode = "" + request.clientCode;
    // 库位号去掉所有空格
    locationCode = locationCode.replace(/\s/g, "");
    // 截取前十位字符
    if (locationCode.length > 10) {
      locationCode = locationCode.substring(0, 10);
    }
    var codeLenSix = locationCode.substring(0, 6);
    var codeLenFour = locationCode.substring(0, 4);
    var codeLenTwo = locationCode.substring(0, 2);
    var selectListSql =
      " id, location_code, client_information, inventory_area, bonded_status, memo, confirming_person, quality_status, " + " client_information_code, area_warehouse_code, area_district ";
    var conditionSql = " enable = '1' AND dr = 0 ";
    var sql =
      " SELECT " +
      selectListSql +
      " FROM AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse_location WHERE " +
      conditionSql +
      " AND location_code = '" +
      locationCode +
      "' AND client_information_code = '" +
      clientCode +
      "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length == 0) {
      var sqlSix =
        " SELECT " +
        selectListSql +
        " FROM AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse_location WHERE " +
        conditionSql +
        " AND location_code leftlike '" +
        codeLenSix +
        "' AND client_information_code = '" +
        clientCode +
        "'";
      var resSix = ObjectStore.queryByYonQL(sqlSix);
      if (resSix.length == 0) {
        var sqlFour =
          " SELECT " +
          selectListSql +
          " FROM AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse_location WHERE " +
          conditionSql +
          " AND location_code leftlike '" +
          codeLenFour +
          "' AND client_information_code = '" +
          clientCode +
          "'";
        var resFour = ObjectStore.queryByYonQL(sqlFour);
        if (resFour.length == 0) {
          var sqlTwo =
            " SELECT " +
            selectListSql +
            " FROM AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse_location WHERE " +
            conditionSql +
            " AND location_code leftlike '" +
            codeLenTwo +
            "' AND client_information_code = '" +
            clientCode +
            "'";
          var resTwo = ObjectStore.queryByYonQL(sqlTwo);
          if (resTwo.length == 0) {
            return { mateStatus: "error", error: "未匹配到库位信息，需要人员维护" };
          } else {
            return { res: resTwo[0], mateStatus: "ok", len: "2" };
          }
        } else {
          return { res: resFour[0], mateStatus: "ok", len: "4" };
        }
      } else {
        return { res: resSix[0], mateStatus: "ok", len: "6" };
      }
    } else {
      return { res: res[0], mateStatus: "ok", len: "10" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });