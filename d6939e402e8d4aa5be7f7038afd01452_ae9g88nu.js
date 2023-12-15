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
let productInfoList = viewModel.getGridModel("sy01_udi_product_infoList"); //关联的商品列表
let productConfigure2List = viewModel.getGridModel("sy01_udi_product_configure2List"); //关联的商品列表 子表配置包装信息
productInfoList.setState("fixedHeight", 280);
productConfigure2List.setState("fixedHeight", 350);
let checkNum = 0; //查询是否已经存在产品标识
//点击加载包装标识获取数
viewModel.get("button46jh") &&
  viewModel.get("button46jh").on("click", function (data) {
    let proId = viewModel.get("item80oh").getValue();
    let rows = productInfoList.getRows();
    // 清空下表数据
    productConfigure2List.clear();
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
productConfigure2List
  .getEditRowModel()
  .get("udiCreateConfigId_name")
  .on("afterValueChange", function (data) {
    console.log(data);
    var gridmodel2 = viewModel.get("sy01_udi_create_info2List");
    // 清空下表数据
    gridmodel2.clear();
    cb.rest.invokeFunction(
      "GT22176AT10.backDefaultGroup.getCreateUdiConf",
      {
        configId: data.value.id
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          return false;
        } else {
          gridmodel2.setDataSource(res.result);
        }
      }
    );
  });
viewModel.get("button73tj") &&
  viewModel.get("button73tj").on("click", function (data) {
    // 保存udi--单击
    let udiInfoValue = viewModel.get("item269ce").getValue();
    console.log(udiInfoValue);
    if (udiInfoValue.length <= 0) {
      return;
    }
    //保存后 记录 udi信息
    let newdate = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    for (i = 0; i < udiInfoValue.length; i++) {
      for (jxmxi = 0; jxmxi < udiInfoValue[i].udi_admin_djxx_jxmxList.length; jxmxi++) {
        //解析明细
        let adminJxmxList = udiInfoValue[i].udi_admin_djxx_jxmxList[jxmxi];
        let djbh = viewModel.get("code").getValue();
        let saveInfo = {
          id: guid(),
          trackingDirection: "去向", //跟踪方向
          billName: "UDI配置管理", //单据名称
          billNo: djbh, //单据编号
          rowIndex: "", //行号
          material: adminJxmxList.item298sh, //物料
          unit: adminJxmxList.item375ze, //计量单位
          qty: adminJxmxList.jiexishuliang, //数量
          optDate: newdate, //操作时间
          UDIFile_id: "" //UDI主档
        };
        cb.rest.invokeFunction(
          "GT22176AT10.publicFunction.saveUdiDataTrack",
          {
            UDI: adminJxmxList.item96wg,
            udiDataObject: saveInfo
          },
          function (err, res) {
            if (err != null) {
              cb.utils.alert("保存失败");
              return false;
            } else {
              cb.utils.alert("保存成功！");
            }
          }
        );
      }
    }
  });
function dateFormat(date, format) {
  date = new Date(date);
  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "H+": date.getHours() + 8, //hour+8小时
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    S: date.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}
//生成uuid
function guid() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
viewModel.get("productUdi_zxxsdycpbs") &&
  viewModel.get("productUdi_zxxsdycpbs").on("afterValueChange", function (data) {
    // 产品标识--值改变后
    productInfoList.clear();
    productConfigure2List.clear();
    //事件发生之前， 通过return true;否则return false;
    let zxcpid = viewModel.get("productUdi").getValue();
    let sqlInfo = "select id from GT22176AT10.GT22176AT10.sy01_udi_relation_product where productUdi ='" + zxcpid + "'";
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.shareApi",
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