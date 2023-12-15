let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configId = request.configId; //最小包装id
    let udiCodeList = request.udiCodeList; //udi列表
    let sonUdiList = request.sonUdiList; //子包装udi列表
    //查询包装信息和对应商品信息
    let querySql =
      "select t1.*,t2.* from GT22176AT10.GT22176AT10.sy01_udi_product_configure2 t1 left join GT22176AT10.GT22176AT10.sy01_udi_product_info t2 on t1.sy01_udi_product_info_id = t2.id  where t1.id='" +
      configId +
      "')";
    let udiConfigObj = ObjectStore.queryByYonQL(querySql);
    let udiFileList = []; //udi主档列表
    for (let i = 0; i < udiCodeList.length; i++) {
      if (udiCodeList[i].udiState == 2) {
        throw new Error("请选择未发布状态的UDI！");
      }
      udiCodeList[i].udiConfigId = configId;
      udiCodeList[i].udiState = 2;
      let udiFile = {};
      udiFile.UDI = udiCodeList[i].udiCode;
      udiFile.validateDate = udiCodeList[i].periodValidity;
      udiFile.produceDate = udiCodeList[i].dateManufacture;
      udiFile.batchNo = udiCodeList[i].batchNo;
      udiFile.serialNumber = udiCodeList[i].serialNo;
      udiFile.DI = "(01)" + udiCodeList[i].productUdi;
      let DIIndexOf = udiCodeList[i].udiCode.indexOf(udiFile.DI);
      udiFile.PI = udiCodeList[i].udiCode.substr(0, DIIndexOf); //PI为udi截取掉01+产品标识
      udiFileList.push(udiFile);
    }
    if (sonUdiList != null && sonUdiList.length > 0) {
    }
    let res = ObjectStore.insertBatch("GT22176AT10.GT22176AT10.sy01_udi_data_info4", udiCodeList, "sy01_udi_data_info4");
    return { result: udiCodeList };
  }
}
exports({ entryPoint: MyAPIHandler });