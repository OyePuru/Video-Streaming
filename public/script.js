const socket = io('/')
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
myVideo.muted = true;

let myVideoStream;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3000'
});

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);
  socket.on("user-connected", (userId) => {
    console.log("New User conneceted");
    connecToNewUser(userId, stream);
  });

  peer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    })
  })
});


peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);
})


// Functions Here 

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => { //loaded
    video.play();
  });
  videoGrid.appendChild(video);
}

const connecToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);
  })
}