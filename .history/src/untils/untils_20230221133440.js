export function mediaCompatible () {
  // get the local stream, show it in the local video element and send it
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // 浏览器兼容
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia ||
        navigator.oGetUserMedia;

      if (!getUserMedia) {
        console.log("当前浏览器不支持拍摄功能");
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }

      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
}