const {remote} = require('electron')
const $ = require('jquery')
const process = require('child_process')
const path = require('path')

const {dialog} = remote
var extname
var inputPath

$("#upload").click(function(){

    dialog.showOpenDialog(null, {
        properties: ['openFile']
      }).then(result => {
        console.log(result.filePaths[0])
        inputPath = result.filePaths[0]
        extname = path.extname(result.filePaths[0])
        $("#filePath").html(result.filePaths[0])
      }).catch(err => {
        console.log(err)
      })
})

$("#save").click(async function(){
    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save video',
        defaultPath: `vid-${Date.now()}.${extname}`
      });

      console.log(filePath)

      $(this).html("Processing Video")

      $(this).prop("disabled",true)


      process.exec(`ffmpeg -i "${inputPath}" -an ${filePath}`,function(error,stdout, stderr){

        console.log('stdout: ' + stdout);

        $("#save").prop("disabled",false)
        $("#save").html("Save Video and Remove Audio")

        Notification.requestPermission().then(function(result){
            var myNotification = new Notification('Conversion Completed',{
                body:"Your file was successfully converted"
            });
                    
        })
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    
    })
})