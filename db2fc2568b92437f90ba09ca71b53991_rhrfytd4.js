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
        "select *,productSku.code productSkuCode,productSku.skuFreeCharacter skuFreeCharacter,material.productDetail.isBatchManage isBatchManage,material.productDetail.isSerialNoManage isSerialNoManage,material.productDetail.isExpiryDateManage isExpiryDateManage from I0P_UDI.I0P_UDI.UDIFilev3 where UDI ='" +
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
          "')   order by serialNum asc";
        let udiCreateConfig = ObjectStore.queryByYonQL(querySql);
        if (udiCreateConfig != null && udiCreateConfig.length > 0) {
          //查询最小产品标识
          let productLogo = ObjectStore.queryByYonQL(
            "select *,sy01_udi_product_info_id.product product,sy01_udi_product_info_id.productSku productSku,sy01_udi_product_info_id.productSku.skuFreeCharacter skuFreeCharacter,sy01_udi_product_info_id.productCode materialCode,sy01_udi_product_info_id.productSkuCode productSkuCode,sy01_udi_product_info_id.productSpecifications productSpecifications,sy01_udi_product_info_id.productName materialName from  I0P_UDI.I0P_UDI.sy01_udi_product_configurev3    where cpbzjb like '最小' and sy01_udi_product_info_id = '" +
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
          UDIFileInfo[0].productSku = productLogo[0].productSku;
          UDIFileInfo[0].productSkuCode = productLogo[0].productSkuCode;
          UDIFileInfo[0].materialCode = productLogo[0].materialCode;
          UDIFileInfo[0].spec = productLogo[0].productSpecifications;
          UDIFileInfo[0].materialName = productLogo[0].materialName;
          UDIFileInfo[0].skuFreeCharacter = productLogo[0].skuFreeCharacter;
          UDIFileInfo[0].createTime = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
          let newCode = "";
          if (piCode.length > 0) {
            UDIFileInfo[0].DI = "01" + productPackingLogo;
            UDIFileInfo[0].PI = piCode;
            newCode = "01" + productPackingLogo;
          } else {
            newCode = "(01)" + productPackingLogo;
          }
          let tmpStr = UDIFileInfo[0].PI;
          for (let j = 0; j < udiCreateConfig.length; j++) {
            //判断日期批号位数是否相同
            let dataSize = udiCreateConfig[j].dataSize;
            let value = "";
            let key = "";
            let dataFormat = "";
            let identificationCodingNum = udiCreateConfig[j].identificationCodingNum;
            //标识符没有括号
            if (piCode.length > 0) {
              identificationCodingNum = udiCreateConfig[j].identificationCodingNum.replace(/\(|\)/g, "");
            }
            if (udiCreateConfig[j].identificationCodingNum == "(01)" || udiCreateConfig[j].identificationCodingNum.indexOf("01") > -1) {
              value = productPackingLogo;
              continue;
            } else {
              //其他标识符
              value = tmpStr.substr(identificationCodingNum.length, dataSize);
              tmpStr = tmpStr.replace(identificationCodingNum + value, "");
              newCode += identificationCodingNum + value;
              if (udiCreateConfig[j].identificationCodingNum == "(10)" || udiCreateConfig[j].identificationCodingNum.indexOf("10") > -1) {
                key = "yourkeyHere";
              } else if (udiCreateConfig[j].identificationCodingNum == "(11)" || udiCreateConfig[j].identificationCodingNum.indexOf("11") > -1) {
                key = "yourkeyHere";
                dataFormat = udiCreateConfig[j].dataFormat;
              } else if (udiCreateConfig[j].identificationCodingNum == "(17)" || udiCreateConfig[j].identificationCodingNum.indexOf("17") > -1) {
                key = "yourkeyHere";
                dataFormat = udiCreateConfig[j].dataFormat;
              } else if (udiCreateConfig[j].identificationCodingNum == "(21)" || udiCreateConfig[j].identificationCodingNum.indexOf("21") > -1) {
                key = "yourkeyHere";
              }
            }
            if (value.length != dataSize) {
              break;
            }
            if (dataFormat != "") {
              value = dateTempString(value, dataFormat);
            }
            UDIFileInfo[0][key] = value;
          }
          if (newCode != udi) {
            errorMessage = "UDI码不符合产品标识的生成规则配置方案！";
            continue;
          }
          errorMessage = "";
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
      let detailIdKey = "yourKeyHere";
      if (billType == "yonbip_scm_storeprorecord_list" || billType.indexOf("storeprorecord") > -1) {
        //产品入库单
        serialSql = "st.storeprorecord.StoreProRecordsSN";
      } else if (billType == "yonbip_scm_purinrecord_list" || billType.indexOf("purinrecord") > -1) {
        //采购入库
        serialSql = "st.purinrecord.PurInRecordsSN";
      } else if (billType == "yonbip_scm_salesout_list" || billType.indexOf("salesout") > -1) {
        //销售出库单
        serialSql = "st.salesout.SalesOutsSN";
      } else if (billType == "finishedReport" || billType.indexOf("finishedReport") > -1) {
        //完工报告
        serialSql = "po.finishedreport.FinishedReportSn";
        yourKeyHereKey = "yourKeyHere";
        domain = "productionorder";
      }
      if (orderInfo.length > 0) {
        let isQualified = true;
        let errorMsg = "UDI物料信息与单据不一致,无法绑定！";
        for (let i = 0; i < orderInfo.length; i++) {
          let checkSuccess = 0;
          if (orderInfo[i].materialId == UDIFileInfo[0].material) {
            //产品标识对应物料+sku的情况
            if (typeof UDIFileInfo[0].productSku != "undefined") {
              //完工报告匹配特征
              if (billType == "finishedReport" || billType.indexOf("finishedReport") > -1) {
                //查询物料模板
                let queryTemplateInfo = "select productTemplate.id id,productTemplate.name name from pc.product.Product where id = '" + orderInfo[i].materialId + "'";
                let templates = ObjectStore.queryByYonQL(queryTemplateInfo, "productcenter");
                //查询特征编码
                let yonql = "select characterCode from pc.tpl.ProductTplCharacter where template = '" + templates[0].id + "'";
                let controlRes = ObjectStore.queryByYonQL(yonql, "productcenter");
                let isFeatures = true;
                for (let i = 0; i < controlRes.length; i++) {
                  let characterCode = controlRes[i].characterCode;
                  //如果完工报告和配置方案的sku都有特征则匹配两个特征的编码值是否相等
                  if (UDIFileInfo[0].skuFreeCharacter != undefined && orderInfo[i].features != undefined && UDIFileInfo[0].skuFreeCharacter[characterCode] != orderInfo[i].features[characterCode]) {
                    isFeatures = false;
                    break;
                  }
                  // 如果完工报告有特征 选择的sku没有特征则不匹配 或者 如果完工报告没有特征 选择的sku有特征则还是不匹配
                  else if ((orderInfo[i].features != undefined && UDIFileInfo[0].skuFreeCharacter == undefined) || orderInfo[i].features == undefined) {
                    isFeatures = false;
                    break;
                  }
                }
                //特征不匹配跳过
                if (!isFeatures) {
                  continue;
                }
              } else {
                if (UDIFileInfo[0].productSku != orderInfo[i].productSku) {
                  continue;
                }
              }
            }
            if (UDIFileInfo[0].batchNo == undefined || JSON.stringify(UDIFileInfo[0].batchNo) == "{}" || UDIFileInfo[0].batchNo == "" || orderInfo[i].batchno == UDIFileInfo[0].batchNo) {
              checkSuccess++;
            } else if (orderInfo[i].batchno == undefined || JSON.stringify(orderInfo[i].batchno) == "{}" || orderInfo[i].batchno == "") {
              checkSuccess++;
            } else {
              errorMsg = "UDI批次号信息与单据不一致,无法绑定，UDI批次号：" + UDIFileInfo[0].batchNo;
              continue;
            }
            if (
              UDIFileInfo[0].validateDate == undefined ||
              (JSON.stringify(UDIFileInfo[0].validateDate) == "{}" && UDIFileInfo[0].validateDate == "") ||
              orderInfo[i].invaliddate == UDIFileInfo[0].validateDate
            ) {
              checkSuccess++;
            } else if ((orderInfo[i].invaliddate = undefined || JSON.stringify(orderInfo[i].invaliddate) == "{}" || orderInfo[i].invaliddate == "")) {
              checkSuccess++;
            } else {
              errorMsg = "UDI有效期至信息与单据不一致,无法绑定，UDI有效期至：" + UDIFileInfo[0].validateDate;
              continue;
            }
            if (
              UDIFileInfo[0].produceDate == undefined ||
              JSON.stringify(UDIFileInfo[0].produceDate) == "{}" ||
              UDIFileInfo[0].produceDate == "" ||
              orderInfo[i].producedate == UDIFileInfo[0].produceDate
            ) {
              checkSuccess++;
            } else if (orderInfo[i].producedate == undefined || JSON.stringify(orderInfo[i].producedate) == "{}" || orderInfo[i].producedate == "") {
              checkSuccess++;
            } else {
              errorMsg = "UDI生产日期信息与单据不一致,无法绑定，UDI生产日期：" + UDIFileInfo[0].produceDate + ",单据生产日期：" + orderInfo[i].producedate;
              continue;
            }
            if (checkSuccess == 3) {
              UDIFileInfo[0].qty = orderInfo[i].materialNum;
              UDIFileInfo[0].sourceautoid = orderInfo[i].sourceautoid;
              UDIFileInfo[0].unit = orderInfo[i].unitName;
              UDIFileInfo[0].orderDetailId = orderInfo[i].id;
              if (serialSql != "" && UDIFileInfo[0].serialNumber != undefined && UDIFileInfo[0].serialNumber != null && UDIFileInfo[0].serialNumber != "") {
                let isSerial = false;
                let serialList = ObjectStore.queryByYonQL("select * from " + serialSql + " where " + detailIdKey + " = '" + orderInfo[i].id + "'", domain);
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
          //产品标识对应物料+sku的情况
          if (typeof UDIFileInfo[0].productSku != "undefined") {
            //完工报告匹配特征
            if (billType == "finishedReport" || billType.indexOf("finishedReport") > -1) {
              //查询物料模板
              let queryTemplateInfo = "select productTemplate.id id,productTemplate.name name from pc.product.Product where id = '" + orderInfo.materialId + "'";
              let templates = ObjectStore.queryByYonQL(queryTemplateInfo, "productcenter");
              //查询特征编码
              let yonql = "select characterCode from pc.tpl.ProductTplCharacter where template = '" + templates[0].id + "'";
              let controlRes = ObjectStore.queryByYonQL(yonql, "productcenter");
              for (let i = 0; i < controlRes.length; i++) {
                let characterCode = controlRes[i].characterCode;
                //如果完工报告和配置方案的sku都有特征则匹配两个特征的编码值是否相等
                if (UDIFileInfo[0].skuFreeCharacter != undefined && orderInfo.features != undefined && UDIFileInfo[0].skuFreeCharacter[characterCode] != orderInfo.features[characterCode]) {
                  throw new Error("UDI对应物料和sku和单据特征不匹配");
                }
                // 如果完工报告有特征 选择的sku没有特征则不匹配 或者 如果完工报告没有特征 选择的sku有特征则还是不匹配
                else if ((orderInfo.features != undefined && UDIFileInfo[0].skuFreeCharacter == undefined) || orderInfo.features == undefined) {
                  throw new Error("UDI对应物料和sku和单据特征不匹配");
                }
              }
            } else {
              if (UDIFileInfo[0].productSku != orderInfo.productSku) {
                throw new Error("UDI对应物料和sku和单据不匹配");
              }
            }
          }
          if (UDIFileInfo[0].batchNo != undefined && JSON.stringify(UDIFileInfo[0].batchNo) != "{}" && UDIFileInfo[0].batchNo != "") {
            if (orderInfo.batchno != undefined && JSON.stringify(orderInfo.batchno) != "{}" && orderInfo.batchno != "" && orderInfo.batchno != UDIFileInfo[0].batchNo) {
              throw new Error("UDI批次号信息与单据不一致,无法绑定，UDI批次号：" + UDIFileInfo[0].batchNo);
            }
          }
          if (UDIFileInfo[0].validateDate != undefined && JSON.stringify(UDIFileInfo[0].validateDate) != "{}" && UDIFileInfo[0].validateDate != "") {
            if (orderInfo.invaliddate != undefined && JSON.stringify(orderInfo.invaliddate) != "{}" && orderInfo.invaliddate != "" && orderInfo.invaliddate != UDIFileInfo[0].validateDate) {
              throw new Error("UDI有效期至信息与单据不一致,无法绑定，UDI有效期至：" + UDIFileInfo[0].validateDate);
            }
          }
          if (UDIFileInfo[0].produceDate != undefined && JSON.stringify(UDIFileInfo[0].produceDate) != "{}" && UDIFileInfo[0].produceDate != "") {
            if (orderInfo.producedate != undefined && JSON.stringify(orderInfo.producedate) != "{}" && orderInfo.producedate != "" && orderInfo.producedate != UDIFileInfo[0].produceDate) {
              throw new Error("UDI生产日期信息与单据不一致,无法绑定，UDI生产日期：" + UDIFileInfo[0].produceDate);
            }
          }
        } else {
          throw new Error("UDI物料信息与单据不一致,无法绑定！");
        }
        if (serialSql != "" && UDIFileInfo[0].serialNumber != undefined && UDIFileInfo[0].serialNumber != null && UDIFileInfo[0].serialNumber != "") {
          let isSerial = false;
          let serialList = ObjectStore.queryByYonQL("select * from " + serialSql + " where " + detailIdKey + " = '" + orderInfo.id + "'", domain);
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
        UDIFileInfo[0].sourceautoid = orderInfo.sourceautoid;
        UDIFileInfo[0].unit = orderInfo.unitName;
        UDIFileInfo[0].orderDetailId = orderInfo.id;
      }
    }
    UDIFileInfo[0].createTime = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    return { result: UDIFileInfo };
  }
}
exports({ entryPoint: MyAPIHandler });