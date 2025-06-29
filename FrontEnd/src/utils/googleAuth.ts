// Google Identity Services types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export interface GoogleUser {
  credential: string;
}

export interface GoogleAuthConfig {
  clientId: string;
  callback: (response: GoogleUser) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

export const GOOGLE_CLIENT_ID = '1043524101535-sapm1l40qnbm3oppdkusn6332kotbvoj.apps.googleusercontent.com';

export const initializeGoogleAuth = (config: GoogleAuthConfig): void => {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.initialize({
      client_id: config.clientId,
      callback: config.callback,
      auto_select: config.auto_select || false,
      cancel_on_tap_outside: config.cancel_on_tap_outside || true,
    });
  }
};

export const renderGoogleButton = (
  element: HTMLElement,
  options: {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string;
    locale?: string;
  } = {}
): void => {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.renderButton(element, {
      theme: options.theme || 'outline',
      size: options.size || 'large',
      text: options.text || 'continue_with',
      shape: options.shape || 'rectangular',
      logo_alignment: options.logo_alignment || 'left',
      width: options.width || '100%',
      locale: options.locale || 'en',
    });
  }
};

export const promptGoogleSignIn = (): void => {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.prompt();
  }
};

export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      // Check if script is already loaded
      if (window.google) {
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      
      document.head.appendChild(script);
    } else {
      reject(new Error('Window object not available'));
    }
  });
};

// Utility function to parse JWT token
export const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}; 