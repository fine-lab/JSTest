let AbstractAPIHandler = require("AbstractAPIHandler");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let refData = request.refData; //参照信息
    let warehouse = request.warehouse; //仓库信息
    let warehouseCndStr = "define2";
    let productCndStr = "define4";
    let goodsCndStr = "define1";
    // 启用存放检查
    let warehouseInfos;
    if (!queryUtils.isEmpty(warehouse)) {
      let sql = "select id," + warehouseCndStr + " as  " + warehouseCndStr + " from aa.warehouse.WarehouseDefine " + "where id in (" + warehouse + ")";
      warehouseInfos = ObjectStore.queryByYonQL(sql, "productcenter");
      if (queryUtils.isEmpty(warehouseInfos) || !warehouseInfos[0][warehouseCndStr] || warehouseInfos[0][warehouseCndStr] == "否") {
        return { res: "" };
      }
    } else {
      return { res: "" };
    }
    let productArray = []; // 物料sku
    let goodspositionArray = []; // 货位
    //收集物料与货位id
    if (!queryUtils.isEmpty(refData)) {
      for (let i = 0; i < refData.length; i++) {
        let product = refData[i].id; // 物料sku
        let goodsposition = refData[i].goodsposition; // 货位
        if (product) productArray.push(product);
        if (goodsposition) goodspositionArray.push(goodsposition);
      }
    }
    // 查询物料的存放条件
    let productInfos;
    if (!queryUtils.isEmpty(productArray)) {
      let sql = "select product,define1," + productCndStr + " from aa.product.ProductProps " + "where product in (" + productArray + ")";
      productInfos = ObjectStore.queryByYonQL(sql, "productcenter");
    }
    let productInfosMap = {};
    if (!queryUtils.isEmpty(productInfos)) {
      productInfos.forEach((row) => {
        productInfosMap[row.product] = { productCndStr: row[productCndStr] };
      });
    }
    // 查询货位的存放条件
    let goodsInfos;
    if (!queryUtils.isEmpty(goodspositionArray)) {
      let sql = "select id, " + goodsCndStr + " as " + goodsCndStr + " from aa.goodsposition.GoodsPositionDefine " + "where id in (" + goodspositionArray + ")";
      goodsInfos = ObjectStore.queryByYonQL(sql, "productcenter");
    }
    let goodsInfosMap = {};
    if (!queryUtils.isEmpty(goodsInfos)) {
      goodsInfos.forEach((row) => {
        goodsInfosMap[row.id] = { goodsCndStr: row[goodsCndStr] };
      });
    }
    let res = "";
    //检查存放条件
    if (!queryUtils.isEmpty(refData)) {
      for (let i = 0; i < refData.length; i++) {
        let product = refData[i].id; // 物料sku
        let goodsposition = refData[i].goodsposition; // 货位
        let productStorageCnd = "空"; //物料存放条件
        let goodspositionStorageCnd = "空"; //货位存放条件
        if (product && productInfosMap[product] && productInfosMap[product].productCndStr) {
          productStorageCnd = productInfosMap[product].productCndStr;
        }
        if (goodsposition && goodsInfosMap[goodsposition] && goodsInfosMap[goodsposition].goodsCndStr) {
          goodspositionStorageCnd = goodsInfosMap[goodsposition].goodsCndStr;
        }
        if (productStorageCnd != goodspositionStorageCnd) {
          res = res.concat('当前药品存放条件为"', productStorageCnd, '"', "与货位存放条件", '"', goodspositionStorageCnd, '"不一致\r\n');
        }
      }
    }
    if (res.length > 0) {
      res = res.concat("是否继续");
    }
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });