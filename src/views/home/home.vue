<template>
  <div class="container">
    <div class="leftIcon">Design goal<br>
      <span>语音助手</span>
    </div>
    <div class="topBar">
      <div ><img src="../../assets/00054-3542699251-.png"></div>
      <div @click="mode = true" class="bigText">语音合成
        <span>speech synthesis</span>
      </div>
      <div><img src="../../assets/00062-3881013138-starrysky.png"></div>
      <div @click="mode = false" class="bigText">语音识别
        <span>speech recognition</span>
      </div>
      <div><img src="../../assets/00057-3881013133-starrysky.png"></div>
      <div class="bigText">语音合成服务</div>
    </div>
    <div class="asrInput">
      <textarea id="asr" v-if="mode" v-model="text"></textarea>
      <input v-if="!mode" id="Audio" @change="readFile($event)" type="file">
      <button v-if="!mode" id="start" @click="startSound">点击录音</button>
      <button v-if="!mode" id="stop" disabled @click="stop">停止</button>
    </div>
    <div class="sendButton">
      <button @click = "sendTts">确定</button>
    </div>
    <div class="result">
      <input v-model="asr_text" type="text">
    </div>
  </div>

</template>

<script>
// import Recorder from "untils/recorder.js"
import { getTts,getAsr } from "network/getAxios";
import { mediaCompatible,HZRecorder } from "untils/untils";


export default {
  data () {
    return {
      asr:"",
      audio: '',
      text: '',
      lang:'zh_cn',
      toAudio: '',
      recorder: '',
      pdfBase64: '',
      audio_stream:'',
      mode:true,
      constraints: {
        audio: true,
        video: false,
      },
      chunks: [],
      asr_text: '',
    }
  },
  components: {

  },
  mounted() {
    // 兼容测试
    mediaCompatible(this.constraints);
  },
  methods: {
    //! 语音合成
    sendTts() {
      let tts = {
        text:this.text,

      }
      console.log(this.text);
      getTts(this.text).then(data => {
        console.log(data);
        this.toAudio = data.result.audio;
        let send = new Audio(`data:audio/x-wav;base64,${this.toAudio}`);
        send.play();
      })
    },
    //^ 开始录音
    startSound() {
      document.querySelector('#start').setAttribute("disabled", true);
      document.querySelector('#stop').removeAttribute("disabled");
      let videostream = navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then(stream => {
          let config = {}
          this.audio_stream = stream;
          this.recorder = new HZRecorder(stream,config);
          console.log('rec',this.recorder);
          this.recorder.start();


        })
        .catch(error => {
          console.log("getUserMedia error: " + error.name, error);
        })
    },
    //& blob数据转换base64
    blobToBase64(blob, callback) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(blob);
      fileReader.onload = (e) => {
        callback(e.target.result);
      };
    },
    sendAsr() {
      let obj = {
        "audio":this.pdfBase64,
        "audio_format":'wav',
        "sample_rate":0,
        'lang':this.lang
      }
      getAsr(obj).then(data => {
        if (data.code === 200) {
          this.asr_text = data.result.transcription
        }
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      })
    },
    stop() {
      document.querySelector('#stop').setAttribute("disabled", true);
      document.querySelector('#start').removeAttribute("disabled");
        let blob = this.recorder.getBlob()
        console.log('blob', blob)
        this.blobToBase64(blob, (dataurl) => {
          console.log(dataurl)
          this.pdfBase64 = dataurl.split(',')[1];
          this.sendAsr();
        });
      this.audio_stream.getAudioTracks().forEach(item => item.stop())
    },
    //! 读取上传的音频(可以通过)
    readFile(e) {
      let reader = new FileReader();
      let file = e.target.files;
      this.blobToBase64(file[0], (dataurl) => {
        console.log(dataurl)
        this.pdfBase64 = dataurl.split(',')[1];
        this.sendAsr();
      });

    }
  },
}

</script>
<style scoped>
  .container {
    width: 100%;
    height: 100%;
    background-color: #020f16;
    background-size: 100% 100%;
    
    position: absolute;
    top: 0px;
  }
  .topBar {
    width: 40%;
    margin: 0px auto;
    margin-top: 100px;
    color: #80e8ba;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
  }
  .topBar div {
    width: 180px;
    height: 180px;
    border-radius: 20px;
    margin: 2%;
    background-color: #223e42;
    overflow: hidden;
  }
  .topBar img {
    width: 100%;
    height: 100%;
    background-size: 100%;
  }
  .topBar .bigText {
    text-align: right;
    font-size: 29px;
    font-family: Impact;
    font-style: italic;
    line-height: 120px;
  }
  .bigText span {
    font-size: 16px;
    display: inline-block;
    height: 50px;
    color: #6fb6a5;
    transform: translateY(-80px);
  }
  #asr {
    outline: none;
    resize: none;
    border-radius: 10px;
    max-height: 90px;
  }
  #asr:hover {
    border: 1px solid #0a9cec;
  }
  .asrInput {
    height: 100px;
    width: 36%;
    margin: 0px auto;
    display: flex;
    justify-content: center;
  }
  .sendButton {
    height: 24px;
    display: flex;
    justify-content: space-around;
  }
  .result {
    height: 24px;
    display: flex;
    justify-content: center;
  }
  .result input {
    width: 300px;
  }
  .leftIcon {
    position: absolute;
    top: -33px;
    left: -23px;
    width: 150px;
    height: 150px;
    background-color: #18444b;
    color: #87e8c2;
    line-height: 10;
    padding-left: 57px;
    box-sizing: border-box;
    border-radius: 50%;
  }
  .leftIcon span {
    position: absolute;
    top: 31px;
    left: 93px;
    width: 69px;
    color: #648c92;
  }
</style>