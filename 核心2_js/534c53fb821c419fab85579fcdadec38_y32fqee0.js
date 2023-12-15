let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取主表Id
    var id = request.masterId;
    // 出库单主表数据
    var masterSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo where id = '" + id + "'";
    var masterResult = ObjectStore.queryByYonQL(masterSql);
    // 获取出库单号
    var outboundCode = masterResult[0].DeliveryorderNo;
    // 出库单子表数据
    var sonSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDetails where IssueDocInfo_id = '" + id + "'";
    var childDataArr = ObjectStore.queryByYonQL(sonSql);
    // 从出库单主表数据获取委托方编码(主键)，购货者编码(主键)
    let arr = new Array();
    // 循环选中的出库单主表数据
    if (masterResult.length > 0) {
      if (masterResult[0].hasOwnProperty("ClientCode")) {
        // 出库单主表的委托方编码
        var clientCode = masterResult[0].ClientCode;
        // 出库单主表的购货者编码
        var buyerCode = masterResult[0].BuyerCode;
        // 出库单主表的购货者名称
        var buyerName = masterResult[0].BuyerName;
        // 根据委托方编码查询委托方信息
        // 对购货者返回信息进行判断
        // 对出库单的子表集合进行判断
        for (var j = 0; j < childDataArr.length; j++) {
          var childDetail = childDataArr[j];
          // 产品名称
          var Pcode = childDetail.productCode;
          // 注册证号
          var productRegisterNo = childDetail.productRegisterNo;
          // 产品id
          var productName = childDetail.productName;
          // 获取备注信息
          var remarks = childDetail.remarks;
          if (!remarks == undefined || !remarks == null || !remarks === "") {
            throw new Error("出库单号：" + outboundCode + " 详情数据中有未匹配到入库单信息的数据");
          }
          var res = includes(remarks, "入库");
          if (res) {
            throw new Error("出库单号：" + outboundCode + " 详情数据中有未匹配到入库单信息的数据");
          }
          // 获取质量状态
          var stas = childDetail.zhiliangzhuangkuang;
          var flag = includes(stas, "不可销售");
          if (flag) {
            throw new Error("出库单号：" + outboundCode + " 详情数据中有不可销售的数据");
          }
          // 校验出库订单中产品的合法性
          // 获取出库订单中每一条子表的产品id
          var productCode = childDetail.productName;
          // 根据产品id查询产品信息
          var productSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where id = '" + productCode + "'";
          var productResult = ObjectStore.queryByYonQL(productSql, "developplatform");
          if (productResult.length > 0) {
            // 取主表的whether_medical_equipment是否医疗器械
            // 不是医疗器械，不做校验
            // 获取产品信息的启用状态
            var enable = productResult[0].enable;
            if (enable == 1) {
              // 获取产品信息的主表id
              // 根据产品id，产品名称，注册证号查询产品注册证信息;
              var sql =
                "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica where productInformation_id = '" +
                productName +
                "' and product_name = '" +
                Pcode +
                "' and product_umber = '" +
                productRegisterNo +
                "'";
              var proSonResult = ObjectStore.queryByYonQL(sql, "developplatform");
              let productArr = new Array();
              // 遍历产品信息子表【产品注册证】
              // 每一条产品信息子表数据
              var proSonDetail = proSonResult[0];
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
                  // 获取产品注册证的批准日期
                  var product_date = proSonDetail.product_date;
                  // 对比产品生产日期和产品的注册证有效期
                  var proDate = new Date(productionDate);
                  // 注册证有效期
                  var registrDate = new Date(registrationDate);
                  // 批准日期
                  var productDate = new Date(product_date);
                  var format = formatDate(registrDate);
                  var proFormat = formatDate(proDate);
                  var productDateFormat = formatDate(productDate);
                  if (proFormat < format && proFormat > productDateFormat) {
                    // 如果当前日期等于产品注册证有效期
                    productArr.push(proSonDetail);
                  } else {
                  }
                } else {
                  throw new Error("出库单号:'" + outboundCode + "'生产日期为空！");
                }
                // 判断productArr长度
                if (productArr.length > 0) {
                  // 产品注册证有效期与生产日期有匹配成功
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
                    if (proDate < valid) {
                    } else {
                      throw new Error("生产许可证未在有效期内！");
                    }
                  } else {
                    throw new Error("生产企业信息未启用！");
                  }
                } else {
                  throw new Error("产品生产日期与产品所有的注册证有效期都不匹配!");
                }
              } else {
                // 国外生产企业，不需要校验
              }
              // 判断productArr长度
            } else {
              throw new Error("出库单号:'" + outboundCode + "'产品未启用！");
            }
          } else {
            throw new Error("出库单号:'" + outboundCode + "'查询产品信息为空");
          }
        }
      } else {
        throw new Error("出库单号:'" + outboundCode + "'委托方不存在" + JSON.stringify(i));
      }
    } else {
      throw new Error("出库单号:'" + outboundCode + "'未查询到当前出库单的数据，查看是否已经删除" + JSON.stringify(id));
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