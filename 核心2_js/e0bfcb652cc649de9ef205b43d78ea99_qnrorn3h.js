var secScript = document.createElement("script");
secScript.setAttribute("type", "text/javascript");
secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/AT176B72000860000A/Base64Code.js?domainKey=developplatform");
document.body.insertBefore(secScript, document.body.lastChild);
//获取群机器人content
function getContent(rowData) {
  let content = {
    businessId: "收款提醒",
    titleZone: {
      type: 0,
      icon: "https://www.example.com/",
      text: "收款提醒"
    },
    contentZone: [
      {
        type: "imageView",
        data: {
          url: "https://www.example.com/",
          ratio: 1.5
        }
      },
      {
        type: "textView",
        data: {
          text: rowData.shoukuanfuzeren + "，您有1笔预计收款已延期！",
          level: 0
        }
      },
      {
        type: "textView",
        data: {
          text: "预计收款日期：" + rowData.shoukuanjihuariqi + "",
          level: 1
        }
      },
      {
        type: "textView",
        data: {
          text: "预计收款金额：" + rowData.shoukuan + "",
          level: 1
        }
      },
      {
        type: "buttonView",
        data: {
          text: "申请延期",
          url:
            "https://www.example.com/" +
            rowData.code +
            "&s=1&mode=add&domainKey=developplatform&tplid=250020025&serviceCode=168823814540807373&isMobile=true&designPreview=true&useCache=false&live=false"
        }
      }
    ]
  };
  //移动新增态地址：https://c2.yonyoucloud.com/mdf-node/meta/YYArchive/yb98e1c1b3MobileArchive/add?code=202303250002&tenantId=qnrorn3h&s=1&mode=add&domainKey=developplatform&tplid=250020025&serviceCode=1688238145408073735&isMobile=true&designPreview=true&useCache=false&live=false
  //移动浏览态地址：https://c2.yonyoucloud.com/mdf-node/meta/YYArchive/yb98e1c1b3MobileArchive/browse?code=202303250002&tenantId=qnrorn3h&s=1&mode=add&domainKey=developplatform&tplid=250020025&serviceCode=1688238145408073735&isMobile=true&designPreview=true&useCache=false&live=false
  const base64 = new Base64Code();
  let content_base64 = base64.enCode(JSON.stringify(content));
  return content_base64;
}
viewModel.get("button22ve") &&
  viewModel.get("button22ve").on("click", function (data) {
    // 收款提醒--单击
    var rowdata = viewModel.getGridModel().getRow(data.index);
    var content = getContent(rowdata);
    debugger;
    cb.rest.invokeFunction("AT176B72000860000A.rule.getJQR2", { id: rowdata.id, code: rowdata.code, shoukuanfuzerendianhua: rowdata.shoukuanfuzerendianhua, content: content }, function (err, res) {
      debugger;
    });
  });