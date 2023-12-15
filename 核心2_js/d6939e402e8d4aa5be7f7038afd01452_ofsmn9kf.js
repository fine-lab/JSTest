//   可以选择多个商品，每个商品对应不同包装标识（一对多关系）
//   删除对应商品时同时删除对应的包装标识
//   金蝶上场景(先添加2个商品，然后选择 加载包装标识，只会赋值第一个商品，第二个商品需要再点次 加载包装标识）
//   加载包装标识--关联产品标识库的 包装标识子表
//   点击加载包装标识 需要先选择 1中的产品标识列 （否则提示 请先选择【产品标识】）
//   更换产品标识列 - 需要清空 包装标识列表 （金蝶中没有清掉）
// 当产品标识包装标识子表 无包装标识时，系统默认有最小销售单元产品标识，产品标识包装标识子表 有包装标识时也加了最小销售单元产品标识 （金蝶当前逻辑）
// 当先加载包装标识 然后在选择2个商品，一样是只赋值第一个商品（金蝶当前逻辑）
//   该字段 关联生成规则表 填写好生成规则后，生成一个自动文本id关联
//   加载包装标识 --- 步骤：1.获取关联列表 ，赋值对应列，判断商品列是否为空，为空则不管，不为空赋值给商品当前选中的一列
console.log("----10--");
const productInfoList = viewModel.getGridModel("sy01_udi_product_infoList"); //关联的商品列表
const productConfigure2List = viewModel.getGridModel("sy01_udi_product_configure2List"); //关联的商品列表 子表配置包装信息
var udi_product_infoList = viewModel.get("sy01_udi_product_infoList"); //表格关联的商品列表
//点击加载包装标识获取数
viewModel.get("button46jh") &&
  viewModel.get("button46jh").on("click", function (data) {
    let proId = viewModel.get("item80oh").getValue();
    let rows = productInfoList.getRows();
    var gridmodel1 = viewModel.get("sy01_udi_product_configure2List");
    // 清空下表数据
    gridmodel1.clear();
    // 加载包装标识--单击
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.getProSonList",
      {
        proId: proId
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          resultData = [];
          return false;
        } else {
          // 返回具体数据
          resultData = res.proRes;
          for (i = 0; i < resultData.length; i++) {
            let tbrs = {
              bzcpbs: resultData[i].bzcpbs,
              cpbzjb: resultData[i].cpbzjb,
              bznhxyjbzcpbs: resultData[i].bznhxyjbzcpbs,
              bznhxyjbzcpbssl: resultData[i].bznhxyjbzcpbssl
            };
            // 下表添加行数据
            gridmodel1.appendRow(tbrs);
          }
        }
      }
    );
  });
// 相关商品切换时，删除孙表,将列换成对应的参照
productInfoList.on("afterCellValueChange", function (data) {
  if (data.cellName == "licenseName_licenceName" && data.value != data.oldValue) {
  }
});
viewModel.get("button57xe") &&
  viewModel.get("button57xe").on("click", function (data) {
    // 添加UDI规则--单击
    var gridmodel2 = viewModel.get("sy01_udi_create_info2List");
    // 清空下表数据
    gridmodel2.clear();
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.getUdiCoding",
      {
        typeCode: "GS1" //默认选择gs1 后期可选类型 共三种
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          resultData = [];
          return false;
        } else {
          // 返回具体数据
          resultData = res.proRes;
          for (i = 0; i < resultData.length; i++) {
            let tbrs = {
              applicationIdentifier: resultData[i].udiMeaning,
              identificationCodingNum: resultData[i].udiAi
            };
            // 下表添加行数据
            gridmodel2.appendRow(tbrs);
          }
        }
      }
    );
  });
viewModel.get("button72ya") &&
  viewModel.get("button72ya").on("click", function (data) {
    const djCode = viewModel.get("code").getValue();
    let datars = {
      billtype: "Voucher", // 单据类型
      billno: "a0a62540", // 单据号
      params: {
        mode: "add", // (编辑态edit、新增态add、浏览态browse)
        //传参
        danjuType: "UDI配置管理",
        danjuNum: djCode
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", datars, viewModel);
  });