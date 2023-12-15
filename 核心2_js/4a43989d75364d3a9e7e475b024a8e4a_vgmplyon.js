viewModel.enableFeature("disableSubTableFullHeight");
const dandianModel = viewModel.get("dandianhzinfoList"), // 单店
  chengbaoModel = viewModel.get("chenbaohzinfoList"), // 承包
  caozuoModel = viewModel.get("caozuoliusuiList"); // 流水
// 合作变更
viewModel.get("button76si").on("click", function () {
  let data = {
    billtype: "voucher", // 卡片：voucher
    billno: "8057ab7e", // 卡片页：编码
    params: {
      mode: "add", // (编辑态、新增态、浏览态)
      dianpu: "1578184281362530307",
      dianpu_name: "新鲜水果店",
      dianpu_code: "DP-2210-001"
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel);
});
//开店
viewModel.get("button149vf").on("click", function () {
  openModal("2f76e143");
});
//补缴
viewModel.get("button259ai").on("click", function () {
  openModal("14fbee72");
});
//合作方式变更
viewModel.get("button277fh").on("click", function () {
  openModal("919362c8");
});
function openModal(billno) {
  let data = {
    billtype: "voucher", // 卡片：voucher
    billno, // 卡片页：编码
    params: {
      mode: "add", // (编辑态、新增态、浏览态)
      pageData: viewModel.getAllData()
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel);
}
// 单店合作信息-续费
viewModel.get("button37wg").on("click", (params) => {
  xufei(params, true);
});
// 单店合作信息-延期
viewModel.get("button57xb").on("click", (params) => {
  yanqi(params, true);
});
function xufei(params, isSingleShop) {
  const cvm = isSingleShop ? dandianModel : chengbaoModel;
  const rowData = cvm.getEditRowModel().getAllData();
  let data = {
    billtype: "Voucher", // 单据类型
    billno: "82d1701a", // 单据号，可通过预览指定页面后，在浏览器地址栏获取，在Voucher后面的字符串既是
    params: {
      mode: "add", // (编辑态edit、新增态add、浏览态edit + readOnly:true)
      readOnly: false, // 必填，否则调整到卡片页后，不调用默认的接口
      rowData,
      pageData: viewModel.getAllData()
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel); // bill 打开列表弹窗
}
function yanqi(params, isSingleShop) {
  const cvm = isSingleShop ? dandianModel : chengbaoModel;
  const rowData = cvm.getEditRowModel().getAllData();
  let data = {
    billtype: "Voucher", // 单据类型
    billno: "e379e936", // 单据号，可通过预览指定页面后，在浏览器地址栏获取，在Voucher后面的字符串既是
    params: {
      mode: "add", // (编辑态edit、新增态add、浏览态edit + readOnly:true)
      readOnly: false, // 必填，否则调整到卡片页后，不调用默认的接口
      rowData,
      pageData: viewModel.getAllData()
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel); // bill 打开列表弹窗
}
// 承包合作信息-续费
viewModel.get("button119uj").on("click", (params) => {
  xufei(params, false);
});
// 承包合作信息-延期
viewModel.get("button136pd").on("click", (params) => {
  yanqi(params, false);
});
viewModel.on("customInit", function (data) {
  // 经营费用管理详情--页面初始化
});