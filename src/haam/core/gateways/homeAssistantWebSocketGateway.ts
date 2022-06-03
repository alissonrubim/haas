import createClient, { HassApi } from './websocket/homeAssistantWebSocketClient';
import { HomeAssistantEntityStateResponse } from './presentations/homeAssistantEntityState.response';
import { HomeAssistantStateChangeResponse } from './presentations/homeAssistantStateChange.response';

export default class HomeAssistantWebSocketGateway {
  #host: string;
  #port: number;
  #accessToken: string;
  #currentConnection?: HassApi = undefined;
  
  constructor(host: string, port: number, accessToken: string){
    this.#host = host;
    this.#port = port;
    this.#accessToken = accessToken;
  }

  public async connect() {
    this.#currentConnection = await createClient({
      host: this.#host,
      port: this.#port,
      token: this.#accessToken
    });
  }

  public async getStates(): Promise<HomeAssistantEntityStateResponse[] | undefined> {
    return await this.#currentConnection?.getStates();
  }

  public async callService(domain: string, service: string, data?: any) {
    return await this.#currentConnection?.callService(domain, service, data)
  }

  public handleStateChange(handler: (evt: HomeAssistantStateChangeResponse) => void) {
    this.#currentConnection?.on("state_changed", (evt) => {
      handler(evt as HomeAssistantStateChangeResponse)
    })
  }
}