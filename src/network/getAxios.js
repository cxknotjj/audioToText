import axios from "axios";
// import { baseUrl  } from "./env";
let baseUrl = 'http://127.0.1:8090'

// !添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么

  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

//! 获取语音识别
export const getAsr = function (s) {
  let audio_format = s.audio_format;
  let sample_rate = s.sample_rate;
  let lang =s.lang;
  console.log(s);
  return axios.post(baseUrl + '/paddlespeech/asr',{
      audio: s.audio,
      audio_format,
      sample_rate,
      lang,
  })
}

//! 获取语音合成
export const getTts = function (s) {
  let spk_id = s.spk_id;
  let speed = s.speed;
  let volume = s.volume;
  let sample_rate =s.sample_rate;
  let save_path = s.save_path;

  return axios.post(baseUrl + '/paddlespeech/tts',{
      text: s,
  })
}

// //! 获取http协议的流式语音合成
// export const hotcity = function (s) {
//   return axios.post(baseUrl + '/paddlespeech/tts/streaming',{
//     data: {
//       text: s.text,
//       spk_id:s.spk_id,
//     }
//   })
// }

// //! 获取语音识别服务
// export const getAsr = function (s) {
//   return axios.post(baseUrl + '/paddlespeech/asr',{
//     data: {
//       audio: s.audio,
//       audio_format:s.audio_format,
//       sample_rate:s.simple_rate,
//       lang:s.lang,
//       punc:s.punc,
//     }
//   })
// }
