let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      let industryLevel1 = context.industryLevel1;
      let industryLevel2 = context.industryLevel2;
      let industryLevel3 = context.industryLevel3;
      let industryLevel4 = context.industryLevel4;
      let enterpriseSize = context.enterpriseSize;
      // 对行业的五个参数进行判断，必须保证按照顺序的参数都有值，才会把下一级的行业返回
      var sqlIndustry = "select distinct industryLevel1 from 	AT17AF88F609C00004.AT17AF88F609C00004.enterprisePerformance ";
      var sqlIndustryResult = "";
      if (industryLevel1 == "" && industryLevel2 == "" && industryLevel3 == "" && industryLevel4 == "" && enterpriseSize == "") {
        sqlIndustry = "select distinct industryLevel1 from 	AT17AF88F609C00004.AT17AF88F609C00004.enterprisePerformance ";
      } else if (industryLevel1 != "" && industryLevel2 == "" && industryLevel3 == "" && industryLevel4 == "" && enterpriseSize == "") {
        sqlIndustry = "select distinct industryLevel2 from 	AT17AF88F609C00004.AT17AF88F609C00004.enterprisePerformance " + "where industryLevel1='" + industryLevel1 + "'";
      } else if (industryLevel1 != "" && industryLevel2 != "" && industryLevel3 == "" && industryLevel4 == "" && enterpriseSize == "") {
        sqlIndustry =
          "select distinct industryLevel3 from 	AT17AF88F609C00004.AT17AF88F609C00004.enterprisePerformance " +
          "where industryLevel1='" +
          industryLevel1 +
          "'" +
          "and industryLevel2='" +
          industryLevel2 +
          "'";
      } else if (industryLevel1 != "" && industryLevel2 != "" && industryLevel3 != "" && industryLevel4 == "" && enterpriseSize == "") {
        sqlIndustry =
          "select distinct industryLevel4 from 	AT17AF88F609C00004.AT17AF88F609C00004.enterprisePerformance " +
          "where industryLevel1='" +
          industryLevel1 +
          "'" +
          "and industryLevel2='" +
          industryLevel2 +
          "'" +
          "and industryLevel3='" +
          industryLevel3 +
          "'";
      } else if (industryLevel1 != "" && industryLevel2 != "" && industryLevel3 != "" && industryLevel4 != "" && enterpriseSize == "") {
        sqlIndustry =
          "select distinct enterpriseSize from 	AT17AF88F609C00004.AT17AF88F609C00004.enterprisePerformance " +
          "where industryLevel1='" +
          industryLevel1 +
          "'" +
          "and industryLevel2='" +
          industryLevel2 +
          "'";
        "and industryLevel3='" + industryLevel3 + "'" + "and industryLevel4='" + industryLevel4 + "'";
      } else {
        sqlIndustryResult = "错误的筛选，请按照顺序填写每一级的行业";
        return { sqlIndustryResult };
      }
      sqlIndustryResult = ObjectStore.queryByYonQL(sqlIndustry);
      return { sqlIndustryResult };
    } catch (e) {
      throw new Error("执行脚本getIndustryInfo报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });