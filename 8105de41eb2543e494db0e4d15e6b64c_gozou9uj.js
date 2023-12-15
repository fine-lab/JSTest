let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let paramReq = param.paramReq;
    // 查询待计费的资产
    let sql = "select distinct id, code,name,beginTime useDate,location,freeChId.attrext5 sn,freeChId.ZJWLDA.code freeMaterialCode,freeChId.attrext6 contractNum,freeChId.attrext4 requireNumber,";
    sql += "source.srcBillNo as sourcebillno,source.materialId.name materialName,source.materialId.code materialCode,toFixDetail.srcBillNo as toFixDetail_sourcebillno,toFixDetail.srcBillId, ";
    sql += paramReq.monthNum + " monthNum";
    sql += " from fa.famain.FixedAssetsInfo ";
    sql += " left join fa.famain.FixedAssetSource source on id = source.assetId "; //assetId  EFA.tofixed.FaToFixed
    sql += " left join EFA.tofixed.FaToFixed toFix on toFix.id = source.srcBillId ";
    sql += " left join EFA.tofixed.FaToFixedDtl toFixDetail on toFix.id = toFixDetail.toFixedId ";
    sql += " where beginTime >= '" + paramReq.fiveYear + "'";
    sql += " and beginTime <= '" + paramReq.lastDate + "'";
    sql += " and freeChId.attrext5 <> null ";
    if (paramReq.searchIds) {
      sql += " and id in ('" + paramReq.searchIds.join("','") + "')";
    }
    let result = ObjectStore.queryByYonQL(sql, "yonbip-fi-efa");
    if (!result || result.length <= 0) {
      return {};
    }
    let fixedassetData = []; // 资产信息
    let sourceCode = ""; // 转固单号
    let contractNum = ""; // 合同号
    let contractNumSet = new Set();
    let sourceCodeSet = new Set();
    let arriveIdSet = new Set();
    let materialCodeSet = new Set();
    for (let i = 0; i < result.length; i++) {
      let data = result[i];
      if (data.materialName || data.freeMaterialCode) {
        fixedassetData.push(data);
        let materialCodeTemp = data.freeMaterialCode || data.materialCode;
        if (!materialCodeSet.has(materialCodeTemp)) {
          materialCodeSet.add(materialCodeTemp);
        }
        if (!arriveIdSet.has(data.toFixDetail_srcBillId)) {
          arriveIdSet.add(data.toFixDetail_srcBillId);
        }
        if (sourceCode.indexOf("'" + data.toFixDetail_sourcebillno + "'") == -1) {
          sourceCode += "'" + data.toFixDetail_sourcebillno + "',";
        }
        if (data.contractNum && contractNum.indexOf("'" + data.contractNum + "'") == -1) {
          contractNum += "'" + data.contractNum + "',";
        }
      }
    }
    sourceCode = sourceCode.substring(0, sourceCode.length - 1);
    contractNum = contractNum.substring(0, contractNum.length - 1);
    // 根据查询出来的资产信息，查询采购
    let orderSql = "select distinct id arriveId,code,pa.deliverGoodsDate shipmentDate,detail.upcode,detail.product.cCode,ps.extendSn sn,vouchdate arriveDate ";
    orderSql += " from pu.arrivalorder.ArrivalOrder ";
    orderSql += " inner join pu.arrivalorder.ArrivalOrders detail on detail.mainid = id ";
    orderSql += " left join pu.arrivalorder.ArrivalOrderParallel pa on pa.id = id ";
    orderSql += " left join pu.arrivalorder.snMessage ps on ps.ArrivalOrders_id = detail.id ";
    orderSql += " where code in (" + sourceCode + ")";
    let upuResult = ObjectStore.queryByYonQL(orderSql, "upu");
    // 不知道为什么不能在上面那个sql直接查询采购信息，查出来的采购信息发散，有毒！故挪下来单独查
    // 若以后可以了，可以挪到一个SQL查
    let upcode = ""; // 采购单号
    let phymaterialCode = ""; // 物料编码
    for (let i = 0; i < upuResult.length; i++) {
      let data = upuResult[i];
      for (let j = 0; j < fixedassetData.length; j++) {
        if (!data.sn || data.sn == "" || !fixedassetData[j].sn || fixedassetData[j].sn == "") {
          if (!fixedassetData[j].detail_upcode && fixedassetData[j].toFixDetail_sourcebillno == data.code && fixedassetData[j].materialCode == data.detail_product_cCode) {
            fixedassetData[j] = Object.assign(fixedassetData[j], data);
            if (upcode.indexOf("'" + data.detail_upcode + "'") == -1) {
              upcode += "'" + data.detail_upcode + "',";
            }
          }
        } else {
          if (!fixedassetData[j].detail_upcode && fixedassetData[j].toFixDetail_sourcebillno == data.code && fixedassetData[j].sn == data.sn) {
            fixedassetData[j] = Object.assign(fixedassetData[j], data);
            if (upcode.indexOf("'" + data.detail_upcode + "'") == -1) {
              upcode += "'" + data.detail_upcode + "',";
            }
          }
        }
      }
    }
    upcode = upcode.substring(0, upcode.length - 1);
    let ooSql =
      "select orderDetail.natUnitPrice unitPrice,orderDetail.oriTaxUnitPrice unitPriceTax,code purchaseCode,vendor.code supplierCode,vendor.name supplierName,orderDetail.product.cCode from pu.purchaseorder.PurchaseOrder inner join pu.purchaseorder.PurchaseOrders orderDetail on orderDetail.mainid = id where code in (" +
      upcode +
      ")";
    let ooResult = ObjectStore.queryByYonQL(ooSql, "upu");
    let ooResultMap = new Map();
    ooResult &&
      ooResult.forEach((ooResItem) => {
        ooResultMap.set(ooResItem.purchaseCode + "_" + ooResItem.orderDetail_product_cCode, ooResItem);
      });
    for (let k = 0; k < fixedassetData.length; k++) {
      let ooResInfo = ooResultMap.get(fixedassetData[k].detail_upcode + "_" + fixedassetData[k].materialCode);
      if (!fixedassetData[k].unitPrice && ooResInfo) {
        fixedassetData[k] = Object.assign(fixedassetData[k], ooResInfo);
      }
    }
    let materialCodeContion = [...materialCodeSet].join("','");
    // 根据物料查询映射关系，找到算力物料 materialCodeSet
    let suanSql =
      "select id calId,phymaterial_code materialCode,phymaterial_name materialName,productcode suanliType,productname suanliTypeName from AT160194EA17D00009.AT160194EA17D00009.calcmappingtable where phymaterial_code in ('" +
      materialCodeContion +
      "')";
    let suanResult = ObjectStore.queryByYonQL(suanSql);
    let suanResMap = new Map();
    suanResult &&
      suanResult.forEach((suanResItem) => {
        suanResMap.set(suanResItem.materialCode, suanResItem);
      });
    for (let b = 0; b < fixedassetData.length; b++) {
      let materialCodeTemp = fixedassetData[b].freeMaterialCode || fixedassetData[b].materialCode;
      let suanResInfo = suanResMap.get(materialCodeTemp);
      if (!fixedassetData[b].calId && suanResInfo) {
        fixedassetData[b] = Object.assign(fixedassetData[b], suanResInfo);
      }
    }
    // 根据算力物料+合同号查询调价单信息
    let changeResult = [];
    if (contractNum != "") {
      let changeSql = " select baseprice materialPrice,suanliType,suanliTypeName,priceOne,priceTwo,contractNum ";
      changeSql += " from 	AT1720668416580001.AT1720668416580001.suanliProductPrice ";
      changeSql += " where contractNum in (" + contractNum + ") and status = '1' ";
      changeResult = ObjectStore.queryByYonQL(changeSql, "developplatform");
      let priceInfoMap = new Map();
      changeResult &&
        changeResult.forEach((priceInfo) => {
          priceInfoMap.set(priceInfo.suanliType + "_" + priceInfo.contractNum, priceInfo);
        });
      for (let b = 0; b < fixedassetData.length; b++) {
        let priceInfo = priceInfoMap.get(fixedassetData[b].suanliType + "_" + fixedassetData[b].contractNum);
        if (!fixedassetData[b].priceOne && priceInfo) {
          fixedassetData[b] = Object.assign(fixedassetData[b], priceInfo);
          // 计算算力服务金额
          let begintime = new Date(fixedassetData[b].useDate);
          if (begintime >= new Date(paramReq.secondYear)) {
            fixedassetData[b].suanliPrice = fixedassetData[b].priceOne;
            fixedassetData[b].areaPrice = 1;
          } else if (begintime < new Date(paramReq.secondYear) && begintime >= new Date(paramReq.fiveYear)) {
            fixedassetData[b].suanliPrice = fixedassetData[b].priceTwo;
            fixedassetData[b].areaPrice = 2;
          }
        }
      }
    }
    return { fixedassetData };
  }
}
exports({ entryPoint: MyTrigger });