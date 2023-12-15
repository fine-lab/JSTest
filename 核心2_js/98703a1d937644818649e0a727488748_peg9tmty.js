let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 出库单子表的id
    var outBoundSonId = request.sonId;
    var outBoundSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDetails where id = '" + outBoundSonId + "'";
    var outBoundRes = ObjectStore.queryByYonQL(outBoundSql, "developplatform");
    if (outBoundRes.length > 0) {
      // 因为子表Id唯一，所以只会查出一条
      // 获取产品编码
      var productCode = outBoundRes[0].productName;
      // 根据产品编码查询产品信息
      var productSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where id = '" + productCode + "'";
      var productResult = ObjectStore.queryByYonQL(productSql, "developplatform");
      // 获取产品信息的启用状态
      var enable = productResult[0].enable;
      if (enable == 1) {
        // 产品未启用状态
        // 获取产品信息的主表id
        var ids = productResult[0].id;
        // 查询产品信息子表
        var proSonSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica where productInformation_id= '" + ids + "'";
        var proSonResult = ObjectStore.queryByYonQL(proSonSql, "developplatform");
        // 循环产品信息子表，【产品注册证】
        let arr = new Array();
        for (var i = 0; i < proSonResult.length; i++) {
          // 每一条产品注册证数据
          var proSonDetail = proSonResult[i];
          // 获取是否时国外生产企业
          var type_of_enterprise = proSonDetail.type_of_enterprise;
          // 生产企业名称
          var enterpriseName = proSonDetail.production_enterprise_name;
          if (type_of_enterprise == 0) {
            // 国内生产企业
            // 获取出库单子表的生产日期
            var productionDate = outBoundRes[0].productionDate;
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
                // 如果当前日期等于产品注册证有效期
                arr.push(proSonDetail);
              } else {
                continue;
              }
            } else {
              throw new Error("产品编码：'" + proSonDetail.product_code + "':生产日期为空！");
            }
            // 判断arr长度
            if (arr.length > 0) {
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
        }
        // 判断arr长度
      } else {
        throw new Error("产品未启用!");
      }
    } else {
      throw new Error("根据子表Id查询出库单子表失败，请检查");
    }
    function formatDate(d) {
      var date = new Date(d);
      var YY = date.getFullYear() + "-";
      var MM = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
      var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return YY + MM + DD;
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });