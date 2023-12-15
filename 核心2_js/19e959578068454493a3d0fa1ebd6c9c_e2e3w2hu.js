viewModel.on("beforeSave", function (args) {
  debugger;
  console.log("beforeSave 下推中");
  console.log(args);
  console.log(args.data.data);
  var storeprorecordV2 = cb.rest.invokeFunction(
    "ST.Inventory.storeprorecordV2",
    {
      param: args.data.data
    },
    function (err, res) {
    },
    viewModel,
    {
      async: false
    }
  );
  console.log("保存前下推");
  console.log(storeprorecordV2);
  //根据
  if (storeprorecordV2.error.code == 999) {
    //提示错误信息
    cb.utils.alert(storeprorecordV2.error.message, "error");
    console.log("保存前发现库存异常则阻止 start");
    console.log(storeprorecordV2.error.message);
    console.log("保存前发现库存异常则阻止 stop");
    return false;
  }
});
viewModel.on("afterSave", function (args) {
  console.log("afterSave 下推中");
  console.log(args);
  let id = args.res.id;
  debugger;
  //反写生产订单
  var Morpholog;
  if ((args.res.memo = "废品入库")) {
    Morpholog = cb.rest.invokeFunction(
      "ST.Inventory.Morpholog",
      {
        id: id
      },
      function (err, res) {
      },
      viewModel,
      {
        async: false
      }
    );
  }
  console.log(Morpholog);
});
viewModel.get("button71sd") &&
  viewModel.get("button71sd").on("click", function (data) {
    //保存--单击
    var aasa = viewModel.getParams();
    console.log(aasa);
    document.querySelector("#st_storeprorecord\\|button71sd").style.display = "none";
    function changeColor(styleHTML) {
      let styleDom = document.createElement("style");
      styleDom.innerHTML = styleHTML;
      document.head.appendChild(styleDom);
    }
  });