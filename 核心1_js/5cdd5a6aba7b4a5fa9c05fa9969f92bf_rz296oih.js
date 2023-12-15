//动态引入js-xlsx库
var secScript = document.createElement("script");
secScript.setAttribute("type", "text/javascript");
//传入文件地址 subId:应用ID
secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/ST/xlsx.common.extend.js?domainKey=developplatform`);
document.body.insertBefore(secScript, document.body.lastChild);
var secScript1 = document.createElement("script");
secScript1.setAttribute("type", "text/javascript");
//传入文件地址 subId:应用ID
secScript1.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/ST/xlsx.core.min.js?domainKey=developplatform`);
document.body.insertBefore(secScript1, document.body.lastChild);
viewModel.get("button188yd") &&
  viewModel.get("button188yd").on("click", function (data) {
    //导出--单击
    let detailList = viewModel.getGridModel("details").getData();
    let arr1 = [];
    for (let i in detailList) {
      let lists = detailList[i * 1];
      arr1 = arr1.concat(lists.DeliverySnMessageList || []);
    }
    if (!arr1.length) {
      cb.utils.alert("没有SN信息！", "warning");
      return;
    }
    let sheetData1 = arr1.map((item, i) => {
      return {
        序号: i + 1,
        序列号自由项特征组: item.snCharacter || "",
        物料: item.extendMaterial || "",
        物料编码: item.extendMaterialCode || "",
        SN: item.sn,
        箱号: item.extendBoxNumber || "",
        箱数: item.extendBoxCount || "",
        生产日期: item.extendProductDate || "",
        入库日期: item.extendPutInDate || "",
        保质期: item.extendShelfLife || "",
        DC日期: item.extendDcData || "",
        出厂时间: item.extendDateOfProduction || "",
        到期日期: item.extendMaturityDate || "",
        体积: item.extendVolume || "",
        毛重: item.extendRoughWeight || ""
      };
    });
    // 调用公共函数导出方法
    exportFile(sheetData1, "SN信息", `销售出库单SN信息.xlsx`);
    cb.utils.alert("导出完成！", "success");
  });
// 页面状态切换时
viewModel.on("modeChange", function (args) {
  //不展示序列号
  // 交易类型是服务器出货、备件出货，显示SN、SN导出
  if (viewModel.get("bustype_name").getValue() == "服务器出货" || viewModel.get("bustype_name").getValue() == "备件出货") {
    viewModel.get("button188yd").setVisible(true);
    viewModel.execute("updateViewMeta", { code: "linetabs39fg", visible: true });
    viewModel.execute("updateViewMeta", { code: "st_salesout_subbody_page", visible: true });
  } else {
    viewModel.get("button188yd").setVisible(false);
    viewModel.execute("updateViewMeta", { code: "linetabs39fg", visible: false });
  }
});
// 发货单下推到出库单时，代入SN数据
var snList = [];
// 来源发货单ID
var srcBill = "";
// 数据加载
viewModel.on("afterLoadData", function (args) {
  //销售发货单下退出库单时，带入SN信息
  let modeStatus = viewModel.getParams().mode;
  srcBill = args.details[0].sourceid;
  if (srcBill && modeStatus == "add") {
    // 查询发货单信息
    cb.rest.invokeFunction("ST.backFun.queryDeliverySn", { srcBill }, function (err, res) {
      if (modeStatus == "add" && srcBill && (viewModel.get("bustype_name").getValue() == "服务器出货" || viewModel.get("bustype_name").getValue() == "备件出货")) {
        viewModel.get("DeliverySnMessageList").setData(res.res);
      } else {
        snList = res.res;
      }
    });
  }
});
viewModel.on("afterMount", function (args) {
  // 交易类型是服务器出货、备件出货，显示SN、SN导出
  if (viewModel.get("bustype_name").getValue() == "服务器出货" || viewModel.get("bustype_name").getValue() == "备件出货") {
    viewModel.get("button188yd").setVisible(true);
    viewModel.execute("updateViewMeta", { code: "linetabs39fg", visible: true });
  } else {
    viewModel.get("button188yd").setVisible(false);
    viewModel.execute("updateViewMeta", { code: "linetabs39fg", visible: false });
  }
});
//选中select后事件 rowIndexs为行号，单行(整形)or多行(数组)
viewModel.get("details").on("afterSelect", function (rowIndexs) {
  console.log(rowIndexs);
});
viewModel.get("bustype_name") &&
  viewModel.get("bustype_name").on("afterValueChange", function (data) {
    //交易类型--值改变后
    // 交易类型是服务器出货、备件出货，显示SN、SN导出
    if (viewModel.get("bustype_name").getValue() == "服务器出货" || viewModel.get("bustype_name").getValue() == "备件出货") {
      viewModel.get("button188yd").setVisible(true);
      viewModel.execute("updateViewMeta", { code: "linetabs39fg", visible: true });
      // 是新增的下推单据，代入SN
      if (srcBill) {
        viewModel.get("DeliverySnMessageList").setData(snList);
      }
    } else {
      viewModel.get("button188yd").setVisible(false);
      //如果是其他交易类型，则清空SN信息，隐藏SN组件
      viewModel.get("DeliverySnMessageList").setData([]);
      viewModel.execute("updateViewMeta", { code: "linetabs39fg", visible: false });
    }
  });