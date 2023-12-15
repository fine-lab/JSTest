let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var selectData = request.selectData;
    //依据检测订单主键查询对应子表 BOM编码、子表id、导入小组、供应商：材料出库单号为空
    var querBody =
      "select billOfMaterial,id,ImportTeam,gongyingshang from  AT15F164F008080007.AT15F164F008080007.BOMImport where DetectOrder_id='" + selectData.id + "' and dr=0 and Materialdelivery is null";
    var bodyRes = ObjectStore.queryByYonQL(querBody, "developplatform");
    var returnBody = Array();
    if (bodyRes.length) {
      for (var i = 0; i < bodyRes.length; i++) {
        //判断BOM类型 需为自检
        if (bodyRes[i].gongyingshang != null) continue; //BOM委外
        //依据BOM物料清单主键查询对应子表 物料id、物料用量
        let querBOMSql = "select wuliaobianma,wuliao from AT15F164F008080007.AT15F164F008080007.BillOfMaterialSon where BillOfMaterial_id='" + bodyRes[i].billOfMaterial + "'";
        var bomRes = ObjectStore.queryByYonQL(querBOMSql, "developplatform");
        if (bomRes.length > 0) {
          bodyRes[i].boms = bomRes;
          bodyRes[i].orgId = selectData.organizationId;
          bodyRes[i].xiangmu = selectData.testItemCode;
          bodyRes[i].cpxId = selectData.chanpinxian;
          bodyRes[i].groupName = selectData.BOMImportList_ImportTeam_name;
          returnBody.push(bodyRes[i]);
        } else {
          continue;
        }
      }
    } else {
      throw new Error("未找到【" + selectData.sampleCode + "】所属的明细信息！");
    }
    return { returnBody };
  }
}
exports({ entryPoint: MyAPIHandler });