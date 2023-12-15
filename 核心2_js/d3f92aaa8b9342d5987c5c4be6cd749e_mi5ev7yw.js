viewModel.on("customInit", function (data) {
  let table_ProductCheckApplyList = viewModel.getGridModel("ProductCheckApplyList");
  let table_WWArrivalList = viewModel.getGridModel("WWArrivalList");
  let table_FinishedReportList = viewModel.getGridModel("FinishedReportList");
  let table_PoOrderList = viewModel.getGridModel("PoOrderList");
  let table_LLCheckApplyList = viewModel.getGridModel("LLCheckApplyList");
  let table_LLCheckOrderList = viewModel.getGridModel("LLCheckOrderList");
  let table_ReleaseOrderList = viewModel.getGridModel("releasePermitList");
  let table_PurInRecordList = viewModel.getGridModel("PurInRecordList");
  let table_RejectList = viewModel.getGridModel("RejectList");
  let table_StoreProRecordList = viewModel.getGridModel("StoreProRecordList");
  let table_ProductCheckOrderList = viewModel.getGridModel("ProductCheckOrderList");
  let table_PurchaseArrivalList = viewModel.getGridModel("PurchaseArrivalList");
  let table_WWInRecordList = viewModel.getGridModel("WWInRecordList");
  let table_MaterialOutList = viewModel.getGridModel("MaterialOutList");
  viewModel.get("button101qg").on("click", function () {
    let org = viewModel.get("org_id").getValue();
    let product = viewModel.get("product").getValue();
    let batchNo = viewModel.get("batch").getValue();
    if (product == undefined || batchNo == undefined) {
      cb.utils.alert("请选择物料和批号", "error");
    }
    table_ProductCheckApplyList.clear();
    table_WWArrivalList.clear();
    table_FinishedReportList.clear();
    table_PoOrderList.clear();
    table_LLCheckOrderList.clear();
    table_ReleaseOrderList.clear();
    table_PurInRecordList.clear();
    table_RejectList.clear();
    table_StoreProRecordList.clear();
    table_ProductCheckOrderList.clear();
    table_PurchaseArrivalList.clear();
    table_WWInRecordList.clear();
    table_MaterialOutList.clear();
    getBatchFrom_be(org, product, batchNo);
  });
  let setTable = function (list, table, table_total_name) {
    let specs = viewModel.get("item986jj").getValue();
    let total = 0;
    for (let i = 0; i < list.length; i++) {
      let row = {};
      row.product = list[i].product;
      row.product_name = list[i].productName;
      row.specs = specs;
      if (list[i].vendor != undefined) {
        row.supplier = list[i].vendor;
        row.supplier_name = list[i].vendorName;
      }
      if (list[i].busTypeName != undefined) {
        row.transactionType = list[i].busTypeName;
      }
      if (list[i].subQty != undefined) {
        row.subQty = list[i].subQty;
      }
      if (list[i].qty != undefined) {
        row.qty = list[i].qty;
        total += list[i].qty;
      }
      if (list[i].batchno != undefined) {
        row.batchNo_cbillName = list[i].batchno;
        row.batchno = list[i].batchNoId;
      }
      if (list[i].productsku != undefined) {
        row.sku = list[i].productsku;
        row.sku_name = list[i].productskuName;
      }
      row.org = list[i].org;
      row.org_name = list[i].orgName;
      row.billCode = list[i].code;
      row.baseUnit = list[i].unit;
      row.baseUnit_name = list[i].unitName;
      row.billDate = list[i].vouchdate;
      table.appendRow(row);
    }
    if (table_total_name != undefined) {
      viewModel.get(table_total_name).setValue(total);
    }
  };
  let setTables = function (data) {
    let PoOrderList = data.PoOrderList;
    let LLCheckApplyList = data.LLCheckApplyList;
    let WWArrivalList = data.WWArrivalList;
    let LLCheckOrderList = data.LLCheckOrderList;
    let ReleaseOrderList = data.ReleaseOrderList;
    let PurInRecordList = data.PurInRecordList;
    let RejectList = data.RejectList;
    let FinishedReportList = data.FinishedReportList;
    let StoreProRecordList = data.StoreProRecordList;
    let ProductCheckOrderList = data.ProductCheckOrderList;
    let ProductCheckApplyList = data.ProductCheckApplyList;
    let PurchaseArrivalList = data.PurchaseArrivalList;
    let WWInRecordList = data.WWInRecordList;
    let MaterialOutList = data.MaterialOutList;
    if (PoOrderList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "c7ba6e1057be4f079f92934cabb80581", visible: true }); //生产订单页签
      setTable(PoOrderList, table_PoOrderList, "PoOrderListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "c7ba6e1057be4f079f92934cabb80581", visible: false }); //生产订单页签
    }
    if (LLCheckApplyList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "20ae4bb47481487a96c8098367e58161", visible: true }); //来料检验申请单页签
      setTable(LLCheckApplyList, table_LLCheckApplyList, "LLCheckApplyListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "20ae4bb47481487a96c8098367e58161", visible: false }); //来料检验申请单页签
    }
    if (WWArrivalList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "5123aea8525e442eb2b97edf6e4698e6", visible: true }); //委外到货单页签
      setTable(WWArrivalList, table_WWArrivalList, "WWArrivalListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "5123aea8525e442eb2b97edf6e4698e6", visible: false }); //委外到货单页签
    }
    if (LLCheckOrderList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "174e6d7546a24c90a67a131c39f0ddc2", visible: true }); //来料检验页签
      setTable(LLCheckOrderList, table_LLCheckOrderList, "LLCheckOrderListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "174e6d7546a24c90a67a131c39f0ddc2", visible: false }); //来料检验页签
    }
    if (ReleaseOrderList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "cf97c45e12954be7bb838b33e0252ffe", visible: true }); //放行页签
      setTable(ReleaseOrderList, table_ReleaseOrderList, "ReleaseOrderListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "cf97c45e12954be7bb838b33e0252ffe", visible: false }); //放行页签
    }
    if (PurInRecordList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "326aa10e92824212a41f8e7d7f344307", visible: true }); //采购入库页签
      setTable(PurInRecordList, table_PurInRecordList, "PurInRecordListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "326aa10e92824212a41f8e7d7f344307", visible: false }); //采购入库页签
    }
    if (RejectList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "7c94e4b1e8954a8c87678dadeb3524a5", visible: true }); //不良品页签
      setTable(RejectList, table_RejectList, "RejectListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "7c94e4b1e8954a8c87678dadeb3524a5", visible: false }); //不良品页签
    }
    if (FinishedReportList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "cdc5087b4ceb439387da5bc3e4cbf51f", visible: true }); //完工报告页签
      setTable(FinishedReportList, table_FinishedReportList, "FinishedReportListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "cdc5087b4ceb439387da5bc3e4cbf51f", visible: false }); //完工报告页签
    }
    if (StoreProRecordList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "ffbd80ef848449da8cf7ddfec44fcd91", visible: true }); //产品入库页签
      setTable(StoreProRecordList, table_StoreProRecordList, "StoreProRecordListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "ffbd80ef848449da8cf7ddfec44fcd91", visible: false }); //产品入库页签
    }
    if (ProductCheckOrderList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "e09048b6e8774f8ca50514174a937cf4", visible: true }); //产品检验页签
      setTable(ProductCheckOrderList, table_ProductCheckOrderList, "ProductCheckOrderListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "e09048b6e8774f8ca50514174a937cf4", visible: false }); //产品检验页签
    }
    if (ProductCheckApplyList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "628231280a384ca8810ca8b1d3721c93", visible: true }); //产品检验申请页签
      setTable(ProductCheckApplyList, table_ProductCheckApplyList, "ProductCheckApplyListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "628231280a384ca8810ca8b1d3721c93", visible: false }); //产品检验申请页签
    }
    if (PurchaseArrivalList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "3f0d48bb615943a59aa45d6ba8e671e5", visible: true }); //采购到货页签
      setTable(PurchaseArrivalList, table_PurchaseArrivalList, "PurchaseArrivalListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "3f0d48bb615943a59aa45d6ba8e671e5", visible: false }); //采购到货页签
    }
    if (WWInRecordList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "8e127a431340475b8c767840fe14ea0f", visible: true }); //委外入库页签
      setTable(WWInRecordList, table_WWInRecordList, "WWInRecordListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "8e127a431340475b8c767840fe14ea0f", visible: false }); //委外入库页签
    }
    if (MaterialOutList.length > 0) {
      viewModel.execute("updateViewMeta", { code: "ace4ff824ea14ad7ab528ad9a86fc440", visible: true }); //材料出库页签
      setTable(MaterialOutList, table_MaterialOutList, "MaterialOutListTotal");
    } else {
      viewModel.execute("updateViewMeta", { code: "ace4ff824ea14ad7ab528ad9a86fc440", visible: false }); //材料出库页签
    }
  };
  let getBatchFrom_be = function (org, product, batchNo) {
    let tenantId = cb.context.getTenantId(); // 租户id
    let userId = cb.context.getUserId();
    return new Promise(function (resolve) {
      var queryProxy = cb.rest.DynamicProxy.create({
        settle: {
          url: "/gsp/getBatchFrom",
          method: "POST",
          options: {
            domainKey: "sy01",
            async: false
          }
        }
      });
      var paramsQuery = {
        tenantId: tenantId,
        userId: userId,
        org: org,
        product: product,
        batchNo: batchNo
      };
      var queryResult = queryProxy.settle(paramsQuery);
      if (queryResult.err || queryResult.error) {
        let err = "";
        if (queryResult.result.err) {
          err = queryResult.err;
        }
        if (queryResult.result.error) {
          err = queryResult.error.message;
        }
        cb.utils.alert("查询失败：" + err, "error");
        return false;
      }
      let data = queryResult.result;
      setTables(data);
      resolve(data);
    });
  };
});