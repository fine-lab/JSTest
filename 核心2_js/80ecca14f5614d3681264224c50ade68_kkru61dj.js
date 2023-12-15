let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let errorMsg = "";
    let inInvoiceOrg = request.inInvoiceOrg;
    let wareHouseId = request.wareHouseId;
    let rows = request.rows;
    //查询是否GSP参数是否配置了，并且判断异常
    let gspControlStorageFlag = 0;
    let gmpControlStorageFlag = 0;
    try {
      let queryGSPParam = "select org_id,stoconditioncontrol from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where org_id = '" + inInvoiceOrg + "' and dr = 0";
      let GSPParamInfo = ObjectStore.queryByYonQL(queryGSPParam);
      //如果gsp中没有配置，再去gmp中寻找
      if (GSPParamInfo != undefined && GSPParamInfo.length != 0 && (GSPParamInfo[0].stoconditioncontrol == 1 || GSPParamInfo[0].stoconditioncontrol == "1")) {
        gspControlStorageFlag = 1;
      }
      if (GSPParamInfo != undefined && GSPParamInfo.length != 0 && (GSPParamInfo[0].stoconditioncontrol == 2 || GSPParamInfo[0].stoconditioncontrol == "2")) {
        gspControlStorageFlag = 2;
      }
    } catch (e) {}
    try {
      let queryGMPParam = "select FinanceOrg,storageControl from 	ISY_2.ISY_2.SY01_gmpparams where FinanceOrg = '" + inInvoiceOrg + "' and dr = 0";
      let GMPParamInfo = ObjectStore.queryByYonQL(queryGMPParam);
      //如果GMP也没有配置，那么直接返回
      if (GMPParamInfo != undefined || (GMPParamInfo.length != 0 && (GMPParamInfo[0].storageControl == 1 || GMPParamInfo[0].storageControl == "1"))) {
        gmpControlStorageFlag = 1;
      }
      if (GMPParamInfo != undefined || (GMPParamInfo.length != 0 && (GMPParamInfo[0].storageControl == 2 || GMPParamInfo[0].storageControl == "2"))) {
        gmpControlStorageFlag = 2;
      }
    } catch (e) {
      //如果异常，则没有安装gmp，
    }
    //如果两边都没有设置，那么直接返回
    if (gspControlStorageFlag == 0 && gmpControlStorageFlag == 0) {
      return { errorMsg };
    }
    if ((gspControlStorageFlag == 1 && gmpControlStorageFlag == 2) || (gspControlStorageFlag == 2 && gmpControlStorageFlag == 1)) {
      errorMsg += "此组织gsp管理参数、gmp管理参数中对存储条件控制设置不一致";
      return { errorMsg };
    }
    let queryWareHouse = "select id,name,extend_temperature_up,extend_temperature_down,extend_humidity_up,extend_humidity_down  from  aa.warehouse.Warehouse where id = '" + wareHouseId + "'";
    let warehouseInfo = ObjectStore.queryByYonQL(queryWareHouse, "productcenter")[0];
    let storageConditions = ObjectStore.queryByYonQL("select * from  GT22176AT10.GT22176AT10.SY01_stocondv2");
    let storageInfos = {};
    for (let i = 0; i < storageConditions.length; i++) {
      if (!storageInfos.hasOwnProperty(storageConditions[i].id)) {
        storageInfos[storageConditions[i].id] = {};
      }
      storageInfos[storageConditions[i].id].maxTemperature = storageConditions[i].maxTemperature;
      storageInfos[storageConditions[i].id].minTemperature = storageConditions[i].minTemperature;
      storageInfos[storageConditions[i].id].maxHumidity = storageConditions[i].maxHumidity;
      storageInfos[storageConditions[i].id].minHumidity = storageConditions[i].minHumidity;
    }
    //校验
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].extendStorageCondition != undefined && storageInfos.hasOwnProperty(rows[i].extendStorageCondition)) {
        if (
          warehouseInfo.extend_temperature_up > storageInfos[rows[i].extendStorageCondition].maxTemperature ||
          warehouseInfo.extend_temperature_down < storageInfos[rows[i].extendStorageCondition].minTemperature ||
          warehouseInfo.extend_humidity_up > storageInfos[rows[i].extendStorageCondition].maxHumidity ||
          warehouseInfo.extend_humidity_down < storageInfos[rows[i].extendStorageCondition].minHumidity
        ) {
          errorMsg += "第" + (i + 1) + "行物料【" + rows[i].product_cName + "】的存储条件与仓库温湿度不匹配,请检查\n";
        }
        if (
          (warehouseInfo.extend_temperature_up == undefined && storageInfos[rows[i].extendStorageCondition].maxTemperature != undefined) ||
          (warehouseInfo.extend_temperature_down == undefined && storageInfos[rows[i].extendStorageCondition].minTemperature != undefined) ||
          (warehouseInfo.extend_humidity_up == undefined && storageInfos[rows[i].extendStorageCondition].maxHumidity != undefined) ||
          (warehouseInfo.extend_humidity_down == undefined && storageInfos[rows[i].extendStorageCondition].minHumidity != undefined)
        ) {
          errorMsg += "第" + (i + 1) + "行物料【" + rows[i].product_cName + "】存储条件有要求，但是仓库没有相关数值\n";
        }
      }
    }
    return { errorMsg };
  }
}
exports({ entryPoint: MyAPIHandler });