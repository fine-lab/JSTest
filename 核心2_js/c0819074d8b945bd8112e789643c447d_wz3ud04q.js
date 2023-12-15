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
let productInfoList = viewModel.getGridModel("sy01_udi_product_infov2List"); //关联的商品列表
let productConfigure2List = viewModel.getGridModel("sy01_udi_product_configurev2List"); //关联的商品列表 子表配置包装信息
productInfoList.setState("fixedHeight", 280);
productConfigure2List.setState("fixedHeight", 350);
let checkNum = 0; //查询是否已经存在产品标识
//点击加载包装标识获取数
viewModel.get("button32ci") &&
  viewModel.get("button32ci").on("click", function (data) {
    let proId = viewModel.get("productUdi").getValue();
    let rows = productInfoList.getRows();
    if (typeof proId == "undefined" || proId === "" || proId == null) {
      cb.utils.alert("请先选择【产品标识】", "error");
      return;
    }
    // 清空下表数据
    productConfigure2List.clear();
    // 加载包装标识--单击
    let productSql = "select * from ISVUDI.ISVUDI.sy01_udi_product_list_bzbsxxv2 where sy01_udi_product_list_id = " + proId;
    cb.rest.invokeFunction(
      "ISVUDI.publicFunction.shareApi",
      {
        //传入参数 sqlType：类型
        sqlType: "check",
        sqlTableInfo: productSql,
        sqlCg: "sy01"
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          resultData = [];
          return false;
        } else {
          // 返回具体数据
          resultData = res.resDataRs;
          for (let i = 0; i < resultData.length; i++) {
            let tbrs = {
              bzcpbs: resultData[i].bzcpbs,
              cpbzjb: resultData[i].cpbzjb,
              bznhxyjbzcpbs: resultData[i].bznhxyjbzcpbs,
              bznhxyjbzcpbssl: resultData[i].bznhxyjcpbssl
            };
            // 下表添加行数据
            productConfigure2List.appendRow(tbrs);
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
//保存前校验
viewModel.on("beforeSave", function () {
  if (checkNum > 0) {
    cb.utils.alert("当前产品标识已经存在关联!请勿重复添加!", "waring");
    return false;
  }
});
//改为选择方案
productConfigure2List
  .getEditRowModel()
  .get("udiCreateConfigId_name")
  .on("afterValueChange", function (data) {
    console.log(data);
    var gridmodel2 = viewModel.get("sy01_udi_create_info2List");
    // 清空下表数据
    gridmodel2.clear();
    let sqlConfig = "select * from ISVUDI.ISVUDI.sy01_udi_create_config_sonv2 where sy01_udi_create_config_id = " + data.value.id;
    cb.rest.invokeFunction(
      "ISVUDI.publicFunction.shareApi",
      {
        //传入参数 sqlType：类型
        sqlType: "check",
        sqlTableInfo: sqlConfig,
        sqlCg: "sy01"
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          return false;
        } else {
          gridmodel2.setDataSource(res.resDataRs);
        }
      }
    );
  });
viewModel.get("productUdi_zxxsdycpbs") &&
  viewModel.get("productUdi_zxxsdycpbs").on("afterValueChange", function (data) {
    // 产品标识--值改变后
    productInfoList.clear();
    productConfigure2List.clear();
    //事件发生之前， 通过return true;否则return false;
    let zxcpid = viewModel.get("productUdi").getValue();
    let sqlInfo = "select id from ISVUDI.ISVUDI.sy01_udi_relation_productv2 where productUdi ='" + zxcpid + "'";
    cb.rest.invokeFunction(
      "ISVUDI.publicFunction.shareApi",
      {
        sqlType: "check",
        sqlTableInfo: sqlInfo,
        sqlCg: "sy01"
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("核查数据异常!", "error");
          return false;
        } else {
          // 返回具体数据
          let resultData = res.resDataRs;
          //如果有数据,则不能在新增
          if (resultData.length > 0) {
            cb.utils.alert("当前产品标识已经存在关联!请勿重复添加!", "waring");
            checkNum = resultData.length;
          } else {
            checkNum = 0;
          }
        }
      }
    );
  });