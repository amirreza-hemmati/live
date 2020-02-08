// variables
const displayId = document.getElementById("displayId");
const connectionId = document.getElementById("connId");
const btnCall = document.getElementById("call-button");
const remoteVideo = document.getElementById("rVideo");
const localVideo = document.querySelector("#lVideo");
const getUserMedia =
  navigator.getUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.webkitGetUserMedia;
/* Video Chat */
// Prefer camera resolution nearest to 1280x720.
var constraints = { audio: true, video: true };
const peer = new Peer({ key: "lwjd5qra8257b9" });

if (getUserMedia) {
  navigator.getUserMedia(
    constraints,
    mediaStream => {
      localVideo.srcObject = mediaStream;
      localVideo.onloadedmetadata = function(e) {
        localVideo.play();
      };

      btnCall.addEventListener("click", () => {
        try {
          const call = peer.call(connectionId.value, mediaStream);
          call.on("stream", remoteStream => {
            remoteVideo.srcObject = remoteStream;
            remoteVideo.onloadedmetadata = function(e) {
              remoteVideo.play();
            };
          });
          console.log("calling ...");
        } catch (error) {
          console.log(error);
        }
      });
    },
    error => console.log(error)
  );
}

peer.on("call", call => {
  if (getUserMedia) {
    navigator.getUserMedia(
      constraints,
      mediaStream => {
        call.answer(mediaStream); // Answer the call with an A/V stream.
        call.on("stream", function(remoteStream) {
          // Show stream in some video/canvas element.
          remoteVideo.srcObject = remoteStream;
          remoteVideo.onloadedmetadata = function(e) {
            remoteVideo.play();
          };
        });
      },
      error => console.log(error)
    );
  }
});

peer.on("open", id => {
  displayId.innerHTML = id;
});
