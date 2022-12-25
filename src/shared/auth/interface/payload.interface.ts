export interface Payload {
  sub: string;
  context: {
    username: string;
    type: string;
    extra: number;
    author_id: number;
  };
}
