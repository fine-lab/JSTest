viewModel.get("button33bg").on("click", function (data) {
  //查询--单击
  // 获取日期
  let startDate = viewModel.get("dDate").getValue();
  let endDate = viewModel.get("item35nk").getValue();
  let xsckCode = viewModel.get("xsckCode").getValue();
  let invId = viewModel.get("invId").getValue();
  let depId = viewModel.get("depId").getValue();
  let orgId = viewModel.get("orgId").getValue();
  let ws = viewModel.get("ws").getValue();
  if (!startDate) {
    cb.utils.alert("请填写单据开始日期", "error");
    return;
  }
  if (!endDate) {
    cb.utils.alert("请填写单据结束日期", "error");
    return;
  }
  ClearValue();
  let res = cb.rest.invokeFunction(
    "AT18623B800920000A.api.getSalesOut",
    {
      startDate,
      endDate,
      xsckCode,
      invId,
      depId,
      orgId,
      ws
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  let { code, dataInfo } = res.result;
  console.log(dataInfo);
  if (code == 200) {
    let addrows = [];
    dataInfo.forEach((item, index) => {
      addrows.push({
        dDate: item.vouchdate,
        xsckCode: item.code,
        transactionTypeId: item.bustype,
        supplierCode: item.vendorcode,
        supplierId: item.productVendor,
        supplierName: item.vendorname,
        salesOutId: item.SalesOut,
        salesDeliverysId: item.SalesOuts,
        invId: item.product,
        invCode: item.productcode,
        invName: item.productname,
        unitId: item.unit,
        unitCode: item.nuitcode,
        unitName: item.nuitname,
        qty: item.qty,
        warehouse: item.warehouse,
        warehousecode: item.warehousecode,
        warehousename: item.warehousename,
        department: item.department,
        departmentcode: item.departmentcode,
        departmentname: item.departmentname,
        salesOrg: item.salesOrg,
        salesOrgname: item.salesOrgname,
        salesOrgcode: item.salesOrgcode,
        rows: item.rows,
        goodspositionName: item.goodspositionName,
        goodsposition: item.goodsposition,
        goodspositionCode: item.goodspositionCode,
        source: item.source
      });
    });
    viewModel.getGridModel().insertRows(0, addrows);
  } else {
    cb.utils.alert("没有获取到单据信息：" + res.result.msg || "");
    ClearValue();
  }
});
function ClearValue() {
  viewModel.getGridModel().clear();
}