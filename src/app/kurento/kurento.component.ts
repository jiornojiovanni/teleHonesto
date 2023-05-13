import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WebRtcPeer} from 'kurento-utils';
import {ActivatedRoute} from '@angular/router';
import {UserService} from "../user/user.service";
import {VisitService} from "../visit/visit.service";
import {firstValueFrom} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {environment} from "../../environments/environment";

const NOT_REGISTERED = 0;
const REGISTERING = 1;
const REGISTERED = 2;
const NO_CALL = 0;
const PROCESSING_CALL = 1;
const IN_CALL = 2;

@Component({
  selector: 'app-kurento',
  templateUrl: './kurento.component.html',
  styleUrls: ['./kurento.component.scss']
})
export class KurentoComponent implements OnInit, OnDestroy {
  visitID = this.activatedRoute.snapshot.params["visitId"];
  ws!: WebSocket;
  webRtcPeer: any;
  callState: any = null;
  localVideo!: Element;
  remoteVideo?: Element;
  registerState: any = null;
  peer!: string;
  ownPeer!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private visitService: VisitService,
    private elRef: ElementRef) {

  }

  async ngOnInit() {
    this.localVideo = this.elRef.nativeElement.querySelector('#local-video');
    this.remoteVideo = this.elRef.nativeElement.querySelector('#remote-video');
    const resp = await firstValueFrom(this.userService.getUserData());
    this.ownPeer = resp.body.id_persona;
    const resp1 = await firstValueFrom(this.visitService.getVisitPartecipants(this.visitID));
    this.peer = resp1.body.fk_persona;
    this.ws = new WebSocket('wss://' + environment.apiLocation + ":" + environment.kurentoPort);
    this.ws.addEventListener("open", () => {

      this.ws.addEventListener("message", (message: any) => {
        const parsedMessage = JSON.parse(message.data);
        console.info('Received message: ' + message.data);

        switch (parsedMessage.id) {
          case 'registerResponse':
            this.registerResponse(parsedMessage);
            break;
          case 'callResponse':
            this.callResponse(parsedMessage);
            break;
          case 'incomingCall':
            this.incomingCall(parsedMessage);
            break;
          case 'startCommunication':
            this.startCommunication(parsedMessage);
            break;
          case 'stopCommunication':
            console.info("Communication ended by remote peer");
            this.stop(true);
            break;
          case 'iceCandidate':
            this.webRtcPeer.addIceCandidate(parsedMessage.candidate);
            break;
          default:
            console.error('Unrecognized message', parsedMessage);
        }
      });
      this.setRegisterState(NOT_REGISTERED);
      this.register();
      this.call();
    });
  }

  setRegisterState(nextState: any) {
    switch (nextState) {
      case NOT_REGISTERED:
        break;

      case REGISTERING:
        break;

      case REGISTERED:
        this.setCallState(NO_CALL);
        break;

      default:
        return;
    }
    this.registerState = nextState;
  }

  setCallState(nextState: any) {
    switch (nextState) {
      case NO_CALL:
        break;
      case PROCESSING_CALL:
        break;
      case IN_CALL:
        break;
      default:
        return;
    }
    this.callState = nextState;
  }


  registerResponse(message: any) {
    if (message.response == 'accepted') {
      this.setRegisterState(REGISTERED);
    } else {
      this.setRegisterState(NOT_REGISTERED);
      const errorMessage = message.message ? message.message
        : 'Unknown reason for register rejection.';
      console.log(errorMessage);
    }
  }

  callResponse(message: any) {
    if (message.response != 'accepted') {
      console.info('Call not accepted by peer. Closing call');
      const errorMessage = message.message ? message.message
        : 'Unknown reason for call rejection.';
      console.log(errorMessage);
      this.stop(true);
    } else {
      this.setCallState(IN_CALL);
      this.webRtcPeer.processAnswer(message.sdpAnswer);
    }
  }

  startCommunication(message: any) {
    this.setCallState(IN_CALL);
    this.webRtcPeer.processAnswer(message.sdpAnswer);
  }

  incomingCall(message: any) {
    let response;
// If busy just reject without disturbing user
    if (this.callState != NO_CALL) {
      response = {
        id: 'incomingCallResponse',
        from: message.from,
        callResponse: 'reject',
        message: 'busy'

      };
      return this.sendMessage(response);
    }

    this.setCallState(PROCESSING_CALL);
    const options = {
      localVideo: this.localVideo,
      remoteVideo: this.remoteVideo,
      onicecandidate: this.onIceCandidate
    };
    this.webRtcPeer = WebRtcPeer.WebRtcPeerSendrecv(options,
      (
        error: any) => {
        if (error) {
          console.error(error);
          this.setCallState(NO_CALL);
        }
        this.webRtcPeer.generateOffer((error: any, offerSdp: any) => {
          if (error) {
            console.error(error);
            this.setCallState(NO_CALL);
          }
          const response = {
            id: 'incomingCallResponse',
            from: message.from,
            callResponse: 'accept',
            sdpOffer: offerSdp
          };
          this.sendMessage(response);
        });
      });
  }

  onIceCandidate = (candidate: any) => {
    console.log('Local candidate' + (JSON.stringify(candidate)));
    const message = {
      id: 'onIceCandidate',
      candidate: candidate
    };
    this.sendMessage(message);
  };

  stop(message: boolean) {
    this.setCallState(NO_CALL);
    if (this.webRtcPeer) {
      this.webRtcPeer.dispose();
      this.webRtcPeer = null;
      if (!message) {
        this.ws.close();
        const message = {
          id: 'stop'
        };
        this.sendMessage(message);
      }
    } else {
      if (!message) {
      this.ws.close();
        const message = {
          id: 'stop'
        };
        this.sendMessage(message);
      }
    }
  }

  register() {
    this.setRegisterState(REGISTERING);

    const message = {
      id: 'register',
      name: this.ownPeer
    };
    this.sendMessage(message);
  }

  call() {
    this.setCallState(PROCESSING_CALL);

    const options = {
      localVideo: this.localVideo,
      remoteVideo: this.remoteVideo,
      onicecandidate: this.onIceCandidate
    };

    this.webRtcPeer = WebRtcPeer.WebRtcPeerSendrecv(options, (
      error) => {
      if (error) {
        console.error(error);
        this.setCallState(NO_CALL);
      }

      this.webRtcPeer.generateOffer((error: any, offerSdp: any) => {
        if (error) {
          console.error(error);
          this.setCallState(NO_CALL);
        }
        const message = {
          id: 'call',
          from: this.ownPeer,
          to: this.peer,
          sdpOffer: offerSdp
        };
        this.sendMessage(message);
      });
    });
  }

  sendMessage(message: any) {
    const jsonMessage = JSON.stringify(message);
    console.log('Sending message: ' + jsonMessage);
    this.ws.send(jsonMessage);
  }

  ngOnDestroy(): void {
    this.stop(false);
  }

}
