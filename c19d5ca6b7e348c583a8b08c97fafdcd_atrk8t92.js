var BUSTYPE_DATA = [];
viewModel.on("afterMount", () => {
  getBustype();
  const fllx = viewModel.get("fulizigeleixing");
  fllx.on("afterValueChange", (data) => {
    const fllist = fllx.getState("dataSource");
    if (data.value) {
      BUSTYPE_DATA.forEach((item) => {
        if (item.name == data.value.text) {
          viewModel.get("bustype").setValue(item.id);
          viewModel.get("bustype_name").setValue(item.name);
        }
      });
    }
  });
  viewModel.get("button22hd").on("click", () => {
    const data = {
      billtype: "Voucher", // 单据类型
      billno: "fuli_rzgf1", // 单据号
      params: {
        readOnly: true, // 预览时，一定为true，否则不加载详情数据
        mode: "browse" // 须传mode + 单据id + readOnly:false
      }
    };
    cb.loader.runCommandLine("bill", data, viewModel);
  });
});
viewModel.on("modeChange", (mode) => {
  let val = false;
  if (mode == "browse" && viewModel.get("verifystate").getValue() == 2 && viewModel.get("fulizigeleixing").getValue() == "5") {
    val = true;
  }
  viewModel.get("button22hd").setVisible(val);
});
function getBustype() {
  var url = `${cb.utils.getServiceUrl()}/uniform/bill/ref/getRefData?terminalType=1&busiObj=fuli_rcfzg&designPreview=true`;
  var proxy = viewModel.setProxy({
    ensure: {
      url: url,
      method: "POST",
      options: {
        // 选填，系统会自动添加
        domainKey: viewModel.getParams().domainKey // 选填，系统会自动添加,在URL中添加domainKey无效时，可在此处添加
      }
    }
  });
  //拼接接口入参
  var params = {
    page: {
      pageSize: 10,
      pageIndex: 1,
      totalCount: 1
    },
    dataType: "grid",
    refCode: "transtype.bd_billtyperef",
    busiObj: "fuli_rcfzg",
    fullname: "AT17AF3C4816B00004.AT17AF3C4816B00004.fuli_rcfzg",
    datasource: "bustype.name",
    key: "yourkeyHere",
    bSelfDefine: false,
    billnum: "fuli_rcfzg",
    data: '{"tenant_id":"atrk8t92","isFlowCoreBill":false,"isWfControlled":false,"fujian":"05aaa59c-3b3a-416e-be22-95be3ebd65c8","code":"FL-20230420-0003","enable":"1","verifystate":0}',
    custMap: {},
    queryId: 1681954017463
  };
  //调用接口后执行的操作
  proxy.ensure(params, function (err, result) {
    if (err) {
      return;
    } else {
      BUSTYPE_DATA = result.recordList;
    }
  });
}