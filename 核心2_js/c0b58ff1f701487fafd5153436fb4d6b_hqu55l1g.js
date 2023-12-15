let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let id = data[0].srcBill;
    let bustype = data[0].bustype;
    //根据采购入库关联查询到货单
    if (id != undefined && bustype != "2503615093838080") {
      let func7 = extrequire("ST.backDefaultGroup.getArrivalorderBysql");
      let func7_res = func7.execute(null, id + "");
      let arrivalorderIds = func7_res.res;
      if (arrivalorderIds.length > 0) {
        //根据到货单来源srcBill查询采购自定义项
        let func8 = extrequire("ST.backDefaultGroup.getCGDDdefine");
        let func8_res = func8.execute(null, arrivalorderIds[0].srcBill);
        let purchaseOrderdefine = func8_res.res;
        let func9 = extrequire("ST.backDefaultGroup.getCGDDDetailBySql");
        let func10 = extrequire("ST.backDefaultGroup.getSaleOrderbySql");
        let func3 = extrequire("ST.backDefaultGroup.updateSaleOrderQTJZ");
        let func6 = extrequire("ST.backDefaultGroup.saleOrderAudit");
        let func11 = extrequire("ST.backDefaultGroup.getOrderBysql");
        //判断是否有为销售订单下推的采购订单
        let definesInfo = [];
        if (purchaseOrderdefine != undefined && purchaseOrderdefine.length > 0 && purchaseOrderdefine[0].define1 == "true") {
          let func9_res = func9.execute(null, arrivalorderIds[0].srcBill);
          let func10_res = func10.execute(null, purchaseOrderdefine[0].define2 + "");
          let purchaseOrders = func9_res.res;
          let orderDetails = func10_res.res;
          if (purchaseOrders != undefined && purchaseOrders.length > 0) {
            for (let i = 0; i < purchaseOrders.length; i++) {
              let purchaseOrder = purchaseOrders[i];
              //判断当前单据采购物料是否全部入库
              if (orderDetails != undefined && orderDetails.length > 0) {
                a: for (let j = 0; j < orderDetails.length; j++) {
                  let orderDetail = orderDetails[j];
                  if (purchaseOrder.productsku + "" == orderDetail.skuId + "" && purchaseOrder.totalInQty == orderDetail.qty) {
                    let definesbody = {
                      define2: "true",
                      isHead: false,
                      isFree: true,
                      detailIds: orderDetail.id + ""
                    };
                    definesInfo.push(definesbody);
                    break a;
                  }
                }
              }
            }
          }
          //将销售订单列表更新
          let body = {
            billnum: "voucher_order",
            datas: [
              {
                id: orderDetails[0].orderId + "",
                code: orderDetails[0].code,
                definesInfo: definesInfo
              }
            ]
          };
          if (definesInfo.length > 0) {
            func3.execute(null, body);
          }
          if (definesInfo.length > 0 && definesInfo.length == orderDetails.length) {
            let code = orderDetails[0].code;
            let qtjcBody1 = {
              billnum: "voucher_order",
              datas: [
                {
                  id: orderDetails[0].orderId + "",
                  code: orderDetails[0].code,
                  definesInfo: [
                    {
                      define2: "true",
                      isHead: true,
                      isFree: true,
                      detailIds: ""
                    }
                  ]
                }
              ]
            };
            func3.execute(null, qtjcBody1);
            let xsddCode = orderDetails[0].code;
            let xsyddCode = substring(xsddCode, 0, xsddCode.indexOf("-"));
            let xsddall = func11.execute(null, xsyddCode);
            let xsddallRes = xsddall.res;
            if (xsddallRes != undefined && xsddallRes.length > 0) {
              for (var m = 0; m < xsddallRes.length; m++) {
                let xdddId = xsddallRes[m].id;
                if (xdddId + "" != orderDetails[0].orderId + "") {
                  let definesInfo_2 = [];
                  let func10_res1 = func10.execute(null, xdddId + "");
                  let orderDetails1 = func10_res1.res;
                  if (orderDetails1 != null) {
                    for (var n = 0; n < orderDetails1.length; n++) {
                      let orderDetails1res = orderDetails1[n];
                      let definesbody2 = {
                        define2: "true",
                        isHead: false,
                        isFree: true,
                        detailIds: orderDetails1res.id + ""
                      };
                      definesInfo_2.push(definesbody2);
                    }
                    let defineshead = {
                      define2: "true",
                      isHead: true,
                      isFree: true,
                      detailIds: ""
                    };
                    definesInfo_2.push(defineshead);
                    let qtjcBody2 = {
                      billnum: "voucher_order",
                      datas: [
                        {
                          id: xdddId + "",
                          code: xsddallRes[m].code,
                          definesInfo: definesInfo_2
                        }
                      ]
                    };
                    func3.execute(null, qtjcBody2);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });