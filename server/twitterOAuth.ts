import crypto from 'crypto';

export class TwitterOAuth2 {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  generateAuthUrl(): { url: string; codeVerifier: string; state: string } {
    // Generate PKCE code verifier and challenge
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    
    // Generate state parameter
    const state = crypto.randomBytes(16).toString('hex');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'tweet.read users.read',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    const url = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    
    return { url, codeVerifier, state };
  }

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<any> {
    const tokenData = {
      grant_type: 'authorization_code',
      client_id: this.clientId,
      code: code,
      redirect_uri: this.redirectUri,
      code_verifier: codeVerifier
    };

    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams(tokenData).toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  async getUserInfo(accessToken: string): Promise<any> {
    const response = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`User info request failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }
}