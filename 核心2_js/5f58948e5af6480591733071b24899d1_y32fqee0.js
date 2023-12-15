let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "" + request.importSubtable.委托方编码;
    var clientCodeSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where clientCode='" + code + "'";
    var clientCodeRes = ObjectStore.queryByYonQL(clientCodeSql, "developplatform");
    if (clientCodeRes.length == 0) {
      return { err: "不存在，需要维护后再进行导入" };
    }
    var isEntrustTag = "" + request.importSubtable.是否委托加贴中文标;
    if ("0" == isEntrustTag || "1" == isEntrustTag) {
    } else {
      return { err: "委托方子表" + code + "是否委托加贴中文标字段值类型错误，请校验后后再进行导入" };
    }
    var tableId = clientCodeRes[0].id;
    var clientEnterpriseName = clientCodeRes[0].clientEnterpriseName;
    var ContractSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.entrustmentContract where ClientInformation_id='" + tableId + "'";
    var ContractRes = ObjectStore.queryByYonQL(ContractSql, "developplatform");
    var startDates = request.importSubtable.开始委托时间;
    if (startDates != "/") {
      //判断获取的日期是什么类型是number的话就处理日期
      var hasNumber = typeof startDates;
      if (hasNumber == "number") {
        var format = "-";
        let time = new Date((startDates - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
        let year = time.getFullYear() + "";
        let month = time.getMonth() + 1 + "";
        let date = time.getDate() + "";
        const hours = time.getHours().toLocaleString();
        const minutes = time.getMinutes();
        if (format && format.length === 1) {
          startDates = year + format + month + format + date + " " + hours + ":" + minutes;
        }
        startDates = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
      }
    } else {
      startDates = "";
    }
    var endDates = request.importSubtable.停止委托时间;
    if (endDates != "/") {
      //判断获取的日期是什么类型是number的话就处理日期
      var hasNumber = typeof endDates;
      if (hasNumber == "number") {
        var format = "-";
        let time = new Date((endDates - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
        let year = time.getFullYear() + "";
        let month = time.getMonth() + 1 + "";
        let date = time.getDate() + "";
        const hours = time.getHours().toLocaleString();
        const minutes = time.getMinutes();
        if (format && format.length === 1) {
          endDates = year + format + month + format + date + " " + hours + ":" + minutes;
        }
        endDates = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
      }
    } else {
      endDates = "";
    }
    if (ContractRes.length == 0) {
      //新增
      if (
        code == null ||
        startDates == null ||
        endDates == null ||
        request.importSubtable.委托期限 == null ||
        request.importSubtable.委托业务范围 == null ||
        request.importSubtable.是否委托加贴中文标 == null
      ) {
        return { err: "委托方子表" + code + "有必填项为空，需要维护后再进行导入" };
      }
      var insertSubtable = {
        id: tableId,
        entrustmentContractList: [
          {
            clientCode: code,
            clientEnterpriseName: "" + request.information.委托方企业名称,
            startDate: startDates,
            endDate: endDates,
            entrustTerm: request.importSubtable.委托期限,
            entrustBusiScope: "" + request.importSubtable.委托业务范围,
            isEntrustTag: "" + request.importSubtable.是否委托加贴中文标,
            _status: "Insert"
          }
        ]
      };
      var insertSubtableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", insertSubtable, "d3e1247e");
      if (insertSubtableRes != null) {
        return { type: "add" };
      } else {
        return { insertSubtableRes };
      }
    } else {
      //修改
      var subId = ContractRes[0].id;
      if (
        code == null ||
        request.information.委托方企业名称 == null ||
        startDates == null ||
        endDates == null ||
        request.importSubtable.委托期限 == null ||
        request.importSubtable.委托业务范围 == null ||
        request.importSubtable.是否委托加贴中文标 == null
      ) {
        return { err: "委托方子表" + code + "有必填项为空，需要维护后再进行导入" };
      }
      var updateSubtable = {
        id: tableId,
        entrustmentContractList: [
          {
            id: subId,
            clientCode: code,
            clientEnterpriseName: clientEnterpriseName,
            startDate: startDates,
            endDate: endDates,
            clientEnterpriseName: "" + request.information.委托方企业名称,
            entrustTerm: request.importSubtable.委托期限,
            entrustBusiScope: "" + request.importSubtable.委托业务范围,
            isEntrustTag: "" + request.importSubtable.是否委托加贴中文标,
            _status: "Update"
          }
        ]
      };
      var updateSubtableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", updateSubtable, "d3e1247e");
      if (updateSubtableRes != null) {
        return { type: "change" };
      } else {
        return { updateSubtableRes };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });