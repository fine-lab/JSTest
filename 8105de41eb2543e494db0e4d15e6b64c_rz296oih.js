let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let dateDivission = new Date("2023-08-01");
    let paramReq = param.paramReq;
    // 查询待计费的资产
    let sql =
      "select distinct id, code,name,sourcebillno,begintime useDate,location,de.define2 sn,de.define10 contractNum,de.define8 requireNumber,toFixDetail.sourcebillno,toFixDetail.material.name materialName,toFixDetail.material.code materialCode, ";
    sql += paramReq.monthNum + " monthNum";
    sql += " from fa.fixedasset.FixedAssetsInfo left join fa.fixedasset.FixedAssetsInfoDefine de on id = de.id ";
    sql += " inner join fa.tofixedassets.ToFixedAssets toFix on sourcebillno = toFix.code ";
    sql += " inner join fa.tofixedassets.ToFixedAssetsDetail toFixDetail on toFixDetail.tofixedassets = toFix.id";
    sql += " where begintime >= '" + paramReq.fiveYear + "'";
    sql += " and begintime <= '" + paramReq.lastDate + "'";
    sql += " and de.define5 is not null ";
    if (paramReq.sn) {
      sql += " and de.define2 = '" + paramReq.sn + "'";
    }
    if (paramReq.endUseDate) {
      sql += " and begintime <= '" + paramReq.endUseDate + "'";
    }
    if (paramReq.beginUseDate) {
      sql += " and begintime >= '" + paramReq.beginUseDate + "'";
    }
    if (paramReq.searchIds) {
      sql += " and id in ('" + paramReq.searchIds.join("','") + "')";
    }
    let result = ObjectStore.queryByYonQL(sql, "fifa");
    if (!result || result.length <= 0) {
      return {};
    }
    let fixedassetData = []; // 资产信息
    let sourceCode = ""; // 转固单号
    let contractNum = ""; // 合同号
    for (let i = 0; i < result.length; i++) {
      let data = result[i];
      if (data.name == data.materialName) {
        // 剔除物料名称含备件的数据
        if (data.materialName && data.materialName.indexOf("备件") != -1) {
          continue;
        }
        fixedassetData.push(data);
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
    let orderSql = "select distinct id arriveId,code,pa.deliverGoodsDate shipmentDate,detail.upcode,detail.product.cCode,ps.extendSn sn ";
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
    let arriveId = ""; // 到货ID，用于查询入库单
    for (let i = 0; i < upuResult.length; i++) {
      let data = upuResult[i];
      for (let j = 0; j < fixedassetData.length; j++) {
        if (!data.sn || data.sn == "" || !fixedassetData[j].sn || fixedassetData[j].sn == "") {
          if (!fixedassetData[j].detail_upcode && fixedassetData[j].toFixDetail_sourcebillno == data.code && fixedassetData[j].materialCode == data.detail_product_cCode) {
            fixedassetData[j] = Object.assign(fixedassetData[j], data);
            if (upcode.indexOf("'" + data.detail_upcode + "'") == -1) {
              upcode += "'" + data.detail_upcode + "',";
            }
            if (phymaterialCode.indexOf("'" + data.detail_product_cCode + "'") == -1) {
              phymaterialCode += "'" + data.detail_product_cCode + "',";
            }
            if (arriveId.indexOf("'" + data.arriveId + "'") == -1) {
              arriveId += "'" + data.arriveId + "',";
            }
          }
        } else {
          if (!fixedassetData[j].detail_upcode && fixedassetData[j].toFixDetail_sourcebillno == data.code && fixedassetData[j].sn == data.sn) {
            fixedassetData[j] = Object.assign(fixedassetData[j], data);
            if (upcode.indexOf("'" + data.detail_upcode + "'") == -1) {
              upcode += "'" + data.detail_upcode + "',";
            }
            if (phymaterialCode.indexOf("'" + data.detail_product_cCode + "'") == -1) {
              phymaterialCode += "'" + data.detail_product_cCode + "',";
            }
            if (arriveId.indexOf("'" + data.arriveId + "'") == -1) {
              arriveId += "'" + data.arriveId + "',";
            }
          }
        }
      }
    }
    upcode = upcode.substring(0, upcode.length - 1);
    phymaterialCode = phymaterialCode.substring(0, phymaterialCode.length - 1);
    arriveId = arriveId.substring(0, arriveId.length - 1);
    let ooSql =
      "select orderDetail.natUnitPrice unitPrice,orderDetail.oriTaxUnitPrice unitPriceTax,code purchaseCode, org.name orgName, vendor.code supplierCode,vendor.name supplierName,orderDetail.product.cCode from pu.purchaseorder.PurchaseOrder inner join pu.purchaseorder.PurchaseOrders orderDetail on orderDetail.mainid = id where code in (" +
      upcode +
      ")";
    let ooResult = ObjectStore.queryByYonQL(ooSql, "upu");
    for (let z = 0; z < ooResult.length; z++) {
      for (let k = 0; k < fixedassetData.length; k++) {
        if (!fixedassetData[k].unitPrice && fixedassetData[k].detail_upcode == ooResult[z].purchaseCode && fixedassetData[k].materialCode == ooResult[z].orderDetail_product_cCode) {
          fixedassetData[k] = Object.assign(fixedassetData[k], ooResult[z]);
        }
      }
    }
    // 从采购入库，查询到货时间(单据日期)
    let inSql = "select srcBill arriveId,prd.define9 arriveDate ";
    inSql += " from st.purinrecord.PurInRecord ";
    inSql += " left join st.purinrecord.PurInRecordDefine prd on prd.id = id ";
    inSql += " where srcBill in (" + arriveId + ") and prd.define9 is not null ";
    let ustockResult = ObjectStore.queryByYonQL(inSql, "ustock");
    for (let a = 0; a < ustockResult.length; a++) {
      for (let b = 0; b < fixedassetData.length; b++) {
        if (!fixedassetData[b].arriveDate && fixedassetData[b].arriveId == ustockResult[a].arriveId) {
          // 时间维度小于 '2023-08-01'
          if (ustockResult[a].arriveDate && new Date(ustockResult[a].arriveDate) < dateDivission) {
            fixedassetData[b] = Object.assign(fixedassetData[b], ustockResult[a]);
          }
        }
      }
    }
    // 关联查询物流信息,并处理 时间维度大于或等于 2023-08-01的数据, 物流状态: 1代表提货 6代表签收
    let queryPickUpSql = " select detail.act_time as shipmentDate, rec_no as code from AT1707A99A16B00005.AT1707A99A16B00005.wlztxx ";
    queryPickUpSql += " left join AT1707A99A16B00005.AT1707A99A16B00005.wlztxxmx detail on detail.wlztxx_id = id ";
    queryPickUpSql += " where rec_no in (" + sourceCode + ") and detail.status_name = '提货'";
    // 接下来处理 发货时间和到货时间为空的数据, 这里分别从物流信息中进行取值
    let pickUpDateResult = ObjectStore.queryByYonQL(queryPickUpSql);
    for (let a = 0; a < pickUpDateResult.length; a++) {
      for (let b = 0; b < fixedassetData.length; b++) {
        if (!fixedassetData[b].shipmentDate && fixedassetData[b].code == pickUpDateResult[a].code && pickUpDateResult[a].shipmentDate) {
          fixedassetData[b] = Object.assign(fixedassetData[b], pickUpDateResult[a]);
        } else if (
          fixedassetData[b].shipmentDate &&
          new Date(fixedassetData[b].shipmentDate) >= dateDivission &&
          fixedassetData[b].code == pickUpDateResult[a].code &&
          pickUpDateResult[a].shipmentDate
        ) {
          fixedassetData[b] = Object.assign(fixedassetData[b], pickUpDateResult[a]);
        }
      }
    }
    let querySignDateSql = " select detail.act_time as arriveDate, rec_no as code from AT1707A99A16B00005.AT1707A99A16B00005.wlztxx ";
    querySignDateSql += " left join AT1707A99A16B00005.AT1707A99A16B00005.wlztxxmx detail on detail.wlztxx_id = id ";
    querySignDateSql += " where rec_no in (" + sourceCode + ") and detail.status_name = '签收'";
    let signDateResult = ObjectStore.queryByYonQL(querySignDateSql);
    for (let a = 0; a < signDateResult.length; a++) {
      for (let b = 0; b < fixedassetData.length; b++) {
        if (!fixedassetData[b].arriveDate && fixedassetData[b].code == signDateResult[a].code && signDateResult[a].arriveDate) {
          fixedassetData[b] = Object.assign(fixedassetData[b], signDateResult[a]);
        }
      }
    }
    // 根据物料查询映射关系，找到算力物料
    let suanSql =
      "select id calId,phymaterial_code materialCode,phymaterial_name materialName,productcode suanliType,productname suanliTypeName from AT160194EA17D00009.AT160194EA17D00009.calcmappingtable where phymaterial_code in (" +
      phymaterialCode +
      ")";
    let suanResult = ObjectStore.queryByYonQL(suanSql);
    for (let a = 0; a < suanResult.length; a++) {
      for (let b = 0; b < fixedassetData.length; b++) {
        if (!fixedassetData[b].calId && fixedassetData[b].detail_product_cCode == suanResult[a].materialCode) {
          fixedassetData[b] = Object.assign(fixedassetData[b], suanResult[a]);
        }
      }
    }
    // 根据算力物料+合同号查询调价单信息
    let changeResult = [];
    if (contractNum != "") {
      let changeSql = " select baseprice materialPrice,suanliType,suanliTypeName,priceOne,priceTwo,contractNum ";
      changeSql += " from 	AT1720668416580001.AT1720668416580001.suanliProductPrice ";
      changeSql += " where contractNum in (" + contractNum + ") and status = '1' ";
      changeResult = ObjectStore.queryByYonQL(changeSql, "developplatform");
      for (let a = 0; a < changeResult.length; a++) {
        for (let b = 0; b < fixedassetData.length; b++) {
          if (!fixedassetData[b].priceOne && fixedassetData[b].contractNum == changeResult[a].contractNum && fixedassetData[b].suanliType == changeResult[a].suanliType) {
            fixedassetData[b] = Object.assign(fixedassetData[b], changeResult[a]);
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
    }
    // 剔除组织为改配线的数据
    let filterFixedassetData = [];
    for (let k = 0; k < fixedassetData.length; k++) {
      if (fixedassetData[k]) {
        let isFilterData = false;
        if (fixedassetData[k].orgName && fixedassetData[k].orgName == "改配线") {
          continue;
        } else {
          // 如果选了资产开始使用日期. 则根据选择的资产开始使用日进行数据过滤
          if (fixedassetData[k].useDate) {
            if (paramReq.beginUseDate && paramReq.endUseDate) {
              if (fixedassetData[k].useDate < paramReq.beginUseDate || fixedassetData[k].useDate > paramReq.endUseDate) {
                isFilterData = true;
              }
            } else if (paramReq.beginUseDate) {
              if (fixedassetData[k].useDate < paramReq.beginUseDate) {
                isFilterData = true;
              }
            } else if (paramReq.endUseDate) {
              if (fixedassetData[k].useDate > paramReq.endUseDate) {
                isFilterData = true;
              }
            }
          }
          // 如果选了到货日期. 则根据选择的到货日期进行数据过滤
          if (fixedassetData[k].arriveDate) {
            if (paramReq.beginArriveDate && paramReq.endArriveDate) {
              if (fixedassetData[k].arriveDate < paramReq.beginArriveDate || fixedassetData[k].arriveDate > paramReq.endArriveDate) {
                isFilterData = true;
              }
            } else if (paramReq.beginArriveDate) {
              if (fixedassetData[k].arriveDate < paramReq.beginArriveDate) {
                isFilterData = true;
              }
            } else if (paramReq.endArriveDate) {
              if (fixedassetData[k].arriveDate > paramReq.endArriveDate) {
                isFilterData = true;
              }
            }
          }
          if (!isFilterData) {
            filterFixedassetData.push(fixedassetData[k]);
          }
        }
      }
    }
    return { fixedassetData: filterFixedassetData };
  }
}
exports({ entryPoint: MyTrigger });