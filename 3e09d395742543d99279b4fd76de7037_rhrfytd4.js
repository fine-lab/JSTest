viewModel.get("button8ij") &&
  viewModel.get("button8ij").on("click", function (data) {
    let row = viewModel.getGridModel().getRow(data.index);
    getOrderIdByCode(row.billCode);
  });
//是否是gsp单据  子表物料信息list 发起下推单据类型
function getOrderIdByCode(code) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction(
      "I0P_UDI.publicFunction.getOrderIdByCode",
      {
        code: code
      },
      function (err, res) {
        if (typeof res != "undefined") {
          let orderType = res.orderType;
          let orderId = res.orderId;
          let domain = res.domain;
          var param = {};
          viewModel.un("back");
          if (orderType == "storeprorecord") {
            param = {
              billtype: "Voucher",
              billno: orderType,
              domainKey: domain,
              params: {
                readOnly: "true",
                mode: "browse",
                id: orderId,
                title: "产品入库"
              }
            };
          } else if (orderType == "st_purinrecord") {
            param = {
              billtype: "Voucher",
              billno: orderType,
              domainKey: domain,
              params: {
                readOnly: "true",
                mode: "browse",
                id: orderId,
                title: "采购入库"
              }
            };
          } else if (orderType == "st_salesout") {
            param = {
              billtype: "Voucher",
              billno: orderType,
              domainKey: domain,
              params: {
                readOnly: "true",
                mode: "browse",
                id: orderId,
                title: "销售出库"
              }
            };
          } else if (orderType == "st_othinrecord") {
            param = {
              billtype: "Voucher",
              billno: orderType,
              domainKey: domain,
              params: {
                readOnly: "true",
                mode: "browse",
                id: orderId,
                title: "期初库存"
              }
            };
          } else if (orderType == "pu_arrivalorder") {
            param = {
              billtype: "Voucher",
              billno: orderType,
              domainKey: domain,
              params: {
                readOnly: "true",
                mode: "browse",
                id: orderId,
                title: "采购到货"
              }
            };
          } else if (orderType == "voucher_delivery") {
            param = {
              billtype: "Voucher",
              billno: orderType,
              domainKey: domain,
              params: {
                readOnly: "true",
                mode: "browse",
                id: orderId,
                title: "销售发货"
              }
            };
          } else if (orderType == "po_finished_report") {
            param = {
              billtype: "Voucher",
              billno: orderType,
              domainKey: domain,
              params: {
                readOnly: "true",
                mode: "browse",
                id: orderId,
                title: "完工报告"
              }
            };
          } else if (orderType == "st_transferapply") {
            param = {
              billtype: "Voucher",
              billno: orderType,
              domainKey: domain,
              params: {
                readOnly: "true",
                mode: "browse",
                id: orderId,
                title: "调拨订单"
              }
            };
          } else if (orderType == "st_storeout") {
            param = {
              billtype: "Voucher",
              billno: orderType,
              domainKey: domain,
              params: {
                readOnly: "true",
                mode: "browse",
                id: orderId,
                title: "调拨出库"
              }
            };
          }
          cb.loader.runCommandLine("bill", param, viewModel);
        } else if (typeof err != "undefined") {
          cb.utils.alert(err, "error");
        }
      }
    );
  });
}