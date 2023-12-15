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
      let date = new Date(value);
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
    let udi = request.udi; //udi码
    let isSourceOrder = request.isSourceOrder; //是否有源单
    let orderInfo = request.orderInfo; //订单信息
    if (isSourceOrder == 1) {
      //有源单校验UDI
      //查询UDI数据中心是否有数据
      let UDIFileInfo = ObjectStore.queryByYonQL(
        "select *,material.productDetail.isBatchManage isBatchManage,material.productDetail.isSerialNoManage isSerialNoManage,material.productDetail.isExpiryDateManage isExpiryDateManage from ISVUDI.ISVUDI.UDIFilev2 where UDI ='" +
          udi +
          "'"
      );
      if (UDIFileInfo == null || UDIFileInfo.length == 0) {
        throw new Error("UDI数据中心不存在,无法绑定！");
      }
      if (orderInfo.length > 0) {
        let isQualified = true;
        for (let i = 0; i < orderInfo.length; i++) {
          let checkSuccess = 0;
          if (orderInfo[i].materialId == UDIFileInfo[0].material) {
            if (orderInfo[i].batchno != undefined && orderInfo[i].batchno != null && orderInfo[i].batchno != "" && orderInfo[i].batchno == UDIFileInfo[0].batchNo) {
              checkSuccess++;
            } else if ((orderInfo[i].batchno = undefined || orderInfo[i].batchno == null || orderInfo[i].batchno == "")) {
              checkSuccess++;
            }
            if (orderInfo[i].invaliddate != undefined && orderInfo[i].invaliddate != null && orderInfo[i].invaliddate != "" && orderInfo[i].invaliddate == UDIFileInfo[0].validateDate) {
              checkSuccess++;
            } else if ((orderInfo[i].invaliddate = undefined || orderInfo[i].invaliddate == null || orderInfo[i].invaliddate == "")) {
              checkSuccess++;
            }
            if (orderInfo[i].producedate != undefined && orderInfo[i].producedate != null && orderInfo[i].producedate != "" && orderInfo[i].producedate == UDIFileInfo[0].produceDate) {
              checkSuccess++;
            } else if ((orderInfo[i].producedate = undefined || orderInfo[i].producedate == null || orderInfo[i].producedate == "")) {
              checkSuccess++;
            }
            if (checkSuccess == 3) {
              isQualified = false;
              break;
            }
          }
        }
        if (isQualified) {
          throw new Error("UDI信息和列表单据信息不一致！");
        }
      } else {
        if (orderInfo.materialId == UDIFileInfo[0].material) {
          if (orderInfo.batchno != undefined && orderInfo.batchno != null && orderInfo.batchno != "" && orderInfo.batchno != UDIFileInfo[0].batchNo) {
            throw new Error("UDI批次号信息与单据不一致,无法绑定！");
          }
          if (orderInfo.invaliddate != undefined && orderInfo.invaliddate != null && orderInfo.invaliddate != "" && orderInfo.invaliddate != UDIFileInfo[0].validateDate) {
            throw new Error("UDI有效期至信息与单据不一致,无法绑定！");
          }
          if (orderInfo.producedate != UDIFileInfo[0].produceDate) {
            throw new Error("UDI生产日期信息与单据不一致,无法绑定！");
          }
        } else {
          throw new Error("UDI物料信息与单据不一致,无法绑定！");
        }
      }
      //查询包装信息
      let packging = ObjectStore.selectByMap("ISVUDI.ISVUDI.sy01_udi_product_list_bzbsxxv2", { bzcpbs: UDIFileInfo[0].packageIdentification });
      //绑定UDI时需要
      UDIFileInfo[0].qty = orderInfo.materialNum;
      UDIFileInfo[0].unit = orderInfo.unitName;
      UDIFileInfo[0].packgingNum = packging[0].bznhxyjcpbssl;
      UDIFileInfo[0].parsingNum = packging[0].bznhxyjcpbssl;
      return { result: UDIFileInfo };
    } else {
      //无源单校验UDI
      let index = udi.indexOf("(10)");
      let productPackingLogo = udi.slice(4, index); //截取产品标识
      let productPacking = ObjectStore.selectByMap("ISVUDI.ISVUDI.sy01_udi_product_configurev2", { bzcpbs: productPackingLogo }); //查询包装产品标识
      if (productPacking == null || productPacking.length == 0) {
        throw new Error("没有对应包装产品标识！");
      }
      let udiCreateConfig = ObjectStore.selectByMap("ISVUDI.ISVUDI.sy01_udi_create_config_sonv2", { sy01_udi_create_config_id: productPacking[0].udiCreateConfigId });
      if (udiCreateConfig != null && udiCreateConfig.length > 0) {
        //查询产品标识
        let productLogo = ObjectStore.queryByYonQL(
          "select bzcpbs,sy01_udi_product_info_id.product product,sy01_udi_product_info_id.productCode materialCode,sy01_udi_product_info_id.productSpecifications productSpecifications,sy01_udi_product_info_id.productName materialName from  ISVUDI.ISVUDI.sy01_udi_product_configurev2    where cpbzjb like '最小' and sy01_udi_product_info_id = '" +
            productPacking[0].sy01_udi_product_info_id +
            "'"
        );
        let UDIFileInfo = [
          {
            UDI: udi,
            productIdentification: productLogo[0].bzcpbs,
            packageIdentification: productPacking[0].bzcpbs,
            packgingNum: productPacking[0].bznhxyjbzcpbssl,
            parsingNum: productPacking[0].bznhxyjbzcpbssl
          }
        ];
        UDIFileInfo[0].packagingPhase = productPacking[0].cpbzjb;
        UDIFileInfo[0].identificationQty = productPacking[0].bznhxyjbzcpbssl;
        UDIFileInfo[0].DI = udi.slice(0, index);
        UDIFileInfo[0].PI = udi.slice(index);
        UDIFileInfo[0].material = productLogo[0].product;
        UDIFileInfo[0].materialCode = productLogo[0].materialCode;
        UDIFileInfo[0].spec = productLogo[0].productSpecifications;
        UDIFileInfo[0].materialName = productLogo[0].materialName;
        for (let j = 0; j < udiCreateConfig.length; j++) {
          //判断日期批号位数是否相同
          let dataSize = udiCreateConfig[j].dataSize;
          let startIndex = udi.indexOf(udiCreateConfig[j].identificationCodingNum);
          let lastIndex = udi.length;
          let key = "";
          let dataFormat = "";
          let errorMessage = "";
          if (udiCreateConfig[j].identificationCodingNum == "(01)" || udiCreateConfig[j].identificationCodingNum.indexOf("01") > -1) {
            if (dataSize != productPackingLogo.length) {
              errorMessage = "全球贸易项目代码长度和生成规则位数不一致";
            }
            continue;
          } else if (udiCreateConfig[j].identificationCodingNum == "(10)" || udiCreateConfig[j].identificationCodingNum.indexOf("10") > -1) {
            lastIndex = udi.indexOf("(11)");
            errorMessage = "批次号长度和生成规则位数不一致！";
            key = "yourkeyHere";
          } else if (udiCreateConfig[j].identificationCodingNum == "(17)" || udiCreateConfig[j].identificationCodingNum.indexOf("17") > -1) {
            lastIndex = udi.indexOf("(21)");
            errorMessage = "有效期长度和生成规则位数不一致！";
            key = "yourkeyHere";
            dataFormat = udiCreateConfig[j].dataFormat;
          } else if (udiCreateConfig[j].identificationCodingNum == "(11)" || udiCreateConfig[j].identificationCodingNum.indexOf("11") > -1) {
            lastIndex = udi.indexOf("(17)");
            errorMessage = "生产日期和生成规则位数不一致！";
            key = "yourkeyHere";
            dataFormat = udiCreateConfig[j].dataFormat;
          } else if (udiCreateConfig[j].identificationCodingNum == "(21)" || udiCreateConfig[j].identificationCodingNum.indexOf("21") > -1) {
            key = "yourkeyHere";
            errorMessage = "序列号长度和生成规则位数不一致！";
          }
          let value = udi.slice(startIndex, lastIndex).substr(4);
          if (value.length != dataSize) {
            throw new Error(errorMessage);
          }
          if (dataFormat != "") {
            value = dateTempString(value, dataFormat);
          }
          UDIFileInfo[0][key] = value;
        }
        return { result: UDIFileInfo };
      } else {
        throw new Error("包装产品标识没有配置生成UDI规则");
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });