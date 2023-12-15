let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let dateTempString = function (str, format) {
      if (format == "yyyyMM") {
        str += "01";
      }
      str = str.replace(/-/g, "");
      let datetemp = "";
      if (str.length === 6) {
        let mydate = dateFormat(new Date(), "yyyy-MM-dd");
        datetemp = mydate.slice(0, 2); //获取当前年
      }
      let numTemp = str.length / 2;
      let strTemp = str;
      //两个i 不能同时在一个方法内，不然会乱加 絮乱
      for (let datei = 0; datei < numTemp; datei++) {
        if (strTemp.length === 8) {
          datetemp = strTemp.slice(0, 4); //2022
          strTemp = strTemp.slice(4);
        }
        if (strTemp.length === 6) {
          datetemp = datetemp + "" + strTemp.slice(0, 2); //2022
          strTemp = strTemp.slice(2);
        }
        if (strTemp.length === 4) {
          datetemp = datetemp + "-" + strTemp.slice(0, 2) + "-" + strTemp.slice(2);
          strTemp = "";
        }
      }
      return datetemp;
    };
    //处理日期
    let dateFormat = function (value, format) {
      let times = value.getTime() + 8 * 60 * 60 * 1000;
      let date = new Date(times);
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
    };
    let udiList = request.udiList; //udi码
    let orderDetailList = request.orderDetailList; //订单信息
    let billType = request.billType; //来源单据
    //是否匹配序列号
    let isCheckSerial = request.isCheckSerial;
    let UDIFileInfo = [];
    //不能绑定的UDI列表
    let unbindingUdi = [];
    //合格UDI列表
    let qualifiedUdiList = [];
    //不合格产品标识
    let unQualifiedLogo = [];
    //不存在产品标识
    let nonexistenceLogo = [];
    if (udiList == undefined || udiList == null || udiList.length == 0) {
      throw new Error("没有可绑定的UDI！");
    }
    if (orderDetailList == undefined || orderDetailList == null || orderDetailList.length == 0) {
      throw new Error("没有UDI可绑定的单据信息！");
    }
    let udiSize = udiList.length;
    let qualifiedLogo = {};
    //校验UDI是否合格
    for (let i = 0; i < udiSize; i++) {
      //获取产品标识 去产品标识库里查询是否有，如果有返回，无提示无相关信息 需要先绑定
      let udi = udiList[i];
      let aRs = udi.split("(");
      if (aRs.length === 1) {
        unbindingUdi.push({ udiCode: udi, errorMessage: "UDI码错误！" });
        continue;
      }
      let productPackingLogo = "";
      let batchNo = "";
      let validateDate = "";
      let produceDate = "";
      let serialNumber = "";
      let kbs30 = "";
      let nbxx91 = "";
      for (let i = 0; i < aRs.length; i++) {
        let rssub = aRs[i].substring(3);
        if (aRs[i].indexOf("01)") !== -1) {
          productPackingLogo = "" + rssub;
        } else if (aRs[i].indexOf("11)") !== -1) {
          //如果日期为6为 则221102 为2022-11-02
          produceDate = rssub;
        } else if (aRs[i].indexOf("10)") !== -1) {
          batchNo = rssub;
        } else if (aRs[i].indexOf("17)") !== -1) {
          validateDate = rssub;
        } else if (aRs[i].indexOf("21)") !== -1) {
          serialNumber = rssub;
        } else if (aRs[i].indexOf("30)") !== -1) {
          kbs30 = rssub;
        } else if (aRs[i].indexOf("91)") !== -1) {
          nbxx91 = rssub;
        }
      }
      //判断udi产品标识是否已经校验
      if (unQualifiedLogo.includes(productPackingLogo)) {
        continue;
      } else if (nonexistenceLogo.includes(productPackingLogo)) {
        continue;
      }
      let productPacking = qualifiedLogo[productPackingLogo];
      if (productPacking == undefined || productPacking == null) {
        //查询包装产品标识
        //查询包装产品标识
        productPacking = ObjectStore.queryByYonQL("select * from I0P_UDI.I0P_UDI.sy01_udi_product_configurev3 where sy01_udi_product_info_id.dr =0 and bzcpbs ='" + productPackingLogo + "'");
        if (productPacking == null || productPacking.length == 0) {
          nonexistenceLogo.push(productPackingLogo);
          continue;
        }
        //记录产品标识对象避免重复查询
        qualifiedLogo[productPackingLogo] = productPacking;
      }
      let udiCreateConfig = productPacking.udiCreateConfig;
      if (udiCreateConfig == undefined || udiCreateConfig == null) {
        //查询生成规则
        udiCreateConfig = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_create_config_sonv3", { sy01_udi_create_config_id: productPacking[0].udiCreateConfigId });
      }
      if (udiCreateConfig != null && udiCreateConfig.length > 0) {
        productPacking.udiCreateConfig = udiCreateConfig;
        let productLogo = productPacking.productLogo;
        if (productLogo == undefined || productLogo == null) {
          //查询产品标识
          productLogo = ObjectStore.queryByYonQL(
            "select *,sy01_udi_product_info_id.product product,sy01_udi_product_info_id.productCode materialCode,sy01_udi_product_info_id.productSpecifications productSpecifications,sy01_udi_product_info_id.productName materialName from  I0P_UDI.I0P_UDI.sy01_udi_product_configurev3    where cpbzjb like '最小' and sy01_udi_product_info_id = '" +
              productPacking[0].sy01_udi_product_info_id +
              "'"
          );
          productPacking.productLogo = productLogo;
        }
        UDIFileInfo = [{ UDI: udi, productIdentification: productLogo[0].bzcpbs, packageIdentification: productPacking[0].bzcpbs }];
        UDIFileInfo[0].packagingPhase = productPacking[0].cpbzjb;
        UDIFileInfo[0].identificationQty = productPacking[0].bznhxyjbzcpbssl;
        UDIFileInfo[0].DI = "(01)" + productPackingLogo;
        UDIFileInfo[0].PI = udi.replace("(01)" + productPackingLogo, "");
        UDIFileInfo[0].material = productLogo[0].product;
        UDIFileInfo[0].udiConfigId = productPacking[0].id;
        UDIFileInfo[0].materialCode = productLogo[0].materialCode;
        UDIFileInfo[0].spec = productLogo[0].productSpecifications;
        UDIFileInfo[0].materialName = productLogo[0].materialName;
        UDIFileInfo[0].createTime = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
        UDIFileInfo[0].parsingNum = 1;
        let isQualifiedUdi = true;
        for (let j = 0; j < udiCreateConfig.length; j++) {
          //判断日期批号位数是否相同
          let dataSize = udiCreateConfig[j].dataSize;
          let value = "";
          let key = "";
          let dataFormat = "";
          let errorMessage = "";
          if (udiCreateConfig[j].identificationCodingNum == "(01)" || udiCreateConfig[j].identificationCodingNum.indexOf("01") > -1) {
            if (dataSize != productPackingLogo.length) {
              errorMessage = "全球贸易项目代码长度和生成规则位数不一致";
            }
            value = productPackingLogo;
            continue;
          } else if (udiCreateConfig[j].identificationCodingNum == "(10)" || udiCreateConfig[j].identificationCodingNum.indexOf("10") > -1) {
            errorMessage = "批次号长度和生成规则位数不一致！";
            key = "yourkeyHere";
            value = batchNo;
          } else if (udiCreateConfig[j].identificationCodingNum == "(17)" || udiCreateConfig[j].identificationCodingNum.indexOf("17") > -1) {
            errorMessage = "有效期长度和生成规则位数不一致！";
            key = "yourkeyHere";
            dataFormat = udiCreateConfig[j].dataFormat;
            value = validateDate;
          } else if (udiCreateConfig[j].identificationCodingNum == "(11)" || udiCreateConfig[j].identificationCodingNum.indexOf("11") > -1) {
            errorMessage = "生产日期和生成规则位数不一致！";
            key = "yourkeyHere";
            dataFormat = udiCreateConfig[j].dataFormat;
            value = produceDate;
          } else if (udiCreateConfig[j].identificationCodingNum == "(21)" || udiCreateConfig[j].identificationCodingNum.indexOf("21") > -1) {
            key = "yourkeyHere";
            errorMessage = "序列号长度和生成规则位数不一致！";
            value = serialNumber;
          }
          if (value.length != dataSize) {
            unbindingUdi.push({ udiCode: udi, errorMessage: "UDI" + errorMessage });
            isQualifiedUdi = false;
            break;
          }
          if (dataFormat != "") {
            value = dateTempString(value, dataFormat);
          }
          UDIFileInfo[0][key] = value;
        }
        if (isQualifiedUdi) {
          qualifiedUdiList.push(UDIFileInfo[0]);
        }
      } else {
        unQualifiedLogo.push(productPackingLogo);
      }
    }
    let apiPreAndAppCode = extrequire("I0P_UDI.publicFunction.getApiPreAndApp").execute();
    let domain = "ustock";
    let serialSql = "";
    let billName = "";
    let billCode = "";
    if (billType == "yonbip_scm_othinrecord_list" || billType.indexOf("othinrecord") > -1) {
      //期初库存（其他入库单）
      serialSql = "st.othinrecord.OthInRecordsSN";
      billName = "期初库存单";
    } else if (billType == "yonbip_scm_purinrecord_list" || billType.indexOf("purinrecord") > -1) {
      //采购入库
      serialSql = "st.purinrecord.PurInRecordsSN";
      billName = "采购入库单";
    }
    let appContext = AppContext();
    let obj = JSON.parse(appContext);
    let tid = obj.currentUser.tenantId;
    let params = {};
    params.udiList = qualifiedUdiList;
    params.serialSql = serialSql;
    params.isCheckSerial = isCheckSerial == null || isCheckSerial == undefined ? 0 : isCheckSerial;
    params.tenantId = tid;
    params.billName = billName;
    params.billType = billType;
    params.domain = domain;
    params.orderDetailList = orderDetailList;
    return { paramsObj: params, unbindingUdi: unbindingUdi, unQualifiedLogo: unQualifiedLogo, nonexistenceLogo: nonexistenceLogo };
    //单据明细匹配UDI的数量
    //新增扫码日志
    let errorCount = unbindingUdi.length + unQualifiedLogo.length + nonexistenceLogo.length;
    //截取一百条失败UDI避免提示过多
    unbindingUdi = unbindingUdi.slice(0, 100);
    return { errorCount: errorCount, unbindingUdi: unbindingUdi, unQualifiedLogo: unQualifiedLogo, nonexistenceLogo: nonexistenceLogo, addUdiList: addUdiList };
  }
}
exports({ entryPoint: MyAPIHandler });