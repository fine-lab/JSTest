let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let monthNum = request.opDate;
    let firstDate = request.firstDate;
    let firstNextDate = request.firstNextDate;
    let phymaterialCode = request.phymaterialCode;
    //查询采购入库单数据
    let sql =
      "select id, purchaseOrg.name purchaseOrgName,  records.pocode as orderNum, records.qty  arrivalNum, records.productn  phymaterialName,records.productn.name  phymaterialName_name, records.productn.code  phymaterialCode, vouchdate as arrivalDate, records.poid as poid,  records.extendGapSettleMark as extendGapSettleMark from st.purinrecord.PurInRecord ";
    sql += " left join st.purinrecord.PurInRecordDefine df on id = df.id ";
    sql += " left join st.purinrecord.PurInRecords records on id = records.mainid ";
    if (firstDate != null) {
      sql += " where vouchdate >= '" + firstDate + "' and vouchdate <  '" + firstNextDate + "'";
    }
    let result = ObjectStore.queryByYonQL(sql, "ustock");
    if (!result || result.length <= 0) {
      return {};
    }
    //采购入库单信息
    let purInRecordData = [];
    //物料ID
    let productId = "";
    //订单ID
    let orderId = "";
    for (let i = 0; i < result.length; i++) {
      purInRecordData.push(result[i]);
      // 计算算力服务金额
      if (result[i].phymaterialName) {
        productId += "'" + result[i].phymaterialName + "',";
      }
      if (result[i].poid) {
        orderId += "'" + result[i].poid + "',";
      }
    }
    productId = productId.substring(0, productId.length - 1);
    orderId = orderId.substring(0, orderId.length - 1);
    //查询物料映射表
    let mappingsql =
      "select phymaterial_code materialCode,phymaterial_name materialName,productname productName_name,  productcode , productId " +
      " from AT160194EA17D00009.AT160194EA17D00009.calcmappingtable  where phymaterial_id in (" +
      productId +
      ") and enable = 1";
    let mappingresult = ObjectStore.queryByYonQL(mappingsql);
    for (let a = 0; a < mappingresult.length; a++) {
      mappingresult[a].productCode = mappingresult[a].productcode;
      for (let b = 0; b < purInRecordData.length; b++) {
        if (!purInRecordData[b].materialCode && purInRecordData[b].phymaterialCode == mappingresult[a].materialCode) {
          purInRecordData[b] = Object.assign(purInRecordData[b], mappingresult[a]);
        }
      }
    }
    let settleProductId = "";
    //查询算力物料id
    for (let j = 0; j < mappingresult.length; j++) {
      settleProductId += "'" + mappingresult[j].productId + "',";
    }
    settleProductId = settleProductId.substring(0, settleProductId.length - 1);
    // 根据算力物料和实物物料,查询调价单信息,获取基准价extendBaseprice
    let changeSql = "select  suanliId, suanliTypeName, baseprice from AT1720668416580001.AT1720668416580001.suanliProductPrice where status = 1 and  suanliId in (" + settleProductId + ") ";
    let changeResult = ObjectStore.queryByYonQL(changeSql);
    for (let d = 0; d < purInRecordData.length; d++) {
      for (let c = 0; c < changeResult.length; c++) {
        if (changeResult[c].baseprice != null && changeResult[c].suanliTypeName == purInRecordData[d].productName_name) {
          purInRecordData[d].benchMarkPrice = changeResult[c].baseprice;
          break;
        }
      }
    }
    // 查询采购单,获取订单采购数量, 含税单价
    let ordersql = "select id orderid, os.qty	purchaseNum, os.oriTaxUnitPrice purchaseUnitPrice, os.product.cCode purProdutCode ";
    ordersql += " from pu.purchaseorder.PurchaseOrder left join  pu.purchaseorder.PurchaseOrders os on id=os.mainid where id in (" + orderId + ")";
    let orderResult = ObjectStore.queryByYonQL(ordersql, "upu");
    for (let e = 0; e < orderResult.length; e++) {
      for (let f = 0; f < purInRecordData.length; f++) {
        if (orderResult[e].orderid == purInRecordData[f].poid && purInRecordData[f].phymaterialCode + "" == orderResult[e].purProdutCode + "") {
          purInRecordData[f] = Object.assign(purInRecordData[f], orderResult[e]);
        }
      }
    }
    for (let g = 0; g < purInRecordData.length; g++) {
      purInRecordData[g].diffPrice = purInRecordData[g].purchaseUnitPrice - purInRecordData[g].benchMarkPrice;
      purInRecordData[g].diffMoney = purInRecordData[g].diffPrice * purInRecordData[g].purchaseNum;
      purInRecordData[g].gapSettleMark = purInRecordData[g].extendGapSettleMark;
      purInRecordData[g].org_id_name = purInRecordData[g].purchaseOrgName;
    }
    return { purInRecordData };
  }
}
exports({ entryPoint: MyAPIHandler });