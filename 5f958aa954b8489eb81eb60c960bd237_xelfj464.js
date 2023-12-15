viewModel.get("button155oj") &&
  viewModel.get("button155oj").on("click", function (data) {
    let datas = {
      billtype: "Voucher", // 单据类型
      billno: "st_morphologyconversion", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add", // (编辑态edit、新增态add、浏览态browse)
        data: {
          conversionType: 3,
          businesstypeId: "yourIdHere"
        },
        conversionType: 3,
        businesstypeId: "yourIdHere"
      }
    };
    //打开一个单据，并在当前页面显示
    var aa = cb.loader.runCommandLine("bill", datas, viewModel);
    console.log(JSON.stringify(aa));
  });