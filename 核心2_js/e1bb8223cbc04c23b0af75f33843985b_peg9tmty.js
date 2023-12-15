let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 取出库单所有数据
    var allData = request.params.allData;
    // 取委托方编码
    var clientCode = request.params.clientCode;
    // 取购货者编码
    var buyerCode = request.params.buyerCode;
    // 根据委托方编码查询委托方
    var clientSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where clientCode= '" + clientCode + "'";
    var clientResult = ObjectStore.queryByYonQL(clientSql, "developplatform");
    // 根据购货者编码查询购货者信息
    var buyerSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers where BuyersCode='" + buyerCode + "'";
    var buyerResult = ObjectStore.queryByYonQL(buyerSql, "developplatform");
    if (clientResult.length > 0) {
      // 说明委托方编码存在于委托方信息中, 获取委托方的启用状态
      var enable = clientResult[0].enable;
      if (enable == 1) {
        // 说明委托方是启用状态,获取委托方的许可证
        var expiryDate = clientResult[0].expiryDate;
        var nowDate = getNowFormatDate();
        // 对比许可证时间与当前时间做对比
        var date1 = new Date(expiryDate);
        var date2 = new Date(nowDate);
        if (date1 > date2) {
          // 获取委托方主表的id
          var masterId = clientResult[0].id;
          // 根据委托方主表id去查询委托合同
          var clientInfoSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.entrustmentContract where ClientInformation_id= '" + masterId + "'";
          var clientInfoRes = ObjectStore.queryByYonQL(clientInfoSql, "developplatform");
          // 委托方子表委托合同有效期(停止委托时间)
          var endDate = clientInfoRes[0].endDate;
          // 当前时间与停止委托时间对比
          var clientInfoDate = new Date(endDate);
          if (clientInfoDate > date2) {
          } else {
            throw new Error("委托方合同未在有效期内!");
          }
        } else {
          throw new Error("委托方经营许可证未在有效期内!");
        }
      } else {
        throw new Error("委托方未启用!");
      }
    } else {
      throw new Error("委托方未存在基本档案中!");
    }
    if (buyerResult.length > 0) {
      // 获取购货者的启用状态
      var enable = buyerResult[0].enable;
      if (enable == 1) {
        // 购货者属于启用状态, 获取许可证日期
        var LicenseValidity = buyerResult[0].LicenseValidity;
        var nowDate = new Date();
        var licenseDate = new Date(LicenseValidity);
        var dateNow = new Date(nowDate);
        if (licenseDate > dateNow) {
        } else {
          throw new Error("购货者经营许可证未在有效期内!");
        }
      } else {
        // 购货者未启用
        throw new Error("购货者未启用!");
      }
    } else {
      throw new Error("购货者未存在基本档案中!");
    }
    // 获取出库单子表的所有数据
    var childDataArr = allData.IssueDetailsList;
    // 遍历出库单子表
    let arr = new Array();
    for (var i = 0; i < childDataArr.length; i++) {
      var childDetail = childDataArr[i];
      // 获取每一条子表的确认状态
      var status = childDetail.ConfirmStatus;
      // 获取每一条的产品编码
      var Pcode = childDetail.productCode;
      // 判断确认状态
      if (status == 1) {
        // 已确认
        // 校验出库订单中产品的合法性
        // 获取出库订单中每一条子表的产品编码
        var productCode = childDetail.productName;
        // 根据产品编码查询产品信息
        var productSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where id = '" + productCode + "'";
        var productResult = ObjectStore.queryByYonQL(productSql, "developplatform");
        if (productResult.length > 0) {
          // 取主表的whether_medical_equipment是否医疗器械
          var isNo = productResult[0].whether_medical_equipment;
          if (isNo == 0) {
            // 不是医疗器械，不做校验
            // 不是医疗器械的产品名称
            arr.push(Pcode);
            continue;
          } else {
            // 获取产品信息的启用状态
            var enable = productResult[0].enable;
            if (enable == 1) {
              // 获取产品信息的主表id
              var ids = productResult[0].id;
              // 查询产品信息子表
              var proSonSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica where productInformation_id= '" + ids + "'";
              var proSonResult = ObjectStore.queryByYonQL(proSonSql, "developplatform");
              // 遍历产品信息子表
              for (var b = 0; b < proSonResult.length; b++) {
                // 每一条产品信息子表数据
                var proSonDetail = proSonResult[b];
                // 获取是否时国外生产企业
                var type_of_enterprise = proSonDetail.type_of_enterprise;
                // 生产企业名称
                var enterpriseName = proSonDetail.production_enterprise_name;
                if (type_of_enterprise == 0) {
                  // 国内生产企业
                  // 获取出库单子表的生产日期
                  var productionDate = childDetail.productionDate;
                  // 判断生产日期是否为空
                  if (productionDate) {
                    // 判断产品注册证有效期
                    var registrationDate = proSonDetail.product_certificate_date;
                    // 对比产品生产日期和产品的注册证有效期
                    var proDate = new Date(productionDate);
                    var registrDate = new Date(registrationDate);
                    var format = formatDate(registrDate);
                    var proFormat = formatDate(proDate);
                    if (proFormat == format) {
                      // 取产品信息的生产企业编码查询生产企业信息
                      var productionCode = productResult[0].production_enterprise_code;
                      var productionSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production where id = '" + productionCode + "'";
                      var productionResult = ObjectStore.queryByYonQL(productionSql, "developplatform");
                      // 判断生产企业的启用状态，
                      var productionEnable = productionResult[0].enable;
                      if (productionEnable == 1) {
                        //启用,获取生产企业的生产许可证有效期
                        var production_validity = productionResult[0].production_validity;
                        var valid = new Date(production_validity);
                        // 判断产品的生产日期是否在生产许可证有效期内
                        if (proDate < valid) {
                        } else {
                          throw new Error("生产许可证未在有效期内！");
                        }
                      } else {
                        throw new Error("生产企业信息未启用！");
                      }
                    } else {
                      throw new Error("产品注册证有效期与生产日期不匹配");
                    }
                  } else {
                    throw new Error("产品编码：'" + Pcode + "':生产日期为空！");
                  }
                } else {
                  // 国外生产企业，不需要校验
                  throw new Error("产品编码：'" + proSonDetail.product_code + "'生产企业名称:'" + enterpriseName + "'为国外生产企业，不做校验");
                  continue;
                }
              }
            } else {
              throw new Error("产品未启用！");
            }
          }
        } else {
          throw new Error("产品编码：'" + Pcode + "':查询产品信息为空");
        }
      } else {
        // 未确认
        throw new Error("出库明细中有未确认的数据");
      }
    }
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
    function formatDate(d) {
      var date = new Date(d);
      var YY = date.getFullYear() + "-";
      var MM = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
      var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return YY + MM + DD;
    }
    return { arr };
  }
}
exports({ entryPoint: MyAPIHandler });