<template>
  <div class="container">
    <div class="topBar">
      <h3>语音合成</h3>
      <h3>语音识别</h3>
      <h3>语音合成服务</h3>
      <h3>语音合成服务</h3>
    </div>
    <div class="asrInput">
      <input type="text" v-model="text">
      <input id="Audio" @change="readFile($event)" type="file">
      <textarea name="" id="asr" cols="30" rows="10">
        
      </textarea>
      <button id="start" @click="startSound">点击录音</button>
      <button id="stop" disabled @click="stop">停止</button>
            <textarea name="" id="" cols="30" rows="10">
        
      </textarea>
    </div>
    <div class="sendButton">
      <button @click = "sendTts">确定</button>
      <button>确定</button>
      <button>确定</button>
      <button>确定</button>
    </div>
    <div class="result">
      <input type="text">
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
      constraints: {
        audio: true,
        video: false,
      },
      chunks: [],
      ac: '',
    }
  },
  components: {

  },
  mounted() {
    // 兼容测试
    mediaCompatible(this.constraints);
  },
  methods: {
    //& 语音识别
    sendAsr() {
      let asr = {
        audio:this.audio,
        audio_format:'wav',
        sample_rate:'',
        lang: this.lang
      }
      getAsr(asr).then(data => {
        console.log(data);
      })

    },
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
          this.recorder = new HZRecorder(stream,config);
          console.log('rec',this.recorder);
          this.recorder.start();


        })
        .catch(error => {
          console.log("getUserMedia error: " + error.name, error);
        })
    },
    saveRecordingData(e) {
      console.log(e);
      let file = new Blob(this.chunks,{type:'audio/wav'});
      this.blobToBase64(file, (dataurl) => {
        console.log(dataurl)
        this.pdfBase64 = dataurl.split(',')[1];
        this.sendAsr();
      });
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
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      })
    },
    stop() {
      document.querySelector('#stop').setAttribute("disabled", true);
      document.querySelector('#start').removeAttribute("disabled");
      // 随机命名
      let random_name = 'video/' + new Date().getTime() + '.wav';
        // 上传
        var reader = new FileReader()
        console.log('reader', reader)
        let blob = this.recorder.getBlob()
        console.log('blob', blob)
        reader.readAsArrayBuffer(blob)
        reader.onload = function (event) {
          let blob = event.target.result;
          console.log(blob);
        }
      //! 关闭浏览器上边的小红点
      this.recorder.stream.getTracks()[0].stop()
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
    height: 100vw;
    background-color: white;
  }
  .topBar {
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
    height: 100px;
    display: flex;
    justify-content: space-around;
  }
  .asrInput {
    height: 100px;
    display: flex;
    justify-content: space-around;
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
</style>