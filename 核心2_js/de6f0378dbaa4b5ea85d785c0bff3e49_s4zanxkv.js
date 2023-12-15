let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pageIndex = 1;
    let creatorParam = { pageIndex: pageIndex, pageSize: "300" };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1992457609780002", JSON.stringify(creatorParam));
    let creatordata = JSON.parse(apiResponse);
    let code = 200; // 默认值
    let id = "";
    let vendor_name = "";
    let org_name = "";
    let errormsg = "";
    let resultArrayList = [];
    const orgNamePattern = new RegExp(request.org_name, "i"); // 'i' 表示不区分大小写
    const vendorNamePattern = new RegExp(request.vendor_name, "i");
    if (creatordata != null && creatordata.code != null && creatordata.code == "200") {
      let data = creatordata.data;
      let foundMatch = false;
      let resultArrayList = [];
      for (let pageIndex = 1; pageIndex <= data.pageCount; pageIndex++) {
        let innerArrayList = []; // 在每次循环开始前创建一个新的内部数组
        data.recordList.forEach((record) => {
          if (
            record.code == request.code ||
            (request.status == record.status && record.org_name.match(orgNamePattern) && record.vendor_name.match(vendorNamePattern) && record.product_cName == request.product_cName)
          ) {
            code = record.code; //订单编号
            id = record.id; //订单id
            let sourceid = record.purchaseOrders_id;
            let org = record.org; //采购组织
            org_name = record.org_name; //采购组织
            let inOrg = record.inOrg; //收货组织
            let inOrg_name = record.inOrg_name; //收货组织
            let inInvoiceOrg = record.inInvoiceOrg; //收票组织
            let inInvoiceOrg_name = record.inInvoiceOrg_name; //收票组织
            let product = record.product; //物料id
            let product_cName = record.product_cName; //物料名称
            vendor_name = record.vendor_name; //供应商名称
            let vendor_code = record.vendor_code; //供应商编码
            let priceUOM_Name = record.priceUOM_Name; //计价单位名称
            let priceUOM = record.priceUOM; //计价单位id
            let totalRecieveQty = record.totalRecieveQty; //累计到货数量
            let oriUnitPrice = record.oriUnitPrice; //无税单价
            let oriTaxUnitPrice = record.oriTaxUnitPrice; //含税单价
            let oriMoney = record.listOriMoney; //无税金额
            let oriSum = record.oriSum; //含税金额
            let oriTax = record.listOriTax; //税额
            let taxitems_code = record.purchaseOrders_taxitems_code; //税率
            let invExchRate = record.purchaseOrders_invExchRate; //采购换算率
            let unitExchangeTypePrice = record.purchaseOrders_invPriceExchRate; //计价单位转换率的换算方式
            let status = record.status; //状态
            innerArrayList.push({
              code: code,
              id: id,
              sourceid: sourceid,
              org: org,
              org_name: org_name,
              inOrg: inOrg,
              inOrg_name: inOrg_name,
              inInvoiceOrg: inInvoiceOrg,
              inInvoiceOrg_name: inInvoiceOrg_name,
              product: product,
              product_cName: product_cName,
              vendor_name: vendor_name,
              vendor_code: vendor_code,
              priceUOM_Name: priceUOM_Name,
              priceUOM: priceUOM,
              totalRecieveQty: totalRecieveQty,
              oriUnitPrice: oriUnitPrice,
              oriTaxUnitPrice: oriTaxUnitPrice,
              oriMoney: oriMoney,
              oriSum: oriSum,
              oriTax: oriTax,
              taxitems_code: taxitems_code,
              invExchRate: invExchRate,
              unitExchangeTypePrice: unitExchangeTypePrice,
              status: status
            });
            foundMatch = true;
          }
        });
        resultArrayList.push(...innerArrayList); // 将内部数组添加到结果数组中
      }
      if (foundMatch) {
        return {
          code: "200",
          recordList: resultArrayList
        };
      } else {
        return { code: 999, errormsg: "找不到符合条件的记录,请检查传的值是否正确" };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });