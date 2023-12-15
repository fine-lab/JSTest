let AbstractTrigger = require("AbstractTrigger");
function test(obj) {
  let success = true;
  let res = Object.values(obj).reduce((obj, f) => {
    let flag = false;
    try {
      flag = f();
    } catch (e) {
      if ("object" == typeof e) {
        flag = e.message;
      } else {
        flag = e;
      }
    }
    if (success) {
      let type = typeof flag;
      if ("boolean" == type) {
        if (false === flag) {
          success = false;
        }
      } else if ("string" == type) {
        success = false;
      } else if ("object" == type) {
        if (undefined !== flag.success) {
          success = flag.success;
        } else if (!flag.flag) {
          success = false;
        }
      }
    }
    obj[f.name] = flag;
    return obj;
  }, {});
  return { success, res };
}
let SendMsgTest = {
  sendmail: function () {
    var mailReceiver = ["https://www.example.com/"];
    var channels = ["mail"];
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver,
      channels: channels,
      subject: "normal mail title",
      content: "mail content"
    };
    var result = sendMessage(messageInfo);
    return result;
  },
  uspace: function () {
    var uspaceReceiver = ["81191106-0be1-415e-ab2f-0a64ab847e44"];
    var channels = ["uspace"];
    var title = "title work notify";
    var content = "content";
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
    return result;
  },
  uspaceTodo: function () {
    var uspaceReceiver = ["81191106-0be1-415e-ab2f-0a64ab847e44"];
    var receiver = ["81191106-0be1-415e-ab2f-0a64ab847e44"];
    var channels = ["uspace"];
    var title = "title work todo";
    var content = "content";
    var createToDoExt = {
      webUrl: "www.baidu.com"
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      receiver: receiver,
      channels: channels,
      subject: title,
      content: content,
      messageType: "createToDo",
      createToDoExt: createToDoExt
    };
    var result = sendMessage(messageInfo);
    return result;
  },
  uspaceWarn: function () {
    var uspaceReceiver = ["81191106-0be1-415e-ab2f-0a64ab847e44"];
    var channels = ["uspace"];
    var title = "title work warn";
    var content = "content";
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content,
      groupCode: "prewarning"
    };
    var result = sendMessage(messageInfo);
    return result;
  },
  tempmail: function () {
    var mailReceiver = ["https://www.example.com/"];
    var templateCode = "RPATest1##aUxTqRSC";
    var channels = ["mail"];
    var busiData = {
      name: "testuser"
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      templateCode: templateCode,
      busiData: busiData,
      mailReceiver: mailReceiver,
      channels: channels
    };
    var result = sendMessage(messageInfo);
    return result;
  },
  tempuspace: function () {
    var uspaceReceiver = ["81191106-0be1-415e-ab2f-0a64ab847e44"];
    var channels = ["uspace"];
    var templateCode = "RPATest1##aUxTqRSC";
    var busiData = {
      name: "testuser"
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      templateCode: templateCode,
      uspaceReceiver: uspaceReceiver,
      busiData: busiData,
      channels: channels
    };
    var result = sendMessage(messageInfo);
    return result;
  },
  tempuspaceToDo: function () {
    var receiver = ["81191106-0be1-415e-ab2f-0a64ab847e44"];
    var channels = ["uspace"];
    var templateCode = "RPATest1##aUxTqRSC";
    var busiData = {
      name: "testuser"
    };
    var createToDoExt = {
      webUrl: "www.baidu.com"
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      receiver: receiver,
      templateCode: templateCode,
      channels: channels,
      busiData: busiData,
      messageType: "createToDo",
      createToDoExt: createToDoExt
    };
    var result = sendMessage(messageInfo);
    return result;
  },
  tempuspaceWarn: function () {
    var receiver = ["81191106-0be1-415e-ab2f-0a64ab847e44"];
    var channels = ["uspace"];
    var templateCode = "5##zvR2o5hE";
    var busiData = {
      url: "testurl"
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      receiver: receiver,
      templateCode: templateCode,
      channels: channels,
      busiData: busiData,
      groupCode: "prewarning"
    };
    var result = sendMessage(messageInfo);
    return result;
  }
};
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return test(SendMsgTest);
  }
}
exports({ entryPoint: MyTrigger });