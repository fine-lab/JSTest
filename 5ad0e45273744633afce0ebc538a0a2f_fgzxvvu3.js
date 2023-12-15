let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("PU.frontDefaultGroup.CommonUtilsQuery");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let bill = param.data[0];
    let org = bill.org;
    let arrivalOrders = bill.arrivalOrders;
    if (!arrivalOrders) {
      return {};
    }
    debugger;
    for (let irow = 0; irow < arrivalOrders.length; irow++) {
      let arrivalOrder = arrivalOrders[irow];
      let warehouse = arrivalOrder.warehouse; //仓库ID
      let product = arrivalOrder.product; //物料
      let productsku = arrivalOrder.productsku; //SKU
      let batchno = arrivalOrder.batchno; //批次编码
      if (queryUtils.isEmpty(warehouse)) {
        return {};
      }
      // 根据仓库ID查询
      let selectsql = "select isGoodsPosition,defineCharacter " + "from aa.warehouse.Warehouse " + "where id=" + warehouse;
      //档案仓库是否开启：货位管理: true 开启货位管理，false:则不开启货位管理
      let whdefine = ObjectStore.queryByYonQL(selectsql, "productcenter");
      if (!whdefine || whdefine.length == 0 || (whdefine[0].isGoodsPosition != "true" && whdefine[0].isGoodsPosition != "1" && whdefine[0].isGoodsPosition != "是")) {
        return {};
      }
      //建议货位是否开启
      if (
        whdefine.length == 0 ||
        !whdefine[0].defineCharacter ||
        (whdefine[0].defineCharacter.SFQYJYHW != "true" &&
          whdefine[0].defineCharacter.SFQYJYHW != "1" &&
          whdefine[0].defineCharacter.SFQYJYHW != "是" &&
          whdefine[0].defineCharacter.SFQYJYHW != "启用")
      ) {
        return {};
      }
      let locSkuBatch = [];
      let locSku = [];
      if (!queryUtils.isEmpty(productsku)) {
        let sql = "select location,batchno " + "from stock.currentstock.CurrentStockLocation " + "where org=" + org + " and warehouse=" + warehouse + " and productsku=" + productsku;
        let locIds = ObjectStore.queryByYonQL(sql, "ustock");
        for (let i = 0; i < locIds.length; i++) {
          let locId = locIds[i];
          if (!queryUtils.isEmpty(batchno)) {
            if (batchno == locId.batchno) {
              locSkuBatch.push(locId.location);
            }
          }
          if (locSkuBatch.length === 0) {
            locSku.push(locId.location);
          }
        }
      }
      if (locSkuBatch.length === 0 && locSku.length === 0) {
        let sql = "select location,batchno " + "from stock.currentstock.CurrentStockLocation " + "where org=" + org + " and warehouse=" + warehouse + " and product=" + product;
        let locIds = ObjectStore.queryByYonQL(sql, "ustock");
        for (let i = 0; i < locIds.length; i++) {
          let locId = locIds[i];
          if (!queryUtils.isEmpty(batchno)) {
            if (batchno == locId.batchno) {
              locSkuBatch.push(locId.location);
            }
          }
          if (locSkuBatch.length === 0) {
            locSku.push(locId.location);
          }
        }
      }
      //采购入库单子表：1.PurInRecords 按物料SKU+批次号  查询最新一条数据
      debugger;
      //采购入库单子表1. 物料SKU+批次号 查询最新一条数据
      if (locSkuBatch.length === 0 && locSku.length === 0 && !queryUtils.isEmpty(productsku) && !queryUtils.isEmpty(batchno)) {
        let sql =
          "select goodsposition as location,batchno " +
          "from st.purinrecord.PurInRecords t " +
          "left join mainid on t.mainid=mainid.id " +
          "where mainid.org=" +
          org +
          " and mainid.warehouse=" +
          warehouse +
          " and productsku=" +
          productsku +
          " and batchno='" +
          batchno +
          "'" +
          " order by mainid.vouchdate desc," +
          " mainid.createTime desc limit 1";
        let locIds = ObjectStore.queryByYonQL(sql, "ustock");
        if (locIds.length > 0) {
          let locId = locIds[0];
          locSku.push(locId.location);
        }
      }
      //采购入库单子表2. 按物料SKU  查询最新一条数据
      if (locSkuBatch.length === 0 && locSku.length === 0 && !queryUtils.isEmpty(productsku)) {
        let sql =
          "select goodsposition as location,batchno " +
          "from st.purinrecord.PurInRecords t " +
          "left join mainid on t.mainid=mainid.id " +
          "where mainid.org=" +
          org +
          " and mainid.warehouse=" +
          warehouse +
          " and productsku=" +
          productsku +
          " order by mainid.vouchdate desc," +
          " mainid.createTime desc limit 1";
        let locIds = ObjectStore.queryByYonQL(sql, "ustock");
        if (locIds.length > 0) {
          let locId = locIds[0];
          locSkuBatch.push(locId.location);
        }
      }
      //采购入库单子表3. 按物料ID 查询最新一条数据
      if (locSkuBatch.length === 0 && locSku.length === 0 && !queryUtils.isEmpty(product)) {
        let sql =
          "select goodsposition as location,batchno " +
          "from st.purinrecord.PurInRecords t " +
          "left join mainid on t.mainid=mainid.id " +
          "where mainid.org=" +
          org +
          " and mainid.warehouse=" +
          warehouse +
          " and product=" +
          product +
          " order by mainid.vouchdate desc," +
          " mainid.createTime desc limit 1";
        let locIds = ObjectStore.queryByYonQL(sql, "ustock");
        if (locIds.length > 0) {
          let locId = locIds[0];
          locSku.push(locId.location);
        }
      }
      //采购入库单子表4. 按批次号 查询最新一条数据
      if (locSkuBatch.length === 0 && locSku.length === 0 && !queryUtils.isEmpty(batchno)) {
        let sql =
          "select goodsposition as location,batchno " +
          "from st.purinrecord.PurInRecords t " +
          "left join mainid on t.mainid=mainid.id " +
          "where mainid.org=" +
          org +
          " and mainid.warehouse=" +
          warehouse +
          " and batchno='" +
          batchno +
          "'" +
          " order by mainid.vouchdate desc," +
          " mainid.createTime desc limit 1";
        let locIds = ObjectStore.queryByYonQL(sql, "ustock");
        if (locIds.length > 0) {
          let locId = locIds[0];
          locSku.push(locId.location);
        }
      }
      debugger;
      // 委外入库 按SKU+批次号 查询
      if (locSkuBatch.length === 0 && locSku.length === 0 && !queryUtils.isEmpty(productsku) && !queryUtils.isEmpty(batchno)) {
        let sql =
          "select goodsposition as location,batchno " +
          "from st.osminrecord.OsmInRecords t " +
          "left join mainid on t.mainid=mainid.id " +
          "where mainid.org=" +
          org +
          " and mainid.warehouse=" +
          warehouse +
          " and product=" +
          product +
          " and batchno='" +
          batchno +
          "'" +
          " order by mainid.vouchdate desc," +
          " mainid.createTime desc limit 1";
        let locIds = ObjectStore.queryByYonQL(sql, "ustock");
        if (locIds.length > 0) {
          let locId = locIds[0];
          locSku.push(locId.location);
        }
      }
      if (locSkuBatch.length === 0 && locSku.length === 0 && !queryUtils.isEmpty(productsku)) {
        let sql =
          "select goodsposition as location,batchno " +
          "from st.osminrecord.OsmInRecords t " +
          "left join mainid on t.mainid=mainid.id " +
          "where mainid.org=" +
          org +
          " and mainid.warehouse=" +
          warehouse +
          " and productsku=" +
          productsku +
          " and batchno='" +
          batchno +
          "'" +
          " order by mainid.vouchdate desc," +
          " mainid.createTime desc limit 1";
        let locIds = ObjectStore.queryByYonQL(sql, "ustock");
        if (locIds.length > 0) {
          let locId = locIds[0];
          locSku.push(locId.location);
        }
      }
      if (locSkuBatch.length === 0 && locSku.length === 0 && !queryUtils.isEmpty(product)) {
        let sql =
          "select goodsposition as location,batchno " +
          "from st.osminrecord.OsmInRecords t " +
          "left join mainid on t.mainid=mainid.id " +
          "where mainid.org=" +
          org +
          " and mainid.warehouse=" +
          warehouse +
          " and product=" +
          product +
          " order by mainid.vouchdate desc," +
          " mainid.createTime desc limit 1";
        let locIds = ObjectStore.queryByYonQL(sql, "ustock");
        if (locIds.length > 0) {
          let locId = locIds[0];
          locSku.push(locId.location);
        }
      }
      if (locSkuBatch.length === 0 && locSku.length === 0 && !queryUtils.isEmpty(batchno)) {
        let sql =
          "select goodsposition as location,batchno " +
          "from st.osminrecord.OsmInRecords t " +
          "left join mainid on t.mainid=mainid.id " +
          "where mainid.org=" +
          org +
          " and mainid.warehouse=" +
          warehouse +
          " and batchno='" +
          batchno +
          "'" +
          " order by mainid.vouchdate desc," +
          " mainid.createTime desc limit 1";
        let locIds = ObjectStore.queryByYonQL(sql, "ustock");
        if (locIds.length > 0) {
          let locId = locIds[0];
          locSku.push(locId.location);
        }
      }
      if (locSkuBatch.length > 0 || locSku.length > 0) {
        let locSet = [];
        if (locSkuBatch.length > 0) {
          locSet = locSkuBatch;
        } else {
          locSet = locSku;
        }
        let strIds = "";
        for (var i = 0; i < locSet.length; i++) {
          strIds = strIds + (queryUtils.isEmpty(strIds) ? "" : ",") + locSet[i];
        }
        // 根据货位ID查询,商品的货位信息
        let sql = "select code,name " + "from aa.goodsposition.GoodsPosition " + "where id in (" + strIds + ")";
        let locInfos = ObjectStore.queryByYonQL(sql, "productcenter");
        let location = "";
        for (let i = 0; i < locInfos.length; i++) {
          let locInfo = locInfos[i];
          location = location + (queryUtils.isEmpty(location) ? "" : ",") + locInfo.code + " " + locInfo.name;
        }
        // 新增到货单
        if (!arrivalOrder.bodyItem) {
          arrivalOrder.set("bodyItem", {});
          arrivalOrder.bodyItem.set("_entityName", "pu.arrivalorder.ArrivalOrdersCustomItem");
          arrivalOrder.bodyItem.set("_keyName", "id");
          arrivalOrder.bodyItem.set("_realtype", true);
          arrivalOrder.bodyItem.set("_status", "Insert");
          arrivalOrder.bodyItem.set("id", arrivalOrder.id + "");
        }
        //修改到货单并添加建议货位
        if (!arrivalOrder.bodyFreeItem) {
          arrivalOrder.set("bodyFreeItem", {});
          arrivalOrder.bodyFreeItem.set("_entityName", "pu.arrivalorder.ArrivalOrdersCustomItem");
          arrivalOrder.bodyFreeItem.set("_keyName", "id");
          arrivalOrder.bodyFreeItem.set("_realtype", true);
          arrivalOrder.bodyFreeItem.set("_status", "Insert");
          arrivalOrder.bodyFreeItem.set("id", arrivalOrder.id + "");
        }
        arrivalOrder.arrivalOrdersDefineCharacter.set("define1", location);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });