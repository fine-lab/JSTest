console.log(111);
viewModel.on("afterLoadData", (params) => {
  viewModel.get("baomingerweima").setValue(`活动地址：https://c2.yonyoucloud.com/mdf-node/meta/Voucher/ad5a9ccd/browse?domainKey=developplatform&tplid=111010532&id=${viewModel.get("id").getValue()}`);
  debugger;
});