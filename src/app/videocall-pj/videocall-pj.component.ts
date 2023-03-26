import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Peer, { MediaConnection } from 'peerjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { VisitService } from '../visit/visit.service';

@Component({
  selector: 'app-videocall-pj',
  templateUrl: './videocall-pj.component.html',
  styleUrls: ['./videocall-pj.component.scss'],
})
export class VideocallPJComponent implements OnDestroy {

  @ViewChild('remoteVideo') remoteVideo?: any;
  @ViewChild('localVideo') localVideo?: any;

  peer!: Peer;
  mediaConnection!: MediaConnection;

  constructor(private renderer: Renderer2, private userService: UserService, private visitService: VisitService, private activatedRoute: ActivatedRoute) {
    userService.getUserData().subscribe(resp => {
      if (resp.status == 200) {
        this.peer = new Peer(
          "peer" + resp.body.id_persona,
          {
            host: environment.apiLocation,
            port: 8080,
            path: '/connect',
            secure: true
          });
        this.setupForCall();

        this.peer.on('error', err => {
          console.log(err);
        });

        this.getMediaStream().then(stream => {
          const video = this.localVideo.nativeElement;
          this.renderer.setProperty(video, 'srcObject', stream);
          video.play();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.peer.destroy();
  }

  startCall() {
    this.visitService.getVisitPartecipants(this.activatedRoute.snapshot.params["visitId"]).subscribe(resp => {
      if(resp.status == 200) {
        this.call("peer" + resp.body.fk_persona);
      }
    });
  }

  endCall() {
    this.mediaConnection.close();
  }

  getPeerId() {
    return this.peer.id;
  }

  async call(peerId: string) {
    const stream = await this.getMediaStream();
    this.mediaConnection = this.peer.call(peerId, stream);

    this.mediaConnection.on('stream', (remoteStream) => {
      this.showVideoStream(remoteStream);
    });

    this.mediaConnection.on('close', () => {
      console.log("close del caller");
      this.remoteVideo.nativeElement.pause();
      this.remoteVideo.nativeElement.removeAttribute('src'); // empty source
      this.remoteVideo.nativeElement.load();
    });
  }

  getMediaStream() {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  }

  setupForCall() {
    this.peer.on('call', async (call) => {
      const stream = await this.getMediaStream();
      this.mediaConnection = call;
      this.mediaConnection.answer(stream);

      this.mediaConnection.on('stream', (remoteStream) => {
        this.showVideoStream(remoteStream);
      });

      this.mediaConnection.on('close', () => {
      console.log("close del callee");

        this.remoteVideo.nativeElement.pause();
        this.remoteVideo.nativeElement.removeAttribute('src'); // empty source
        this.remoteVideo.nativeElement.load();
      });
    });
  }

  private showVideoStream(remoteStream: MediaStream) {
    const video = this.remoteVideo.nativeElement;
    this.renderer.setProperty(video, 'srcObject', remoteStream);
    video.play();
  }
}
