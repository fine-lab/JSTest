// 包括：单据信息列，UDI解析明细列，udi主档列，udi扫码日志列
//     关闭返回数据按钮，扫码和校验单选按钮，是否无源单按钮，同个商品存在多个di提醒按钮，
//   选择扫码，表示本次扫码会对UDI码进行解析，如果扫码成功会记录在UDI解析明细和UDI扫码日志中
//   选择校验，表示本次扫码是UDI码进行单据数据校验，如果UDI能够匹配到对应UDI主档，则会提示校验成功；如果UDI不能够匹配到对应的UDI主档，则会提示校验失败；
//     当商品存在外箱包装并需要进行拆箱扫码时，为了避免可能因为拆箱多次扫码，多次解析导致数量不准确的情况：
// 	若不启用，则外包装UDI扫码时，则会进行解析到起始阶段的包装数量；
// 	若启用，则扫非起始包装阶段的UDI时，则不不会解析数量，只有对起始包装层级的UDI码进行扫码时才会解析数量。
// 销售出库单
// 采购收货单
// 采购入库单
// 购进入库验收
// 药品拒收单
// 采购退货单
// 购进退出复核
// 销售出库复核
// 药品运输单
// 质量复查单
// 盘点单
// 分量盘点单
// 其他入库单
// 其他出库单
// 移仓单
// 调拨入库单
// 调拨出库单
// 重点药品养护确认单
// 药品养护计划
// 药品停售停采单
// 解除药品停采停售单
// 不合格品登记
// 药品报损申请
// 销售退回验收
// 采购退货申请单
// 销售退货申请单
// 销售退回收货单
//在初级包装上的应用
// 植入类、介入类、设备类产品初包装的UDI码由标识符（01）、（10）和或（21）、（11）、（17）、（91）组成；其他产品初包装的UDI二维码由标识符（01）、（10）、（11）、（17）、（91）五部门组成。人工识读信息包含（01）、
// （91）、生产批号或序列号、生产日期、失效日期、配置（如配针规格）六部分组成。
// 举例如下：初包装UDI码为（01）06932992100755（10）181011（11）181012（17）211010（91）01A
//在二级包装上的应用
// 二级包装外面如果还有三级包装(如外纸箱)，产品的UDI码由标识符(01)、(10)、(11)、(17)四部分组 成。
// 人工识读信息包含(01)、(10)、(11)、(17)、生产批号、生产日期、失效日期、型号规格、数量、 备用配置说明(如配针规格)十部分组成。如果二级包装就是运输包装，则执行运输包装的规定。
// 举例如下：二级包装UDI码为（01）16932992100752（10）181011（11）181012（17）211010
//在外包装上的应用
// 如三级包装就是外包装(如外纸箱)，产品的UDI码由标识符(01)、(10)、(11)、(17)、(91)、(21)六部分组成。人工识读信息包含产品名称、(01)、(10)、(11)、(17)、(91)、(21)、生产批号、灭菌批号（无菌产品适用）、生产日期、失效日期、型号规格、数量、毛重、体积、REF、配置(如配针规格)17 部分组成。
// 举例如下：外包装UDI码为（01）26932992137137（10）190101（11）190102（17）211231（91）01A190102（21）0001
let cpbsTemp01 = ""; //标识临时保存
let phTemp10 = ""; //批号
let scrqTemp11 = ""; //生产日期
let sxrqTemp17 = ""; //失效日期
let xlhTemp21 = ""; //序列号
let kbs30 = ""; //可变数量
let nbxx91 = ""; //公司内部信息
let udiTemp = ""; //udi temp
let proDI = ""; //di
let proPI = ""; //pi
let indexOfCpbs = ""; //将产品标识存入，如果存在不在去查数据了
let indexOfUdi = ""; //将udi 存入 判断是否存在
let indexOfProduct = ""; //判断商品是否存在，如果存在不在添加列
let udiAdminDjxxList = viewModel.get("udi_admin_djxxList");
udiAdminDjxxList.setState("fixedHeight", 180); //设置列表页面固定高度
// 清空下表数据
let udiAdminDjxxJxmxList = viewModel.get("udi_admin_djxx_jxmxList");
udiAdminDjxxJxmxList.setState("fixedHeight", 200); //设置列表页面固定高度
let zdList = viewModel.get("udi_admin_zdList");
zdList.setState("fixedHeight", 180); //设置列表页面固定高度
//扫码日志
let smrzList = viewModel.get("udi_admin_smrzList");
smrzList.setState("fixedHeight", 300); //设置列表页面固定高度
// 清空下表数据
viewModel.get("udi") &&
  viewModel.get("udi").on("blur", function (data) {
    let udiValue = viewModel.get("udi").getValue();
    if (udiValue === "" || typeof udiValue == "undefined") {
      return;
    }
    udiTemp = udiValue;
    viewModel.get("udi").setValue("");
    //获取产品标识 去产品标识库里查询是否有，如果有返回，无提示无相关信息 需要先绑定
    let aRs = udiValue.split("(");
    if (aRs.length === 1) {
      cb.utils.alert("UDI错误！", "waring");
      return;
    }
    for (i = 0; i < aRs.length; i++) {
      if (aRs[i].indexOf("01)") !== -1) {
        cpbsTemp01 = "" + aRs[i].substring(3);
      } else if (aRs[i].indexOf("11)") !== -1) {
        scrqTemp11 = aRs[i].substring(3);
      } else if (aRs[i].indexOf("10)") !== -1) {
        phTemp10 = aRs[i].substring(3);
      } else if (aRs[i].indexOf("17)") !== -1) {
        sxrqTemp17 = aRs[i].substring(3);
      } else if (aRs[i].indexOf("21)") !== -1) {
        xlhTemp21 = aRs[i].substring(3);
      } else if (aRs[i].indexOf("30)") !== -1) {
        kbs30 = aRs[i].substring(3);
      } else if (aRs[i].indexOf("91)") !== -1) {
        nbxx91 = aRs[i].substring(3);
      }
    }
    //截取di 和pi
    let diPiRs = udiValue.split("(01)" + cpbsTemp01);
    proDI = "(01)" + cpbsTemp01;
    proPI = diPiRs[0] + diPiRs[1];
    //产品标识存在，直接加数量
    if (indexOfCpbs.indexOf(cpbsTemp01) !== -1) {
      udiAdminDjxxList.unselectAll(); //取消选中所有行
      for (i = 0; i < udiAdminDjxxList.getRows().length; i++) {
        let rowVal = udiAdminDjxxList.getCellValue(i, "item57pe"); //获取对应列的值
        console.log("---x-" + rowVal);
        if (rowVal === cpbsTemp01) {
          udiAdminDjxxList.select([i]); //设置grid选中行号为x行
        }
      }
      //判断udi是否存在 存在进入
      if (indexOfUdi.indexOf(udiTemp) !== -1) {
        for (jxi = 0; jxi < udiAdminDjxxJxmxList.getRows().length; jxi++) {
          let rowValJx = udiAdminDjxxJxmxList.getCellValue(jxi, "item96wg"); //获取对应列的值
          if (rowValJx === udiTemp) {
            let jiexishuliangVal = udiAdminDjxxJxmxList.getCellValue(jxi, "jiexishuliang"); //获取对应列的值
            let zxbzsl = udiAdminDjxxJxmxList.getCellValue(jxi, "item163ej"); //获取最小包装数量
            let jsNum = jiexishuliangVal + zxbzsl;
            udiAdminDjxxJxmxList.setCellValue(jxi, "jiexishuliang", jsNum, true);
          }
        }
      }
    }
    console.log("---" + cpbsTemp01 + "---" + scrqTemp11 + "---" + phTemp10 + "---" + sxrqTemp17 + "---" + xlhTemp21 + "---" + kbs30 + "---" + nbxx91);
    //产品标识不存在，查询产品标识关联商品表子表 在获取商品信息
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.getProById",
      {
        proCode: "" + cpbsTemp01
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          return false;
        }
        // 返回具体数据
        let resultData = res.proRes;
        let configure2Rs = res.configure2Rs; //产品标识包装信息
        let proUdiRs = res.productUDIListRs;
        if (resultData.length === 0) {
          cb.utils.alert("DI[" + cpbsTemp01 + "]未配置物料或者UDI配置方案未审核！");
          return false;
        }
        for (i = 0; i < resultData.length; i++) {
          let tbrs = {
            item121ud: resultData[i].productCode,
            shangpin: resultData[i].productName,
            item57pe: proUdiRs[0].zxxsdycpbs, //产品标识
            danwei: resultData[i].productSpecifications
          };
          //商品不存在则添加列
          if (indexOfProduct.indexOf(resultData[i].productCode) === -1) {
            // 下表添加行数据
            udiAdminDjxxList.appendRow(tbrs);
            indexOfProduct = indexOfProduct + resultData[i].productCode;
          }
          //判断udi是否存在 不存在进入
          if (indexOfUdi.indexOf(udiTemp) === -1) {
            //最小包装数量
            let zxbzNum = 0;
            if (cb.utils.isEmpty(configure2Rs[0].bznhxyjbzcpbssl)) {
              zxbzNum = 1;
            } else {
              zxbzNum = Number(configure2Rs[0].bznhxyjbzcpbssl);
            }
            let jxmx = {
              batchNum: phTemp10,
              shengchanriqi: scrqTemp11,
              youxiaoqizhi: sxrqTemp17,
              miejunpihao: "",
              jiexishuliang: zxbzNum,
              item96wg: udiTemp,
              xuliehao: xlhTemp21,
              item163ej: zxbzNum,
              item225ic: proDI,
              item261ef: proPI,
              item298sh: resultData[0].productCode,
              item336dh: resultData[0].productName,
              item375ze: resultData[0].productSpecifications,
              item415jj: proUdiRs[0].zxxsdycpbs, //产品标识,
              item456od: configure2Rs[0].bzcpbs, //包装标识,
              item498yb: configure2Rs[0].cpbzjb //
            };
            udiAdminDjxxJxmxList.appendRow(jxmx);
            indexOfUdi = indexOfUdi + "" + udiTemp;
          }
        }
        indexOfCpbs = indexOfCpbs + "" + cpbsTemp01;
        let mydate = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
        let scanCodeInfo = {
          logUdi: udiTemp,
          baozhuangjieduan: configure2Rs[0].cpbzjb, //包装阶段
          saomashijian: mydate, //扫码时间
          baozhuangbiaoshi: configure2Rs[0].bzcpbs, //包装标识
          sY01_boolean: 1, //是否新增
          item186xb: resultData[0].productCode, //商品
          item190ak: phTemp10, //批号
          item195sj: scrqTemp11, //生产日期
          item201sa: sxrqTemp17, //有效期至
          item208dc: "", //灭菌批号
          item216ne: xlhTemp21 //序列号
        };
        smrzList.appendRow(scanCodeInfo);
      }
    );
  });
viewModel.on("customInit", function (data) {
  viewModel.getParams().autoAddRow = false; //表格数据为空时，取消表格自动增加一行的功能
});
viewModel.get("button12nk") &&
  viewModel.get("button12nk").on("click", function (data) {
    // 关闭返回数据--单击
    //保存日志
    saveLogUdi();
    //绑定到数据中心
    saveUdiData();
    //回写主页信息
    rtWebInfo();
    //关闭当前页面
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
//回写到主页
function rtWebInfo() {
  let rtType = viewModel.getParams().danjuType;
  if ("UDI配置管理" === rtType) {
    udiPeiZ();
  } else if ("采购入库" === rtType) {
  } else if ("采购出库" === rtType) {
  }
}
function udiPeiZ() {
  let udiPeiZParentViewModel = viewModel.getCache("parentViewModel");
  const productInfoList = udiPeiZParentViewModel.getGridModel("sy01_udi_product_infoList"); //关联的商品列表
  //将商品信息 赋值到列表上
  if (udiAdminDjxxList.getRows() > 0) {
    for (i = 0; i < udiAdminDjxxList.getRows(); i++) {
      let proRsInfo = {
        productCode_code: udiAdminDjxxJxmxList.getCellValue(i, "item121ud"), //商品code
        productName: udiAdminDjxxJxmxList.getCellValue(i, "shangpin"), //商品名称
        productCode: udiAdminDjxxJxmxList.getCellValue(i, "item121ud"), //商品code
        productSpecifications: udiAdminDjxxJxmxList.getCellValue(i, "danwei") //规格型号
      };
      productInfoList.appendRow(proRsInfo);
    }
  }
}
function saveUdiData() {
  if (udiAdminDjxxJxmxList.getRows().length > 0) {
    for (i = 0; i < udiAdminDjxxJxmxList.getRows().length; i++) {
      let jxmxInfo = {
        code: guid(),
        UDI: udiAdminDjxxJxmxList.getCellValue(i, "item96wg"), // ,
        DI: udiAdminDjxxJxmxList.getCellValue(i, "item225ic"), // ,
        PI: udiAdminDjxxJxmxList.getCellValue(i, "item261ef"), // ,
        material: udiAdminDjxxJxmxList.getCellValue(i, "logUdi"), // ,
        materialName: udiAdminDjxxJxmxList.getCellValue(i, "item336dh"), //商品,
        materialCode: udiAdminDjxxJxmxList.getCellValue(i, "item298sh"), //商品编码,
        spec: udiAdminDjxxJxmxList.getCellValue(i, "item375ze"), //规格型号,
        batchNo: udiAdminDjxxJxmxList.getCellValue(i, "batchNum"), //批号,
        produceDate: udiAdminDjxxJxmxList.getCellValue(i, "shengchanriqi"), //生产日期,
        validateDate: udiAdminDjxxJxmxList.getCellValue(i, "youxiaoqizhi"), //有效期至,
        serialNumber: udiAdminDjxxJxmxList.getCellValue(i, "xuliehao"), //序列号,
        sterilizationBatchNo: udiAdminDjxxJxmxList.getCellValue(i, "miejunpihao"), //灭菌批号,
        productIdentification: udiAdminDjxxJxmxList.getCellValue(i, "item415jj"), //产品标识,
        packageIdentification: udiAdminDjxxJxmxList.getCellValue(i, "item456od"), //包装标识,
        packagingPhase: udiAdminDjxxJxmxList.getCellValue(i, "item498yb"), //包装阶段,
        identificationQty: udiAdminDjxxJxmxList.getCellValue(i, "item163ej") //包装内含小一级产品标识数量,
      };
      cb.rest.invokeFunction(
        "GT22176AT10.publicFunction.saveUdiData",
        {
          UDI: udiAdminDjxxJxmxList.getCellValue(i, "item96wg"),
          udiDataObject: jxmxInfo
        },
        function (err, res) {
          if (typeof err !== "undefined") {
            alert(err.message);
            return;
          }
          cb.utils.alert("UDI绑定数据中心成功！");
          console.log(res);
        }
      );
    }
  }
}
function saveLogUdi() {
  let djtype = viewModel.getParams().danjuType;
  let djNum = viewModel.getParams().danjuNum;
  if (smrzList.getRows().length > 0) {
    let smrz = [];
    for (i = 0; i < smrzList.getRows().length; i++) {
      let smrz_b = {
        udi: smrzList.getCellValue(i, "logUdi"), //获取对应列的值udi,
        packagingPhase: smrzList.getCellValue(i, "baozhuangjieduan"), //包装阶段
        packageIdentification: smrzList.getCellValue(i, "baozhuangbiaoshi"), //包装标识
        scanDate: smrzList.getCellValue(i, "saomashijian"), //扫码时间
        rowIndex: "1", //行号
        material: smrzList.getCellValue(i, "item186xb"), //商品 存id
        batchNo: smrzList.getCellValue(i, "item190ak"), //批号
        produceDate: smrzList.getCellValue(i, "item195sj"), //生产日期
        validateDate: smrzList.getCellValue(i, "item201sa"), //有效期至
        sterilizationBatchNo: smrzList.getCellValue(i, "item208dc"), //灭菌批号
        serialNumber: smrzList.getCellValue(i, "item216ne") //序列号
      };
      smrz.push(smrz_b);
    }
    //对应的实体数据
    var logObject = {
      billCode: djNum,
      billType: djtype,
      code: guid(),
      UDIScanRecordEntryList: smrz
    };
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.saveUdiLogInfo",
      {
        logObject: logObject
      },
      function (err, res) {
        if (typeof err !== "undefined") {
          alert(err.message);
          return;
        }
        cb.utils.alert("日志保存成功！");
        console.log(res);
      }
    );
  }
}
//生成uuid
function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
//处理日期
function dateFormat(date, format) {
  date = new Date(date);
  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "H+": date.getHours(), //hour+8小时
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    S: date.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}