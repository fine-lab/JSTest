// 以登录用户所属组织作为数据权限管控维度（仅查询本组织的数据）
viewModel.getGridModel().on("afterSetDataSource", function (data) {
  let b = viewModel.getCache("remark");
  let gridModel = viewModel.getGridModel();
  if (!b) {
    let user = cb.rest.AppContext.user;
    let pageIndex = gridModel.getPageIndex();
    let pageSize = gridModel.getPageSize();
    const filtervm = viewModel.getCache("FilterViewModel");
    //组装传后端脚本的数据
    let define10 = filtervm.get("define10").getFromModel().getValue(); //所属分销商
    let agentId_name = filtervm.get("agentId_name").getFromModel().getValue(); //客户
    let define7 = filtervm.get("define7").getFromModel().getValue(); //是否整车
    let define3 = filtervm.get("define3").getFromModel().getValue(); //整车标识号
    let creator = filtervm.get("creator").getFromModel().getValue(); //创建人
    let modifier = filtervm.get("modifier").getFromModel().getValue(); //修改人
    //获取后端脚本
    let obj = cb.rest.invokeFunction(
      "GT80750AT4.OrderSummer.getOrderSummer",
      {
        user: user,
        pageIndex: pageIndex,
        pageSize: pageSize,
        define10: define10,
        define7: define7,
        define3: define3,
        creator: creator,
        modifier: modifier,
        agentId_name: agentId_name
      },
      function (err, res) {},
      viewModel,
      { async: false }
    );
    //总条数
    let thdata = obj.result.thdata;
    let xsdata = obj.result.xsdata;
    debugger;
    var objectList = [];
    var total = 0;
    //查理销售订单列表
    if (JSON.parse(xsdata).code == 200) {
      let datastr = JSON.parse(xsdata).data.recordList;
      for (let i = 0; i < datastr.length; i++) {
        let data = datastr[i];
        let headItem = data.headItem;
        let bodyItem = data.bodyItem;
        let prices = data.orderDetailPrices;
        let pushdata = {
          define10: headItem.define10, //所属分销商
          id: data.code, //销售订单号
          agentId_name: data.agentId_name, //客户
          vouchdate: data.createTime, //创建时间
          define35: headItem.auditTime, //审核时间
          agentProductName: data.productName, //存货
          subQty: data.subQty, //数量
          receiveAddress: data.receiveAddress, //地址
          natTaxUnitPrice: prices.natTaxUnitPrice, //单价
          oriSum: data.oriSum, //总金额
          define12: bodyItem.define12, //单个积分
          define13: bodyItem.define13, //总积分
          define14: bodyItem.define14, //单个瓶数
          define15: bodyItem.define15, //总瓶数
          define7: headItem.define7, //是否整车
          define3: headItem.define3 //整车标识号
        };
        objectList.push(pushdata);
      }
      total = total + JSON.parse(xsdata).data.recordCount;
    }
    //处理退货订单列表
    if (JSON.parse(thdata).code == 200) {
      let datastr = JSON.parse(thdata).data.recordList;
      for (let i = 0; i < datastr.length; i++) {
        let data = datastr[i];
        let pushdata = {
          define10: data["headItem!define10"], //所属分销商
          id: data.orderNo, //退货订单号
          agentId_name: data.agentId_name, //客户
          vouchdate: data.createTime, //创建时间
          define35: data.auditTime, //审核时间
          agentProductName: data.productName, //存货
          subQty: data.subQty, //数量
          receiveAddress: data.receiveAddress, //地址
          natTaxUnitPrice: data.natTaxUnitPrice, //单价
          oriSum: data.oriSum, //总金额
          define12: data["bodyItem!define12"], //单个积分
          define13: data["bodyItem!define13"], //总积分
          define14: data["bodyItem!define14"], //单个瓶数
          define15: data["bodyItem!define15"], //总瓶数
          define7: data["headItem!define7"], //是否整车
          define3: data["headItem!define3"] //整车标识号
        };
        objectList.push(pushdata);
      }
      total = total + JSON.parse(thdata).data.recordCount;
    }
    viewModel.setCache("remark", 1);
    gridModel.setState("dataSourceMode", "local");
    gridModel.setDataSource(objectList);
    gridModel.setPageInfo({
      pageSize: pageSize,
      pageIndex: pageIndex,
      recordCount: total
    });
  } else {
    viewModel.clearCache("remark");
  }
});
//门户端添加权限控制
viewModel.on("customInit", function (data) {
  // 订单状态汇总报表--页面初始化
  let URL = window.location.href;
  let urldata = getUrlParams3(URL);
  let agentCode = urldata.agentCode;
  let agentname = "";
  //获取biptoken
  let result = cb.rest.invokeFunction("SCMSA.saleOrderRule.getToken", {}, function (err, res) {}, viewModel, { async: false });
  let accessToken = result.result.access_token;
  const url = "https://www.example.com/"; // 添加domainKey防止跨域
  var proxy = viewModel.setProxy({
    ensure: {
      url: url,
      method: "GET",
      options: {
        async: false
      }
    }
  });
  //拼接接口入参
  var params = {
    access_token: accessToken,
    code: agentCode
  };
  debugger;
  //调用接口后执行的操作
  let res = proxy.ensure(params, function (err, result) {});
  if (!res.error) {
    agentname = res.result.name.zh_CN;
  }
  //设置查询区的默认值
  viewModel.on("afterMount", function () {
    let { oid, oSupplierId, oSupplierName } = viewModel.getParams();
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      debugger;
      //如果客户编码为空，让所属分销商可以编辑
      if (agentname !== "") {
        filtervm.get("define10").getFromModel().setDisabled(true); //让所属分销商不可编辑
        filtervm.get("agentId_name").getFromModel().setDisabled(true); //让客户不可编辑
      }
      // 赋予搜索区字段初始值
      filtervm.get("agentId_name").getFromModel().setValue(agentname);
    });
  });
});
viewModel.getGridModel().on("beforeLoad", function (data) {
  debugger;
  if (event.target.id == "111010480searchicon") {
    viewModel.getGridModel().setPageIndex(1);
  }
});
function getUrlParams3(url) {
  let pattern = /(\w+|[\u4e00-\u9fa5]+)=(\w+|[\u4e00-\u9fa5]+)/gi;
  let result = {};
  url.replace(pattern, ($, $1, $2) => {
    result[$1] = $2;
  });
  return result;
}