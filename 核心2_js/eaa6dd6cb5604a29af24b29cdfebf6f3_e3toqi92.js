let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let productArr = request.productArr;
    let yhtuserId = request.yhtuserId;
    let time = request.time;
    let orgId = request.orgId;
    //新增临时表
    let reqParams = { productArr: productArr, yhtuserId: yhtuserId, time: time };
    let funcInsert = extrequire("GT2152AT10.rule.temin");
    funcInsert.execute(reqParams);
    //关联临时表查询
    let sql = "select shelvesData,shelvesData.shelvesName as shelvesName ,warehouse,baseOrg,product from GT2152AT10.GT2152AT10.productShelves";
    sql += " left join GT2152AT10.GT2152AT10.tem_product tem on product=tem.product where baseOrg = '" + orgId + "'";
    sql += " and tem.yhtuserId='" + yhtuserId + "' and tem.time='" + time + "'";
    let res = ObjectStore.queryByYonQL(sql, "developplatform"); //因为是调用标准版构建的应用，所以必须传递第二个参数：developplatform
    //删除临时表
    let reqParamsDelete = { data: { yhtuserId: yhtuserId, time: time } };
    let funcDelete = extrequire("GT2152AT10.rule.temde");
    funcDelete.execute(reqParamsDelete);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });