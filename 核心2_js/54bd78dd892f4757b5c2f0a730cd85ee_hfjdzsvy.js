let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //传入参数sqlType：类型
    //如果是check 传1.sql语句 sqlTableInfo 2.哪个库 sqlCg
    //如果是update 传1.url dataUrl 2.更新体数据 dataObject 3.表名 dataName
    //执行类型 查询 check，更新 update，新增 add 删除del
    let sqlType = request.sqlType;
    let resDataRs = [];
    if ("check" === sqlType) {
      let sqlInfo = request.sqlTableInfo; //sql语句
      let whereand = request.checkWhere; //中文拼接语句
      if (typeof whereand !== undefined && whereand != null && whereand !== "") {
        sqlInfo = sqlInfo + " " + whereand;
      }
      let sqlCg = request.sqlCg; //哪个库
      if (sqlCg == "Iud1") {
        sqlCg = "";
      }
      resDataRs = ObjectStore.queryByYonQL(sqlInfo);
      if (resDataRs.length === 0 || typeof resDataRs == "undefined") {
        resDataRs = [];
        return { resDataRs };
      }
      return { resDataRs };
    }
    if ("update" === sqlType) {
      resDataRs = ObjectStore.updateById(request.dataUrl, request.dataObject, request.dataName);
      if (resDataRs.length === 0 || typeof resDataRs == "undefined") {
        resDataRs = [];
        return { resDataRs };
      }
      return { resDataRs };
    }
    if ("add" === sqlType) {
      resDataRs = ObjectStore.insert(request.dataUrl, request.dataObject, request.dataName); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
      if (resDataRs.length === 0 || typeof resDataRs == "undefined") {
        resDataRs = [];
        return { resDataRs };
      }
      return { resDataRs };
    }
    if ("del" === sqlType) {
      // 描述	逻辑删除实体，需要包含主键ID。支持删除主实体和子实体。如果删除的是主实体，则级联删除子实体
      resDataRs = ObjectStore.deleteById(request.dataUrl, request.dataObject, request.dataName);
      if (resDataRs.length === 0 || typeof resDataRs == "undefined") {
        resDataRs = [];
        return { resDataRs };
      }
      return { resDataRs };
    }
  }
}
exports({ entryPoint: MyAPIHandler });