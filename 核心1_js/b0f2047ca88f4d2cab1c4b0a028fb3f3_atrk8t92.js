viewModel.get("item23jb").on("afterValueChange", (params) => {
  if (params.value) {
    const reason = viewModel.get("item27ae");
    const isGet = params.value.value == 1;
    reason.setVisible(isGet);
    reason.setState("bIsNull", !isGet);
  }
});
viewModel.on("afterInit", () => {
  loadStyle();
});
viewModel.on("beforeSave", (params) => {
  const pmodel = viewModel.getCache("parentViewModel");
  const pdata = pmodel.getAllData();
  const zjInfo = pmodel.getGridModel().getEditRowModel().getData();
  const all = viewModel.getAllData();
  const _code = zjInfo.nhzjcode && JSON.parse(zjInfo.nhzjcode).identity;
  debugger;
  cb.rest.invokeFunction(
    "AT15BFE8B816C80007.backend.appendRow",
    {
      url: "AT15BFE8B816C80007.AT15BFE8B816C80007.nhzzjyjl",
      billNo: "nhzzjyjlList",
      object: {
        huanzhengdate: all.item96bc, // 业务日期
        jieyueczren: pdata.nhxingming, // 业务操作人ID
        jieyueczren_name: pdata.nhxingming_name, // 业务操作人
        jyrdept: pdata.nhdept, // 部门ID
        jyrdept_name: pdata.nhdept_name, // 部门
        jyrorg: pdata.nhcomp, // 组织id
        jyrorg_name: pdata.nhcomp_name, // 组织
        nhjytype: all.item23jb, // 借阅类型
        qzyuanyin: all.item27ae, // 原因
        zzcode: _code, // 证照编码
        zztype: zjInfo.zhengzhaoleixing, // 证照类型
        czr: cb.rest.AppContext.user.userName, // 操作人
        ywr: all.item100we
      }
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err, "error");
        return false;
      }
      if (res && res.data) {
        cb.utils.alert("操作成功", "success");
        viewModel.communication({
          type: "return"
        });
      }
    }
  );
  return false;
});
function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerText = `
    .qzref-cls {display: flex; justify-content: end;}`;
  headobj.appendChild(style);
}