let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configId = request.configId; //最小包装id
    let billCode = request.billCode; //来源单号
    let billType = request.billType; //来源单类型
    //查询子包装id
    let sonConfigObj = ObjectStore.queryByYonQL(
      "select * from ISVUDI.ISVUDI.sy01_udi_product_configurev2 where sy01_udi_product_info_id in (select sy01_udi_product_info_id from ISVUDI.ISVUDI.sy01_udi_product_configurev2 where id ='" +
        configId +
        "') and bzcpbs in (select bznhxyjbzcpbs from ISVUDI.ISVUDI.sy01_udi_product_configurev2 where id ='" +
        configId +
        "')"
    );
    if (sonConfigObj == null || sonConfigObj.length == 0) {
      return { result: [] };
    }
    //查询子包装未关联父包装的UDI
    let udiCodeList = ObjectStore.queryByYonQL(
      "select UDI udiCode from ISVUDI.ISVUDI.UDIFilev2 where parentUdiId is null and packageIdentification = '" +
        sonConfigObj[0].bzcpbs +
        "' and id in(select UDIFile_id from ISVUDI.ISVUDI.UDITrackv2 where trackingDirection ='生成' and billNo = '" +
        billCode +
        "')"
    );
    return { result: udiCodeList };
  }
}
exports({ entryPoint: MyAPIHandler });