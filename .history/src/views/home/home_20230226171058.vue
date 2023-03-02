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
          // this.ac = new AudioContext({
          //   sampleRate:16000
          // })

          // let source = this.ac.createMediaStreamSource(stream);
          // //构造参数依次为缓冲区大小，输入通道数，输出通道数
          // let scriptNode = this.ac.createScriptProcessor(4096, 1, 1);
          // //创建音频处理的输出节点
          // let dest = this.ac.createMediaStreamDestination();
          // //串联连接
          // source.connect(scriptNode);
          // scriptNode.connect(dest);
          // //添加事件处理
          // scriptNode.onaudioprocess = (audioProcessingEvent) => {
          //     //输入流位置
          //     var inputBuffer = audioProcessingEvent.inputBuffer;
          //     //输出流位置
          //     var outputBuffer = audioProcessingEvent.outputBuffer;
          //     //遍历通道处理数据，当前只有1个输入1个输出
          //     for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
          //         var inputData = inputBuffer.getChannelData(channel);
          //         var outputData = outputBuffer.getChannelData(channel);
          //         //用按钮控制是否记录流信息
          //         // if (isRecording) {
          //         //     for (let i = 0; i < inputData.length; i = i + 1) {
          //         //         //直接将输入的数据传给输出通道
          //         //         outputData[i] = inputData[i];
          //         //     }
          //         // }
          //         console.log(this.ArrayBufferToBase64(inputBuffer)) 
          //         // this.pdfBase64 += 
          //         console.log(inputData)
          //     };
          // }


          this.recorder = new MediaRecorder(stream,{mimeType:'audio/webm'});
          this.recorder.start();
          //绑定事件 在执行recorder.stop()后触发 
          this.recorder.ondataavailable = this.getRecordingData;
          this.recorder.onstop = this.saveRecordingData;

        })
        .catch(error => {
          console.log("getUserMedia error: " + error.name, error);
        })
    },
    //* 获取音频流
    getRecordingData(e) {
      this.chunks.push(e.data)
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
      this.recorder.stop();
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