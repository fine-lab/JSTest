let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 销售价格保存校验价格不为空以及销售组织+物料+客户唯一性
    let data = param.data;
    for (let bill of data) {
      let { id, org_id, salesPriceList_bList } = bill;
      let object = { salesPriceList_bFk: id };
      let originItems = ObjectStore.selectByMap("GT7239AT6.GT7239AT6.salesPriceList_b", object);
      if (salesPriceList_bList && salesPriceList_bList.length) {
        salesPriceList_bList.map((item) => {
          if (item.price === 0) {
            throw new Error("价格需要大于0");
          }
        });
      }
      if (!originItems || originItems.length <= 0) {
        continue;
      }
      let updateVOs = originItems.map(function (item) {
        return { id: item.id, SalesOrgVO: org_id, _status: "Update" };
      });
      var updateRes = ObjectStore.updateBatch("GT7239AT6.GT7239AT6.salesPriceList_b", updateVOs);
      for (let item of originItems) {
        let { product, merchant, productionDate } = item;
        let sql = `select * from GT7239AT6.GT7239AT6.salesPriceList_b where SalesOrgVO = ${org_id} and merchant = ${merchant} and product = ${product}`;
        let sameItems = ObjectStore.queryByYonQL(sql + " and productionDate = '" + productionDate + "'");
        if (sameItems && sameItems.length > 1) {
          throw new Error("数据已重复，请检查");
        }
      }
    }
    return null;
  }
}
exports({ entryPoint: MyTrigger });