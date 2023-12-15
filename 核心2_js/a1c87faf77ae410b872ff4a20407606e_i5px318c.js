viewModel.on("afterLoadData", function () {
  viewModel.execute("updateViewMeta", { code: "summary_view_linetabs", visible: false });
  // 查询当前终端是否有物料
  debugger;
  //查询终端与当前时间是否存在活动小结
  const orgname = viewModel.get("org_name").getValue();
  const org = viewModel.get("org").getValue();
  const terminal = viewModel.get("terminal").getValue();
  const creatdata = viewModel.get("createTime").getValue();
  queryactivity(org, creatdata, terminal);
});
function queryactivity(org, creatdata, terminal) {
  cb.rest.invokeFunction(
    "577e7ad66833442f8cd7d8d9a777764b",
    {
      data: {
        org: org,
        creatdata: creatdata,
        terminal: terminal
      }
    },
    function (err, res) {
      if (err != null) {
        return;
      }
      var define10 = res.define10;
      viewModel.get("headDef!define10").setValue(define10);
    }
  );
}