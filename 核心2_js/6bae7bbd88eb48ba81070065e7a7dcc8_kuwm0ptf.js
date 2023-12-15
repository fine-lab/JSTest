function test() {
  alert("一周已经过去,现在执行函数");
}
function startCountdown(duration, elementId) {
  const countdownElement = document.getElementById(elementId);
  let countdownTime = duration;
  function updateCountdown() {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    countdownElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
    countdownTime--;
    if (countdownTime < 0) {
      clearInterval(timer);
      countdownElement.textContent = "倒计时结束";
    }
  }
  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
}
const oneweekinmillis = 60000;
viewModel.get("button19wb") &&
  viewModel.get("button19wb").on("click", function (data) {
    //计时器--单击
    setTimeout(test, oneweekinmillis);
    // 使用方法
    startCountdown(60, "ybe94d647d|ticket_id");
    alert("计时器开始计时");
  });