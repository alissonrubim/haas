import createClient, { HassApi } from './websocket/homeAssistantWebSocketClient';
import { HomeAssistantEntityState, HomeAssistantMessage } from './presentations';


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

  public async getStates(): Promise<HomeAssistantEntityState[] | undefined> {
    return (await this.#currentConnection?.getStates())?.result as any[];
  }

  public async callService(domain: string, service: string, data?: any) {
    return (await this.#currentConnection?.callService(domain, service, data))?.result as any
  }

  public onMessage(handler: (evt: HomeAssistantMessage) => void) {
    this.#currentConnection?.on("message", (evt) => {
      handler(evt as HomeAssistantMessage)
    })
  }
  
  public async subscribeToTrigger(trigger: any): Promise<string>{
    const subscription = await this.#currentConnection?.subscribeToTrigger(trigger);
    return Promise.resolve(subscription!.id as unknown as string)
  }
}