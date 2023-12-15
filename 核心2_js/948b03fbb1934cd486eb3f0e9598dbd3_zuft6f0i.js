viewModel.get("headFreeItem!define1_name").on("afterValueChange", function (data) {
  setAccountNo();
});
viewModel.get("store_name").on("afterValueChange", function (data) {
  setAccountNo();
});
function setAccountNo() {
  let supplierid = viewModel.get("headFreeItem!define1").getValue();
  let store = viewModel.get("store").getValue(); //门店
  let storeInfo = cb.rest.invokeFunction(
    "RM.API.getstorecode",
    {
      store
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  let terminal_code = storeInfo.result.dataInfo || ""; //门店代码
  viewModel.get("headFreeItem!define2").setValue("");
  if (!supplierid) {
    cb.utils.alert("供应商不能为空", "error");
    return;
  }
  if (!terminal_code) {
    cb.utils.alert("门店为空", "error");
    return;
  }
  let result = cb.rest.invokeFunction(
    "RM.API.getSupplierNo",
    {
      vendorid: supplierid,
      StoreCode: terminal_code
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  let { code, dataInfo, msg } = result.result;
  if (code == 200) {
    let AccountNo = dataInfo.AccountNo;
    viewModel.get("headFreeItem!define2").setValue(AccountNo);
  } else {
    cb.utils.alert(msg, "error");
    return;
  }
}