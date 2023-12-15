viewModel.on("customInit", function (data) {
  // 链接第三方页面列表--页面初始化
});
viewModel.get("btnAdd") &&
  viewModel.get("btnAdd").on("click", function (data) {
    // 新增--单击
    var viewModel = this;
    jDiwork.openService("319a8912"); // YCPT201 为注册在工作台的原子服务编码 servicecode
  });
viewModel.get("button24vj") &&
  viewModel.get("button24vj").on("click", function (data) {
    // 打开第三方页面--单击
    alert("这是新增页面");
    jDiwork.openService("1528592398536933382");
  });
viewModel.get("button50rj") &&
  viewModel.get("button50rj").on("click", function (data) {
    // 打开第三方（前端函数）--单击
    var viewmodel = this;
    viewmodel.communication({
      payload: {
        type: "platform",
        url: "https://ikm.yonyou.com/login?r=L2ZvcndhcmRiYXNl#/pages/km/usersystem/typicaldetail/typicaldetail",
        data: {}
      }
    });
  });