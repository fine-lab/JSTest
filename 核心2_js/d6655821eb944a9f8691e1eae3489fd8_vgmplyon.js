viewModel.on("afterMount", (args) => {
  debugger;
  loadStyle1();
});
function loadStyle1(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerText = `
  .Toolbar_Group_Length1.m-l-8:nth-child(3) {
      display: none;
  }
  .Toolbar_Group_Length1.m-l-8:nth-child(5) {
      display: none;
  }
  `;
  headobj.appendChild(style);
}
viewModel.on("customInit", function (data) {
  // 部门预算管理详情--页面初始化
  viewModel.get("button27bf").setVisible(false);
});
viewModel.on("beforeEdit", function (data) {
  //编辑事件触发前
  debugger;
  viewModel.get("button27bf").setVisible(true);
});
//修改之前的积分
var oldScore;
var hasChanged;
//本月新增合计
var oldAdd;
//本月消费合计
var oldConsume;
viewModel.get("score").on("afterValueChange", function (data) {
});
viewModel.on("afterSave", function (data) {
  hasChanged = null;
  oldScore = viewModel.get("score").getValue();
  oldAdd = viewModel.get("month_add").getValue();
  oldConsume = viewModel.get("month_consume").getValue();
});
viewModel.get("button27bf") &&
  viewModel.get("button27bf").on("click", function (data) {
    // 保存--单击
    let data1 = viewModel.getAllData();
    cb.rest.invokeFunction(
      "AT165369EC09000003.apifunc.budgetChange",
      {
        id: data1.id,
        is_budget: data1.is_budget,
        score: data1.score
      },
      function (err, res) {
        if (res.result === "0") {
          viewModel.biz.action().common.browse(viewModel);
          viewModel.get("button27bf").setVisible(false);
        } else {
          cb.utils.alert("保存错误");
        }
      }
    );
  });
viewModel.get("button28ib") &&
  viewModel.get("button28ib").on("click", function (data) {
    // 取消--单击
    viewModel.biz.action().common.browse(viewModel);
    viewModel.get("button27bf").setVisible(false);
  });