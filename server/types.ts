declare module 'express-session' {
  interface SessionData {
    twitterCodeVerifier?: string;
    twitterState?: string;
  }
}