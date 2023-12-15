let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 定义返回样式
    var result = "";
    var p = "<p></p>";
    var h1 =
      '<p style="text-align:center;color:red" size="0" _root="youridHere" __ownerid="youridHere" __hash="youridHere" __altered="false"><strong><span style="font-size:25px">财务指标经营分析总结</span></strong></p>';
    var h2 = "<h2 style='\"text-align:start;text-indent:2em;\"'>一. 财务指标关键词</h2>";
    var h3 = "<h2 style='\"text-align:start;text-indent:2em;\"'>二. 企业经营分析</h2>";
    var h4 = "<h2 style='\"text-align:start;text-indent:2em;\"'>三. 企业经营建议</h2>";
    var str = request.respStr;
    if (str.substring(str.indexOf("财务指标关键词")) != -1 && str.indexOf("企业经营分析") != -1 && str.indexOf("企业经营建议") != -1) {
      var keywordStr = str.substring(str.indexOf("财务指标关键词") + 7, str.indexOf("## 2. 企业经营分析"));
      var keywordList = keywordStr.split("\n");
      var keywordResult = "";
      keywordList.forEach((key) => {
        keywordResult = keywordResult + "<pre><code>" + key + "</code></pre>";
      });
      var analyseStr = str.substring(str.indexOf("企业经营分析") + 6, str.indexOf("## 3. 企业经营建议"));
      var analyseList = analyseStr.split("\n");
      var analyseResult = "";
      analyseList.forEach((analyse) => {
        analyseResult = analyseResult + "<pre><code>" + analyse + "</code></pre>";
      });
      var advanceStr = str.substring(str.indexOf("企业经营建议") + 6);
      var advanceList = advanceStr.split("\n");
      var advanceResult = "";
      advanceList.forEach((advance) => {
        advanceResult = advanceResult + "<pre><code>" + advance + "</code></pre>";
      });
      result = h1 + p + h2 + keywordResult + p + h3 + analyseResult + p + h4 + advanceResult;
    } else {
      result = "网络出小差了，请重新获取";
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });