let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var productId_in = param.productId_in; //物料主键，in形式的
    var orgcode = param.orgcode; //销售组织编码
    var priceSql =
      "select name as tempname,b.creationOrgId,org.code as orgcode,b.code,b.name as bname,b.beginDate,b.endDate, " +
      " c.price,d.productId,e.name " +
      " from marketing.price.PriceTemplate " +
      " inner join  marketing.price.PriceAdjustment b on id = b.priceTemplateId " +
      " inner join marketing.price.PriceAdjustDetail c on b.id = c.priceAdjustmentId " +
      " inner join marketing.price.PriceAdjustDetailDimension d on c.id = d.priceAdjustDetailId " +
      " inner join pc.product.Product e on e.id =d.productId " +
      " inner join org.func.BaseOrg org on org.id = b.creationOrgId " +
      " where name = '客户+商品' and e.id in (" +
      productId_in +
      ") and org.code = '" +
      orgcode +
      "' ";
    var priceInfo = ObjectStore.queryByYonQL(priceSql);
    const priceMap = new Map();
    for (let j = 0; j < priceInfo.length; j++) {
      let pmp = priceInfo[j];
      let productIdKey = pmp.d_productId;
      priceMap.set(productIdKey, pmp);
    }
    return { priceMap: priceMap };
  }
}
exports({ entryPoint: MyTrigger });