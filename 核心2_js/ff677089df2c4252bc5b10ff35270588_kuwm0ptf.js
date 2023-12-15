let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    //如果存在协同表单id 则不允许 保存
    if (data.xietongbiaodanid != null) {
      throw new Error("该表单内容已提交审批，无需重复提交！");
    }
    let func1 = extrequire("GT20580AT7.backDefaultGroup.getTokenNew");
    let res = func1.execute();
    //提交人
    var yhtuserid = "youridHere";
    var body = {
      formData: [
        //原始单据id
        {
          code: "20210922110337JlJeziBzak",
          columnCode: "ysdjID_1632279842581659",
          value: data.id
        },
        //经营机构
        {
          code: "20210901194846r88Ov8fRN1",
          columnCode: "jyjg_1630498016150853",
          value: data.OperateOrg
        },
        //客户名称
        {
          code: "20210901194850FiJpCE4Zkf",
          columnCode: "khmc_1630498016150510",
          value: data.customerName
        },
        //销售部门
        {
          code: "20210901194847EVvcAtdwYx",
          columnCode: "xsbm_1630498016150648",
          value: data.saleDept
        },
        //匹配产品领域
        {
          code: "20210901194851XaRnRC4bWy",
          columnCode: "ppcply_1630498016150209",
          value: data.belongArea
        },
        //客户销售经理
        {
          code: "20210901194849xLmXTLwiUc",
          columnCode: "khxsjl_1630498016150250",
          value: data.saleManager
        },
        //交付运营经理
        {
          code: "20210901194853vsnCyMzTMM",
          columnCode: "jfyyjl_1630498016150962",
          value: data.deliverManager
        },
        //大区
        {
          code: "20210901200405bF1yYPOkJh",
          columnCode: "dq_1630498016150730",
          value: data.suoshuquyu
        },
        //大区枚举
        {
          code: "202109221010230Yd9hFFwf3",
          columnCode: "dqmj_1632276966403811",
          value: data.suoshuquyu
        },
        //销售员
        {
          code: "20210901200407zRN9R6Hzme",
          columnCode: "xsy_1630498016150953",
          value: data.xiaoshouyuan
        },
        {
          code: "20210901184641TVOobAesh8",
          columnCode: "n1khdgyymsljhjscd_1630494205338595",
          value: data.singleChoiceThree
        },
        {
          code: "20210901184642cOMSmFjBgU",
          columnCode: "n2khdgyyayddqtkhzsywsqyxpqtygxxqdmssfljbjs_1630494205338201",
          value: data.singleChoice
        },
        {
          code: "20210917151532tbnFitJ6sO",
          columnCode: "n3ggsxzSaaSqyyyfwsgzdysynxkdx_1631863321154351",
          value: data.singleChoiceTwo
        },
        {
          code: "20210917151632xdOrq7A6Z2",
          columnCode: "n4ggsqwsxyydrq_1631863321154649",
          value: data.onlineDate
        },
        {
          code: "20210901184651gofrKAlGcv",
          columnCode: "n6khsfljbqrYonSuitektgdbzgnhssjfdSOWgzrwsfw_1630494205338197",
          value: data.singleChoiceFour
        },
        {
          code: "20210901184653J37Pk7YZUV",
          columnCode: "n7khsfljbrtYonSuitegyyssmsfbfqsxxcycjhjfms_1630494205339111",
          value: data.singleChoiceFive
        },
        {
          code: "20210901184655aARu92EUmI",
          columnCode: "n8sqfaPOCbjbk_1630494205339731",
          value: data.singeChoiceSix
        },
        {
          code: "20210917151937CAilYxPJYG",
          columnCode: "n9YonSuitebzcpwfppgbywxqsnqwdsxfsynxkdx_1631863321155704",
          value: data.daqu
        },
        //客户行业
        {
          code: "20210917160453p2kI6aQII6",
          columnCode: "khxy_1631865981385415",
          value: data.customerBusiness
        },
        //客户年产值（万元）
        {
          code: "20210914145715jBivKXwQxZ",
          columnCode: "khnczwy_1631602668168582",
          value: data.customerYearValue
        },
        //客户组织数量（个）：
        {
          code: "20210901185744meWzCE5dUT",
          columnCode: "sz_1630494205340292",
          value: data.customerOrgNum
        },
        //客户员工数量（人）：
        {
          code: "20210901185747Nd26Ee8cZu",
          columnCode: "sz_1630494205340584",
          value: data.customerStaffNum
        },
        //调研评估参与人（签字）：
        {
          code: "20210917152125KsKHBv7EMc",
          columnCode: "dypgcyrqz_1631863321155428",
          value: data.diaoyanpinggucanyurenqianzi
        },
        //调研评估时间：
        {
          code: "20210901194248bDzR63QhnZ",
          columnCode: "pgsj_1630498016153267",
          value: data.diaoyanpinggushijian
        },
        //第二版
        //其他1
        {
          code: "20210928133700VJAxT9vQ2q",
          columnCode: "qt_1632808106540413",
          value: data.qita1
        },
        //其他2
        {
          code: "202109281337209Iu6yQXdY3",
          columnCode: "qt_1632808106540518",
          value: data.qita2
        },
        //其他3
        {
          code: "20210928133755O8tAeUiBuC",
          columnCode: "qt_1632808106540941",
          value: data.qita3
        },
        //其他4
        {
          code: "20210928134015hziHMY4ZFB",
          columnCode: "qt_1632808106541764",
          value: data.qita4
        },
        //其他5
        {
          code: "20210928134248uxTl8SGTTc",
          columnCode: "qt_1632808106542856",
          value: data.qita5
        },
        //需求1
        {
          code: "20210928133851c1axAQMaWQ",
          columnCode: "xq1_163280810654116",
          value: data.xuqiu1
        },
        //需求2
        {
          code: "20210928133932ReJFN8xKsg",
          columnCode: "xq2_163280810654144",
          value: data.xuqiu2
        },
        //需求3
        {
          code: "20210928133934Jqpi5qtCXZ",
          columnCode: "xq3_1632808106541104",
          value: data.xuqiu3
        },
        //需求4
        {
          code: "20210928133935wT3sbt9n1L",
          columnCode: "xq4_1632808106541127",
          value: data.xuqiu4
        },
        //需求5
        {
          code: "20210928133939La8yKPJMdf",
          columnCode: "xq5_1632808106541902",
          value: data.xuqiu5
        },
        //意见1
        {
          code: "20210928134551TzWq8gQEeQ",
          columnCode: "yj1_1632808106543576",
          value: data.yijian1
        },
        //意见2
        {
          code: "20210928134553cwEdbpwRCH",
          columnCode: "yj2_1632808106543494",
          value: data.yijian2
        },
        //意见3
        {
          code: "20210928134554O2d0dGFdhw",
          columnCode: "yj3_1632808106543390",
          value: data.ziduan45
        },
        //系统名称版本
        {
          code: "202109281341127wo3xtUfL8",
          columnCode: "xtmcbb_1632808106541743",
          value: data.xitongmingchenbanben
        },
        //集成业务内容
        {
          code: "202109281341146ec4h3VuXS",
          columnCode: "jcywnr_1632808106541779",
          value: data.jichengyewunarong
        },
        //会计制度
        {
          code: "202109281342349rYAMVww7D",
          columnCode: "yj3_1632808106543390",
          value: data.huijizhidu
        }
      ],
      //协同表单号
      pkBo: "697389e15f474cde8e5d884f000d40b8"
    };
    var strResponse = postman(
      "post",
      "https://www.example.com/" + yhtuserid + "?access_token=" + res.access_token,
      null,
      JSON.stringify(body)
    );
    //成功调用接口
    var jsonResponse = JSON.parse(strResponse);
    if (jsonResponse.code == "200") {
      let data = jsonResponse.data;
      if (data.success || data.success == "true") {
        let xietongbiaodanid = data.data.id;
        param.data[0].set("xietongbiaodanid", xietongbiaodanid);
      } else {
        throw new Error(data.msg);
      }
    } else {
      throw new Error(jsonResponse);
    }
    return { data: jsonResponse };
  }
}
exports({ entryPoint: MyTrigger });