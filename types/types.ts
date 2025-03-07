export interface APIGatewayEvent {
    headers: {
      [key: string]: string;
    };
    body?: string; 
  }