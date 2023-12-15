let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //公共变量
    let sqlhid = "select orderId from voucher.order.OrderDetail";
    sqlhid += " where productId='" + request.materialId + "'"; //根据选择物料id查询
    sqlhid += " and orderId.vouchdate >= '" + request.vouchdateS + "' and orderId.vouchdate <='" + request.vouchdateE + "'"; //根据主表的单据日期查询
    let reshid = ObjectStore.queryByYonQL(sqlhid, "udinghuo");
    let orderhid = reshid.map((x) => "'" + x.orderId + "'").join(",");
    let sql =
      "select orderId.id as OrderId ,orderId.code,orderId.vouchdate,orderId.salesOrgId,orderId.saleDepartmentId,orderId.agentId,orderId.transactionTypeId,orderId.corpContact,orderId.nextStatus,orderId.payStatusCode,taxId,oriSum,oriTaxUnitPrice,subQty,productId,bodyItem.define1 as cbzx,orderDetailPrices.oriTax,id from voucher.order.OrderDetail";
    sql += " where orderId in(" + orderhid + ")";
    sql += " order by OrderId"; //分组
    let res = ObjectStore.queryByYonQL(sql, "udinghuo");
    //过滤出主表信息，并去重
    let orderItemsTmp = res.map((x) => {
      return {
        OrderId: x.OrderId, //销售订单ID
        code: x.orderId_code, //销售订单编码
        salesOrgId: x.orderId_salesOrgId, //销售组织id
        saleDepartmentId: x.orderId_saleDepartmentId, //销售部门编码
        agentId: x.orderId_agentId, //客户ID
        vouchdate: x.orderId_vouchdate, //单据日期
        transactionTypeID: x.orderId_transactionTypeId, //销售组织id
        corpContact: x.orderId_corpContact, //销售部门编码
        TransTypeId: x.orderId_agentId, //客户ID
        nextStatus: x.orderId_nextStatus, //单据日期
        payStatusCode: x.orderId_payStatusCode //单据日期
      };
    });
    let orderItems = [];
    orderItemsTmp.forEach((x) => {
      if (orderItems.filter((y) => y.OrderId == x.OrderId).length == 0) orderItems.push(x);
    });
    let sqlTax = "select detail.outTaxrate as taxID from pc.product.Product where id = '" + request.materialId + "'";
    let resTax = ObjectStore.queryByYonQL(sqlTax, "productcenter");
    //查询子表物料为前端传参物料的子表id数据
    let sqlNat = "select id,code,ntaxrate from archive.taxArchives.TaxRateArchive where id = '" + resTax[0].taxID + "'";
    let resNat = ObjectStore.queryByYonQL(sqlNat, "yonbip-fi-taxpubdoc");
    let data = []; //入参总数据
    for (let i = 0; i < orderItems.length; i++) {
      //根据步骤1.1查询的id在实体【物料税率调整销售订单】中确认是否存在，【soId】
      //若存在，则此数据作废；若不存在，则进行以下的操作
      let sqlid = "select soId from AT17C47D1409580006.AT17C47D1409580006.AdjustMtaxOrder where soId = '" + orderItems[i].OrderId + "'";
      let resid = ObjectStore.queryByYonQL(sqlid);
      if (resid.length > 0) continue;
      //处理主表数据
      let details = []; //详情数组
      let one = {}; //单条主表数据
      one["id"] = orderItems[i]["OrderId"];
      one["isHC"] = "0";
      one["isCreatNV"] = "0";
      one["Vtype"] = "1"; //单据类型
      if (orderItems[i]["corpContact"] != undefined) {
        one["corpContact"] = orderItems[i]["corpContact"];
      } else {
        one["corpContact"] = "";
      }
      if (orderItems[i]["saleDepartmentId"] != undefined) {
        one["saleDepartmentId"] = orderItems[i]["saleDepartmentId"];
      } else {
        one["saleDepartmentId"] = "";
      }
      one["saleDepartmentId"] = orderItems[i]["saleDepartmentId"];
      one["soId"] = orderItems[i]["OrderId"];
      one["code"] = orderItems[i]["code"];
      one["salesOrgId"] = orderItems[i]["salesOrgId"];
      one["transactionTypeID"] = orderItems[i]["transactionTypeID"];
      one["vouchdate"] = orderItems[i]["vouchdate"];
      one["agentId"] = orderItems[i]["agentId"];
      one["nextStatus"] = orderItems[i]["nextStatus"];
      one["payStatusCode"] = orderItems[i]["payStatusCode"];
      one["SelectMaterial"] = request.materialId; // 主表里的选择物料字段
      //处理子表数据
      let detailItems = res.filter((x) => x.OrderId == orderItems[i].OrderId);
      for (let j = 0; j < detailItems.length; j++) {
        let detailOne = {};
        detailOne["id"] = detailItems[j]["id"];
        if (detailItems[j]["oriTaxUnitPrice"] != undefined) {
          detailOne["oriTaxUnitPrice"] = detailItems[j]["oriTaxUnitPrice"];
        } else {
          detailOne["oriTaxUnitPrice"] = 0;
        }
        if (detailItems[j]["oriSum"] != undefined) {
          detailOne["oriSum"] = detailItems[j]["oriSum"];
        } else {
          detailOne["oriSum"] = 0;
        }
        if (detailItems[j]["subQty"] != undefined) {
          detailOne["subQty"] = detailItems[j]["subQty"];
        } else {
          detailOne["subQty"] = 0;
        }
        if (detailItems[j]["cbzx"] != undefined) {
          detailOne["cbzx"] = detailItems[j]["cbzx"];
        } else {
          detailOne["cbzx"] = "";
        }
        if (detailItems[j]["productId"] != undefined) {
          detailOne["productId"] = detailItems[j]["productId"];
        } else {
          detailOne["productId"] = "";
        }
        //当物料id等于前端传参【选择物料】时，taxID等于物料档案中查询到的 taxID；
        if (detailItems[j]["productId"] == request.materialId && "taxID" in resTax[0]) {
          detailOne["taxId"] = resTax[0].taxID;
        } else {
          detailOne["taxId"] = detailItems[j]["taxId"];
        }
        //当物料id等于前端传参【选择物料】时,税额要重新计算
        //计算税率调整的物料对应的税额
        if (detailItems[j]["productId"] == request.materialId && "taxID" in resTax[0]) {
          let oriTAX = ""; //税额变量
          if (resNat[0].ntaxrate < 1) {
            oriTAX = ((detailItems[j].oriSum / (1 + resNat[0].ntaxrate)) * resNat[0].ntaxrate).toFixed(2);
          } else {
            oriTAX = ((detailItems[j].oriSum / (1 + resNat[0].ntaxrate / 100)) * (resNat[0].ntaxrate / 100)).toFixed(2);
          }
          detailOne["oriTax"] = oriTAX;
        } else {
          detailOne["oriTax"] = detailItems[j]["orderDetailPrices_oriTax"];
        }
        details.push(detailOne); //向明细数组中插入一条明细
      }
      one["AdjustMtaxOrderDetailList"] = details; //主表数据中赋值明细字段
      data.push(one);
    }
    let resInsertBatch = ObjectStore.insertBatch("AT17C47D1409580006.AT17C47D1409580006.AdjustMtaxOrder", data, "yb9480b2c6");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });