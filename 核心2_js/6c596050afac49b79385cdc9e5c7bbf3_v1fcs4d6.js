let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let productId = request.id; //物料id
    let orgId = request.orgId; //销售组织id
    let agentId = request.agentId; //客户id
    let billdata = request.billdata; //单据日期
    let queryAgent = "select * from aa.merchant.Merchant where id='" + agentId + "'";
    let agentRes = ObjectStore.queryByYonQL(queryAgent, "productcenter");
    if (agentRes.length == 0) {
      throw new Error("查询价格表失败，未找到对应的客户信息！");
    }
    let agentLevelId = agentRes[0].channCustomerLevel; //客户级别
    let agentAreaId = agentRes[0].channCustomerArea; //客户级别
    let result = undefined;
    let sql = "";
    let priceres = undefined;
    //先依据【客户分类+商品】模板查询价格表
    if (agentAreaId != null) {
      sql =
        " select id,beginDate,endDate,isLadderPrice,price,enable,orgScope from marketing.price.PriceRecord where enable=1 and orgScope='" +
        orgId +
        "' and beginDate<='" +
        billdata +
        "'" +
        " and endDate>='" +
        billdata +
        "' and id in ( select priceRecordId from marketing.price.PriceRecordDimension where agentAreaId= '" +
        agentAreaId +
        "' and productId='" +
        productId +
        "') order by beginDate desc limit 1";
      priceres = ObjectStore.queryByYonQL(sql, "marketingbill");
      if (priceres.length > 0) {
        let priceRecord = priceres[0];
        if (priceRecord.isLadderPrice == true) {
          let jtjgsql = "select price,amountFloor from marketing.price.PriceRecordGradient where priceRecordId= '" + priceRecord.id + "'";
          let priceList = ObjectStore.queryByYonQL(jtjgsql, "marketingbill");
          result = priceList;
          return { result };
        } else {
          result = priceRecord;
          return { result };
        }
      }
    }
    //未找到的话再依据【客户级别+商品】模板查询价格表
    if (agentLevelId != null) {
      sql =
        " select id,beginDate,endDate,isLadderPrice,price,enable,orgScope from marketing.price.PriceRecord where enable=1 and orgScope='" +
        orgId +
        "' and beginDate<='" +
        billdata +
        "'" +
        " and endDate>='" +
        billdata +
        "' and id in ( select priceRecordId from marketing.price.PriceRecordDimension" +
        " where agentLevelId= '" +
        agentLevelId +
        "' and productId='" +
        productId +
        "') order by beginDate desc limit 1";
      priceres = ObjectStore.queryByYonQL(sql, "marketingbill");
      if (priceres.length > 0) {
        let priceRecord = priceres[0];
        if (priceRecord.isLadderPrice == true) {
          let jtjgsql = "select price,amountFloor from marketing.price.PriceRecordGradient where priceRecordId= '" + priceRecord.id + "'";
          let priceList = ObjectStore.queryByYonQL(jtjgsql, "marketingbill");
          result = priceList;
          return { result };
        } else {
          result = priceRecord;
          return { result };
        }
      }
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });