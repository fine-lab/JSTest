viewModel.on("customInit", function (data) {
  // 库存拆箱管理--页面初始化
  viewModel.get("button21ef").on("click", function () {
    viewModel.communication({
      type: "modal",
      payload: {
        mode: "inner",
        groupCode: "modal7qi", // 模态框组件的编码
        viewModel: viewModel
      }
    });
    let dataJson = viewModel.getGridModel().getEditRowModel().getAllData();
    viewModel.get("item64ig").setValue(dataJson.kucunyuliang);
    viewModel.get("item176rb").setDataSource([
      {
        value: "100",
        text: "100/箱",
        nameType: "string"
      },
      {
        value: "200",
        text: "200/箱",
        nameType: "string"
      }
    ]);
    viewModel.get("item176rb").setValue("" + dataJson.waixiangxinghao);
    viewModel.get("item215xh").setDataSource([
      {
        value: "50",
        text: "50/箱",
        nameType: "string"
      }
    ]);
    viewModel.get("item137lc").setValue(0);
    viewModel.get("item100rb").setValue(0);
  });
  // 内箱规格--选择后
  viewModel.get("item215xh") &&
    viewModel.get("item215xh").on("afterSelect", function (data) {
      let chaixiang_num = viewModel.get("item137lc").getValue(); //拆箱数量
      let daxiang_guige = viewModel.get("item176rb").getValue(); //
      let xiangxiang_guige = viewModel.get("item215xh").getValue();
      let xiangxiang_num = (Number(daxiang_guige) / Number(xiangxiang_guige)) * Number(chaixiang_num);
      viewModel.get("item100rb").setValue(xiangxiang_num);
    });
  viewModel.get("item137lc") &&
    viewModel.get("item137lc").on("blur", function (data) {
      // 需要拆箱数量--失去焦点的回调
      let chaixiang_num = viewModel.get("item137lc").getValue(); //可拆箱数量
      let chaixiang_canuse_num = viewModel.get("item64ig").getValue(); //拆箱总量
      if (Number(chaixiang_num) > Number(chaixiang_canuse_num)) {
        cb.utils.alert({
          title: "拆箱数量超过库存数量，请重新输入拆箱数量", // 弹窗文本内容
          type: "warning", // 默认’info‘。可选 'error', 'fail', 'success', 'warning', 'info', 'noIcon'
          duration: "5" // 自动关闭的延时，单位秒
        });
        viewModel.get("item137lc").setValue(0);
      }
    });
  //保存
  viewModel.on("afterOkClick", (args) => {
    let chaixiang_num = viewModel.get("item137lc").getValue(); //可拆箱数量
    let xiaoxiang_num = viewModel.get("item100rb").getValue();
    let dataJson = viewModel.getGridModel().getEditRowModel().getAllData();
    let dataJsonCopy = JSON.parse(JSON.stringify(dataJson));
    let dataArr = [];
    dataArr.push(dataJson); //大箱
    dataArr.push(dataJsonCopy); //小箱
    dataArr[0].id = "";
    dataArr[0].xiangzileixing = "1"; //大箱子
    dataArr[0].kucunyuliang = Number(dataJsonCopy.kucunyuliang) - Number(chaixiang_num);
    dataArr[1].id = "";
    dataArr[1].xiangzileixing = "2"; //小箱子
    dataArr[1].waixiangxinghao = "";
    dataArr[1].naxiangxinghao = "50";
    dataArr[1].kucunyuliang = xiaoxiang_num;
    console.log(dataArr, "dataArr---");
    if (args.key == "modal7qi") {
      cb.rest.invokeFunction(
        "AT1675A95608100003.frontCustomFunction.updateBoxData",
        {
          rowData: viewModel.getGridModel().getEditRowModel().getAllData(),
          newData: dataArr,
          billNo: "a8f7660f"
        },
        function (err, res) {
          if (res) {
            viewModel.execute("refresh");
          }
        }
      );
    }
  });
  //打开二维码弹窗
  viewModel.get("button23ae").on("click", function () {
    let dataJson = viewModel.getGridModel().getEditRowModel().getAllData();
    let dataJsonCopy = JSON.parse(JSON.stringify(dataJson));
    viewModel.communication({
      type: "modal",
      payload: {
        mode: "inner",
        groupCode: "modal14lh", // 模态框组件的编码
        viewModel: viewModel
      }
    });
    setTimeout(function () {
      viewModel.get("item275uf").setValue(JSON.stringify(dataJsonCopy));
    }, 300);
  });
});