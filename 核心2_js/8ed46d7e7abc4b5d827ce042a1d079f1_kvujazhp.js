let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let token = request.accessToken;
    let salesOrgId = request.salesOrgId;
    let customerId = request.customerId;
    let year = request.year;
    let month = request.month;
    let nowDate = year + "-" + month;
    let lastDate = "";
    let lastYear = 0;
    let lastMonth = 0;
    if (month === "01") {
      lastYear = year * 1 - 1;
      lastMonth = 12;
    } else {
      lastYear = year * 1;
      lastMonth = month * 1 - 1;
    }
    if (lastMonth >= 10) {
      lastDate = lastYear + "-" + lastMonth;
    } else {
      lastDate = lastYear + "-0" + lastMonth;
    }
    // 获取上月盘点单数据
    var orderData = ObjectStore.queryByYonQL(
      " select product_id,product_name,product_code,product_model, sum(stock) begin_quantity " +
        " from GT6923AT3.GT6923AT3.cgrx_check_order_detail where dr = 0 and " +
        " cgrx_check_order_detailFk in (select id from GT6923AT3.GT6923AT3.cgrx_check_order " +
        " where dr = 0 and sales_org_id='" +
        salesOrgId +
        "' and customer_id = '" +
        customerId +
        "' and check_date like '" +
        lastDate +
        "') group by product_id,product_name,product_code,product_model"
    );
    // 获取本月月盘点单数据
    var nowOrderData = ObjectStore.queryByYonQL(
      "select product_id,product_name,product_code,product_model, sum(stock) stock " +
        " from GT6923AT3.GT6923AT3.cgrx_check_order_detail where dr = 0 and " +
        " cgrx_check_order_detailFk in (select id from GT6923AT3.GT6923AT3.cgrx_check_order " +
        " where dr = 0 and sales_org_id='" +
        salesOrgId +
        "' and customer_id = '" +
        customerId +
        "' and check_date like '" +
        nowDate +
        "') group by product_id,product_name,product_code,product_model"
    );
    // 去上月盘点单中的【库存数量】作为【期末盘点数量】
    orderData.forEach((lastData) => {
      let over_check_quantity = 0;
      nowOrderData.forEach((nowData) => {
        if (lastData.product_id === nowData.product_id) {
          over_check_quantity = nowData.stock;
          return;
        }
      });
      lastData.over_check_quantity = over_check_quantity;
    });
    // 查询【入库数量】
    let recordListParams = [];
    let recordListData = [];
    let queryProductData = [];
    let beginDate = year + "-" + month + "-01 00:00:00";
    let endDate = year + "-" + month + "-31 23:59:59";
    orderData.forEach((item) => {
      let addQuantity = 0;
      let skuIdParams = new Array(item.product_id);
      var queryProduct = postman(
        "post",
        "https://www.example.com/" + token,
        null,
        JSON.stringify({ fields: ["productId", "id"], idList: [skuIdParams] })
      );
      let productId = JSON.parse(queryProduct).data[0] && JSON.parse(queryProduct).data[0].recordList[0].productId;
      let param = {
        pageIndex: 1,
        pageSize: 10,
        isSum: false,
        simpleVOs: [
          {
            field: "salesOrg",
            op: "in",
            value1: new Array(salesOrgId)
          },
          {
            field: "cust",
            op: "in",
            value1: new Array(customerId)
          },
          {
            field: "details.product",
            op: "in",
            value1: new Array(productId)
          },
          {
            field: "receivingTime",
            op: "between",
            value1: beginDate,
            value2: endDate
          }
        ]
      };
      param.pageSize = 10000;
      var orders = postman("post", "https://www.example.com/" + token, null, JSON.stringify(param));
      let recordList = JSON.parse(orders).data.recordList;
      recordListParams.push(param);
      recordListData.push(recordList);
      recordList.forEach((record) => {
        if (record.details_product === productId) {
          addQuantity += record.qty;
        }
      });
      item.add_quantity = addQuantity;
    });
    return { orderData, nowOrderData, request, lastDate, nowDate, recordListData, recordListParams };
  }
}
exports({ entryPoint: MyAPIHandler });