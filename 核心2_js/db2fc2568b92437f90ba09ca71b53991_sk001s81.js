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
    let udi = request.udi; //udi码
    let isSourceOrder = request.isSourceOrder; //是否有源单
    let orderInfo = request.orderInfo; //订单信息
    let isStartPg = request.isStartPg; //是否起始包装
    let billType = request.billType; //来源单据
    let UDIFileInfo = [];
    if (isSourceOrder == 1) {
      //有源单校验UDI
      //查询UDI数据中心是否有数据
      let serialNumber = "";
      if (udi.indexOf("w=") != -1) {
        serialNumber = udi.split("w=")[1];
      }
      UDIFileInfo = ObjectStore.queryByYonQL(
        "select *,material.productDetail.isBatchManage isBatchManage,material.productDetail.isSerialNoManage isSerialNoManage,material.productDetail.isExpiryDateManage isExpiryDateManage from I0P_UDI.I0P_UDI.UDIFilev3 where UDI ='" +
          udi +
          "' or serialNumber = '" +
          serialNumber +
          "'"
      );
      if (UDIFileInfo == null || UDIFileInfo.length == 0) {
        throw new Error("UDI数据中心不存在,无法绑定！");
      }
      //查询包装信息
      let packging = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_list_bzbsxxv3", { bzcpbs: UDIFileInfo[0].packageIdentification });
      let pgNum = 1;
      if (isStartPg == 1) {
        pgNum = packging[0].bznhxyjcpbssl;
      }
      UDIFileInfo[0].packgingNum = pgNum;
      UDIFileInfo[0].parsingNum = pgNum;
    } else {
      //无源单校验UDI
      //获取产品标识 去产品标识库里查询是否有，如果有返回，无提示无相关信息 需要先绑定
      let aRs = udi.split("(");
      let productPackingLogo = "";
      let batchNo = "";
      let validateDate = "";
      let produceDate = "";
      let serialNumber = "";
      let kbs30 = "";
      let nbxx91 = "";
      let piCode = "";
      //判断UDI是否包含括号
      if (aRs.length === 1) {
        productPackingLogo = udi.substr(2, 14);
        piCode = udi.replace("01" + productPackingLogo, "");
      } else {
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
      }
      //查询包装产品标识
      //查询包装产品标识
      let productPacking = ObjectStore.queryByYonQL("select * from I0P_UDI.I0P_UDI.sy01_udi_product_configurev3 where sy01_udi_product_info_id.dr =0 and bzcpbs ='" + productPackingLogo + "'");
      if (productPacking == null || productPacking.length == 0) {
        throw new Error("UDI配置方案没有对应包装产品标识！");
      }
      let errorMessage = "";
      for (let i = 0; i < productPacking.length; i++) {
        //查询生成规则
        let querySql =
          "select * from I0P_UDI.I0P_UDI.sy01_udi_create_config_sonv3 where sy01_udi_create_config_id in (select id from I0P_UDI.I0P_UDI.sy01_udi_create_configv3 where id='" +
          productPacking[i].udiCreateConfigId +
          "') order by serialNum asc";
        let udiCreateConfig = ObjectStore.queryByYonQL(querySql);
        if (udiCreateConfig != null && udiCreateConfig.length > 0) {
          //查询最小产品标识
          let productLogo = ObjectStore.queryByYonQL(
            "select *,sy01_udi_product_info_id.product product,sy01_udi_product_info_id.productCode materialCode,sy01_udi_product_info_id.productSpecifications productSpecifications,sy01_udi_product_info_id.productName materialName from  I0P_UDI.I0P_UDI.sy01_udi_product_configurev3    where cpbzjb like '最小' and sy01_udi_product_info_id = '" +
              productPacking[i].sy01_udi_product_info_id +
              "'"
          );
          let pgNum = 1;
          if (isStartPg == 1) {
            pgNum = productPacking[0].bznhxyjbzcpbssl;
          }
          UDIFileInfo = [{ UDI: udi, productIdentification: productLogo[0].bzcpbs, packageIdentification: productPacking[0].bzcpbs, packgingNum: pgNum, parsingNum: pgNum }];
          UDIFileInfo[0].packagingPhase = productPacking[0].cpbzjb;
          UDIFileInfo[0].identificationQty = productPacking[0].bznhxyjbzcpbssl;
          UDIFileInfo[0].DI = "(01)" + productPackingLogo;
          UDIFileInfo[0].PI = udi.replace("(01)" + productPackingLogo, "");
          UDIFileInfo[0].material = productLogo[0].product;
          UDIFileInfo[0].materialCode = productLogo[0].materialCode;
          UDIFileInfo[0].spec = productLogo[0].productSpecifications;
          UDIFileInfo[0].materialName = productLogo[0].materialName;
          UDIFileInfo[0].createTime = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
          if (piCode.length > 0) {
            UDIFileInfo[0].DI = "01" + productPackingLogo;
            UDIFileInfo[0].PI = piCode;
          }
          let tmpStr = piCode;
          for (let j = 0; j < udiCreateConfig.length; j++) {
            //判断日期批号位数是否相同
            let dataSize = udiCreateConfig[j].dataSize;
            let value = "";
            let key = "";
            let dataFormat = "";
            if (udiCreateConfig[j].identificationCodingNum == "(01)" || udiCreateConfig[j].identificationCodingNum.indexOf("01") > -1) {
              if (dataSize != productPackingLogo.length) {
                errorMessage = "全球贸易项目代码长度和生成规则位数不一致";
              }
              value = productPackingLogo;
              continue;
            } else if (udiCreateConfig[j].identificationCodingNum == "(10)" || udiCreateConfig[j].identificationCodingNum.indexOf("10") > -1) {
              if (piCode.length > 0) {
                batchNo = tmpStr.substr(2, dataSize);
                tmpStr = tmpStr.replace("10" + batchNo, "");
              }
              errorMessage = "批次号长度和生成规则位数不一致！";
              key = "yourkeyHere";
              value = batchNo;
            } else if (udiCreateConfig[j].identificationCodingNum == "(11)" || udiCreateConfig[j].identificationCodingNum.indexOf("11") > -1) {
              if (piCode.length > 0) {
                produceDate = tmpStr.substr(2, dataSize);
                tmpStr = tmpStr.replace("11" + produceDate, "");
              }
              errorMessage = "生产日期和生成规则位数不一致！";
              key = "yourkeyHere";
              dataFormat = udiCreateConfig[j].dataFormat;
              value = produceDate;
            } else if (udiCreateConfig[j].identificationCodingNum == "(17)" || udiCreateConfig[j].identificationCodingNum.indexOf("17") > -1) {
              if (piCode.length > 0) {
                validateDate = tmpStr.substr(2, dataSize);
                tmpStr = tmpStr.replace("17" + validateDate, "");
              }
              errorMessage = "有效期长度和生成规则位数不一致！";
              key = "yourkeyHere";
              dataFormat = udiCreateConfig[j].dataFormat;
              value = validateDate;
            } else if (udiCreateConfig[j].identificationCodingNum == "(21)" || udiCreateConfig[j].identificationCodingNum.indexOf("21") > -1) {
              if (piCode.length > 0) {
                serialNumber = tmpStr.substr(2, dataSize);
                tmpStr = tmpStr.replace("21" + serialNumber, "");
              }
              key = "yourkeyHere";
              errorMessage = "序列号长度和生成规则位数不一致！";
              value = serialNumber;
            }
            if (value.length != dataSize) {
              break;
            }
            errorMessage = "";
            if (dataFormat != "") {
              value = dateTempString(value, dataFormat);
            }
            UDIFileInfo[0][key] = value;
          }
        } else {
          throw new Error("包装产品标识没有配置生成UDI规则");
        }
        if (errorMessage == "" || errorMessage.length == 0) {
          break;
        }
      }
      if (errorMessage != "" || errorMessage.length > 0) {
        throw new Error(errorMessage);
      }
    }
    if (orderInfo != null && orderInfo != undefined && JSON.stringify(orderInfo) != "{}") {
      let domain = "ustock";
      let serialSql = "";
      if (billType == "yonbip_scm_storeprorecord_list" || billType.indexOf("storeprorecord") > -1) {
        //产品入库单
        serialSql = "st.storeprorecord.StoreProRecordsSN";
      } else if (billType == "yonbip_scm_purinrecord_list" || billType.indexOf("purinrecord") > -1) {
        //采购入库
        serialSql = "st.purinrecord.PurInRecordsSN";
      } else if (billType == "yonbip_scm_salesout_list" || billType.indexOf("salesout") > -1) {
        //销售出库单
        serialSql = "st.salesout.SalesOutsSN";
      }
      if (orderInfo.length > 0) {
        let isQualified = true;
        let errorMsg = "UDI物料信息与单据不一致,无法绑定！";
        for (let i = 0; i < orderInfo.length; i++) {
          let checkSuccess = 0;
          if (orderInfo[i].materialId == UDIFileInfo[0].material) {
            if (UDIFileInfo[0].batchNo != undefined && UDIFileInfo[0].batchNo != null && UDIFileInfo[0].batchNo != "" && orderInfo[i].batchno == UDIFileInfo[0].batchNo) {
              checkSuccess++;
            } else if (orderInfo[i].batchno == undefined || orderInfo[i].batchno == null || orderInfo[i].batchno == "") {
              checkSuccess++;
            } else {
              errorMsg = "UDI批次号信息与单据不一致,无法绑定，UDI批次号：" + UDIFileInfo[0].batchNo;
            }
            if (UDIFileInfo[0].validateDate != undefined && UDIFileInfo[0].validateDate != null && UDIFileInfo[0].validateDate != "" && orderInfo[i].invaliddate == UDIFileInfo[0].validateDate) {
              checkSuccess++;
            } else if ((orderInfo[i].invaliddate = undefined || orderInfo[i].invaliddate == null || orderInfo[i].invaliddate == "")) {
              checkSuccess++;
            } else {
              errorMsg = "UDI有效期至信息与单据不一致,无法绑定，UDI有效期至：" + UDIFileInfo[0].validateDate;
            }
            if (UDIFileInfo[0].produceDate != undefined && UDIFileInfo[0].produceDate != null && UDIFileInfo[0].produceDate != "" && orderInfo[i].producedate == UDIFileInfo[0].produceDate) {
              checkSuccess++;
            } else if (orderInfo[i].producedate == undefined || orderInfo[i].producedate == null || orderInfo[i].producedate == "") {
              checkSuccess++;
            } else {
              errorMsg = "UDI生产日期信息与单据不一致,无法绑定，UDI生产日期：" + UDIFileInfo[0].produceDate;
            }
            if (serialSql != "" && UDIFileInfo[0].serialNumber != undefined && UDIFileInfo[0].serialNumber != null && UDIFileInfo[0].serialNumber != "") {
              let isSerial = false;
              let serialList = ObjectStore.queryByYonQL("select * from " + serialSql + " where detailid.id = '" + orderInfo[i].id + "'", domain);
              if (serialList != null && serialList != undefined && serialList.length > 0) {
                for (let i = 0; i < serialList.length; i++) {
                  if (serialList[i].sn == UDIFileInfo[0].serialNumber) {
                    isSerial = true;
                    break;
                  }
                }
                if (!isSerial) {
                  let rsshow = "";
                  for (let i = 0; i < serialList.length; i++) {
                    rsshow = serialList[i].sn + "," + rsshow;
                  }
                  throw new Error("UDI序列号与单据不一致,无法绑定，单据序列号：" + rsshow);
                }
              }
            }
            if (checkSuccess == 3) {
              UDIFileInfo[0].qty = orderInfo[i].materialNum;
              UDIFileInfo[0].unit = orderInfo[i].unitName;
              UDIFileInfo[0].orderDetailId = orderInfo[i].id;
              isQualified = false;
              break;
            }
          }
        }
        if (isQualified) {
          throw new Error(errorMsg);
        }
      } else {
        if (orderInfo.materialId == UDIFileInfo[0].material) {
          if (UDIFileInfo[0].batchNo != undefined && UDIFileInfo[0].batchNo != null && UDIFileInfo[0].batchNo != "") {
            if (orderInfo.batchno != undefined && orderInfo.batchno != null && orderInfo.batchno != "" && orderInfo.batchno != UDIFileInfo[0].batchNo) {
              throw new Error("UDI批次号信息与单据不一致,无法绑定，UDI批次号：" + UDIFileInfo[0].batchNo);
            }
          }
          if (UDIFileInfo[0].validateDate != undefined && UDIFileInfo[0].validateDate != null && UDIFileInfo[0].validateDate != "") {
            if (orderInfo.invaliddate != undefined && orderInfo.invaliddate != null && orderInfo.invaliddate != "" && orderInfo.invaliddate != UDIFileInfo[0].validateDate) {
              throw new Error("UDI有效期至信息与单据不一致,无法绑定，UDI有效期至：" + UDIFileInfo[0].validateDate);
            }
          }
          if (UDIFileInfo[0].produceDate != undefined && UDIFileInfo[0].produceDate != null && UDIFileInfo[0].produceDate != "") {
            if (orderInfo.producedate != undefined && orderInfo.producedate != null && orderInfo.producedate != "" && orderInfo.producedate != UDIFileInfo[0].produceDate) {
              throw new Error("UDI生产日期信息与单据不一致,无法绑定，UDI生产日期：" + UDIFileInfo[0].produceDate);
            }
          }
        } else {
          throw new Error("UDI物料信息与单据不一致,无法绑定！");
        }
        if (serialSql != "" && UDIFileInfo[0].serialNumber != undefined && UDIFileInfo[0].serialNumber != null && UDIFileInfo[0].serialNumber != "") {
          let isSerial = false;
          let serialList = ObjectStore.queryByYonQL("select * from " + serialSql + " where detailid.id = '" + orderInfo.id + "'", domain);
          if (serialList != null && serialList != undefined && serialList.length > 0) {
            for (let i = 0; i < serialList.length; i++) {
              if (serialList[i].sn == UDIFileInfo[0].serialNumber) {
                isSerial = true;
                break;
              }
            }
            if (!isSerial) {
              let rsshow = "";
              for (let i = 0; i < serialList.length; i++) {
                rsshow = serialList[i].sn + "," + rsshow;
              }
              throw new Error("UDI序列号与单据不一致,无法绑定！单据序列号：" + rsshow);
            }
          }
        }
        UDIFileInfo[0].qty = orderInfo.materialNum;
        UDIFileInfo[0].unit = orderInfo.unitName;
        UDIFileInfo[0].orderDetailId = orderInfo.id;
      }
    }
    UDIFileInfo[0].createTime = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    return { result: UDIFileInfo };
  }
}
exports({ entryPoint: MyAPIHandler });