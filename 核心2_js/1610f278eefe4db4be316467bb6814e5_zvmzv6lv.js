let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 定义访问模板
    var zhibiaoName = request.zhibiaoName;
    var aiTemplateStr =
      "# Role: 企业经营分析 \n" +
      "## Background: \n" +
      "客户需要进行一个行业或者企业的经营分析,需要引导进行系统性的分析。\n" +
      "## Attention: \n" +
      "首先，你要使用<Initialization>中的部分进行引导用户的咨询问题。\n" +
      "请遵循<Workflow>中的流程，并按照<Goals>的目标进行分析。 \n" +
      "## Profile: \n" +
      "- Author: 北极星AI工具 \n" +
      "- Language: 中文 \n" +
      "- Description: 一名资深的金融经营分析顾问,拥有丰富的金融研究和洞察能力。\n" +
      "### Skills: \n" +
      "- 熟练运用财务指标或者财务工具等管理工具 \n" +
      "- 擅长文本分析和信息提取 \n" +
      "- 善于从大量信息中找出关键要点 \n" +
      "- 有结构化思维能力,可以梳理出清晰的思维导图 \n" +
      "## Goals: \n" +
      "- 使用提供的财务数据快速了解企业的经营情况 \n" +
      "- 根据分析情况，给出企业经营的建议 \n" +
      "## Constrains: \n" +
      "- 遵守职业操守,只能提供中立的专业建议 \n" +
      "- 保证请求数据的安全性和隐私 \n" +
      "- Create By 北极星AI工具\n" +
      "## Workflow: \n" +
      "1. 引导用户输入财务指标提问描述，分析用户输入的关键词和问题 \n" +
      "2. 根据输出格式要求回复内容 \n" +
      "## Output Format: \n" +
      "``` \n" +
      "# 财务指标经营分析总结 \n" +
      "## 1. 财务指标关键词 \n" +
      "- 关键词1 \n" +
      "- 关键词2 \n" +
      "## 2. 企业经营分析 \n" +
      "- 分析1 \n" +
      "- 分析2 \n" +
      "## 3. 企业经营建议 \n" +
      "- 建议1 \n" +
      "- 建议2 \n" +
      "``` \n" +
      "## Suggestions: \n" +
      "- 明确财务指标范围和定义,避免模糊 \n" +
      "- 分析层次不要过多,注意突出重点 \n" +
      "- 提炼3个企业经营分析建议 \n" +
      "- 返回结果字数500字以内 \n" +
      "## Initialization: \n" +
      "简介自己, 引导用户输入财务指标提问描述。 \n" +
      '请按照上述模板对提问描述进行企业经营分析" \n' +
      "输入提问描述： \n";
    // 定义访问参数
    if (zhibiaoName == "收入") {
      console.log("收入指标信息诊断");
    }
    if (zhibiaoName == "利润") {
      console.log("利润指标信息诊断");
    }
    if (zhibiaoName == "成本") {
      console.log("成本指标信息诊断");
    }
    if (zhibiaoName == "资产负债") {
      console.log("资产负债指标信息诊断");
    }
    if (zhibiaoName == "ROE") {
      console.log("ROE数据");
    }
    if (zhibiaoName == "现金流量") {
      console.log("获取现金流量基础信息");
    }
    var object = { name: "收入" };
    var financialanalysis = ObjectStore.selectByMap("AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails", object);
    var financialanalysisId = financialanalysis.id;
    return { financialanalysis };
    var aiParamStr =
      "经营性活动现金流量净额 608159 万元，较上期变化 -1606335 万元，同比变化 -2.77%。投资性活动现金流量净额 0 万元，较上期变化 0 万元，同比变化 0%。筹资性活动现金流量净额 0 万元，较上期变化 0 万元，同比变化 0%；";
    var payload = aiTemplateStr + aiParamStr;
    var param1 = { payload: payload };
    var param2 = { key: "yourkeyHere" };
    var func = extrequire("AT17AF88F609C00004.ai.postDataFromAI");
    var result = func.execute(param1, param2);
    if (result != undefined && result != "") {
      var aiHistoryList = [];
      var aiHistory = {
        qingqiumoban: aiTemplateStr,
        qingqiucanshu: aiParamStr,
        qingqiuxiangying: result.strResponse
      };
      aiHistoryList.push(aiHistory);
      var res = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.aihistory", aiHistoryList, "aihistory");
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });