let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //判断是否有bom物料编码
    let material = request.code;
    let sql = "";
    if (material) {
      sql =
        "select *,(select wuliaobianma,wuliao from BillOfMaterialSonList a ) from AT15F164F008080007.AT15F164F008080007.BillOfMaterial where dr=0 and bombianma='" +
        material +
        "' and inspectType ='01'";
    } else {
      sql = "select *,(select wuliaobianma,wuliao from BillOfMaterialSonList a ) from AT15F164F008080007.AT15F164F008080007.BillOfMaterial where dr=0  and inspectType ='01'";
    }
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });