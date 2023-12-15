let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configId = request.configId; //最小包装id
    let billCode = request.billCode; //来源单号
    let billType = request.billType; //来源单类型
    //查询子包装id
    let sonConfigObj = ObjectStore.queryByYonQL(
      "select * from GT22176AT10.GT22176AT10.sy01_udi_product_configure2 where sy01_udi_product_info_id in (select sy01_udi_product_info_id from GT22176AT10.GT22176AT10.sy01_udi_product_configure2 where id ='" +
        configId +
        "') and bzcpbs in (select bznhxyjbzcpbs from GT22176AT10.GT22176AT10.sy01_udi_product_configure2 where id ='" +
        configId +
        "')"
    );
    if (sonConfigObj == null || sonConfigObj.length == 0) {
      return { result: [] };
    }
    //查询子包装未关联父包装的UDI
    let udiCodeList = ObjectStore.queryByYonQL(
      "select * from GT22176AT10.GT22176AT10.sy01_udi_data_info4 where udiCode in (select UDI from GT22176AT10.GT22176AT10.UDIFile where parentUdiId is null and packageIdentification = '" +
        sonConfigObj[0].bzcpbs +
        "' and id in(select UDIFile_id from GT22176AT10.GT22176AT10.UDITrack where billNo = '" +
        billCode +
        "')) and udiConfigId='" +
        sonConfigObj[0].id +
        "' and sourceCode = '" +
        billCode +
        "' and sourceType = '" +
        billType +
        "'"
    );
    return { result: udiCodeList };
  }
}
exports({ entryPoint: MyAPIHandler });