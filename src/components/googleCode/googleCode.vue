<template>
  <div class="input-box">
        <el-dialog title="google验证码" width="450px" top="200px" :visible.sync="dialogFormVisible" :show-close="showClo" :close-on-click-modal="false"  >
            <div class="input-content" @keydown="keydown" @keyup="keyup" @paste="paste" @mousewheel="mousewheel" @input="inputEvent">
                <input maxlength="1" data-index="0" v-model.trim.number="input[0]" ref="firstinput"/>
                <input maxlength="1" data-index="1" v-model.trim.number="input[1]"/>
                <input maxlength="1" data-index="2" v-model.trim.number="input[2]"/>
                <input maxlength="1" data-index="3" v-model.trim.number="input[3]"/>
                <input maxlength="1" data-index="4" v-model.trim.number="input[4]"/>
                <input maxlength="1" data-index="5" v-model.trim.number="input[5]"/>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogFormVisible = false">
                取消
                </el-button>
                <el-button type="primary" @click="sendCode()">
                确定
                </el-button>
            </div>

        </el-dialog>



  </div>
</template>


<script>
  export default {
    data() {
      return {
        googleCode : '',
        showClo:false,
        dialogFormVisible : true,
        pasteResult: [],
      };
    },
    props: ['code'],
    computed: {
      input() {
        // code 是父组件传进来的默认值，必须是6位长度的数组，这里就不再做容错判断处理
        // 最后空数组是默认值
        return this.code || this.pasteResult.length === 6 ? this.pasteResult : ['', '', '', '', '', '']
      }
    },
    methods: {
      // 解决一个输入框输入多个字符
      inputEvent(e) {
        var index = e.target.dataset.index * 1;
        var el = e.target;
        this.$set(this.input, index, el.value.slice(0, 1))
      },
      keydown(e) {
        var index = e.target.dataset.index * 1;
        var el = e.target;
        if (e.key === 'Backspace') {
          if (this.input[index].length > 0) {
            this.$set(this.input, index, '')
          } else {
            if (el.previousElementSibling) {
              el.previousElementSibling.focus()
              this.$set(this.input, index - 1, '')
            }
          }
        } else if (e.key === 'Delete') {
          if (this.input[index].length > 0) {
            this.$set(this.input, index, '')
          } else {
            if (el.nextElementSibling) {
              this.$set(this.input, index = 1, '')
            }
          }
          if (el.nextElementSibling) {
            el.nextElementSibling.focus()
          }
        } else if (e.key === 'Home') {
          el.parentElement.children[0] && el.parentElement.children[0].focus()
        } else if (e.key === 'End') {
          el.parentElement.children[this.input.length - 1] && el.parentElement.children[this.input.length - 1].focus()
        } else if (e.key === 'ArrowLeft') {
          if (el.previousElementSibling) {
            el.previousElementSibling.focus()
          }
        } else if (e.key === 'ArrowRight') {
          if (el.nextElementSibling) {
            el.nextElementSibling.focus()
          }
        } else if (e.key === 'ArrowUp') {
          if (this.input[index] * 1 < 9) {
            this.$set(this.input, index, (this.input[index] * 1 + 1).toString());
          }
        } else if (e.key === 'ArrowDown') {
          if (this.input[index] * 1 > 0) {
            this.$set(this.input, index, (this.input[index] * 1 - 1).toString());
          }
        }
      },
      keyup(e) {
        var index = e.target.dataset.index * 1;
        var el = e.target;
        if (/Digit|Numpad/i.test(e.code)) {
          this.$set(this.input, index, e.code.replace(/Digit|Numpad/i, ''));
          el.nextElementSibling && el.nextElementSibling.focus();
          if (index === 5) {
            if (this.input.join('').length === 6) {
                // console.log(123)
                document.activeElement.blur();
                this.$emit('complete', this.input);
            }
          }
        } else {
          if (this.input[index] === '') {
            this.$set(this.input, index, '');
          }
        }
      },
      mousewheel(e) {
        var index = e.target.dataset.index;
        if (e.wheelDelta > 0) {
          if (this.input[index] * 1 < 9) {
            this.$set(this.input, index, (this.input[index] * 1 + 1).toString());
          }
        } else if (e.wheelDelta < 0) {
          if (this.input[index] * 1 > 0) {
            this.$set(this.input, index, (this.input[index] * 1 - 1).toString());
          }
        } else if (e.key === 'Enter') {
          if (this.input.join('').length === 6) {
            document.activeElement.blur();
            this.$emit('complete', this.input);
          }
        }
      },
      paste(e) {
        // 当进行粘贴时
        e.clipboardData.items[0].getAsString(str => {
          if (str.toString().length === 6) {
            this.pasteResult = str.split('');
            document.activeElement.blur();
            this.$emit('complete', this.input);
          }
        })
      }
    },
    mounted() {
      // 等待dom渲染完成，在执行focus,否则无法获取到焦点
      this.$nextTick(() => {
        this.$refs.firstinput.focus()
      })
    },
  }
</script>
<style scoped>
.input-content {
    width: 100%;
}

.input-content input {
    width:12%;
    height:40px;
    margin-left:15px;
    text-align: center;

}
 
 
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}
  
</style>