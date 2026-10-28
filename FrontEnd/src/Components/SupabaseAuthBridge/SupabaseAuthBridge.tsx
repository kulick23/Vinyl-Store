import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseProvider } from '../../config/dataProvider';
import { getSupabaseClient } from '../../lib/supabase';
import { clearCredentials, setCredentials } from '../../redux/auth/authSlice';

export function SupabaseAuthBridge() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isSupabaseProvider) return;

    const supabase = getSupabaseClient();

    const syncSession = (session: Session | null) => {
      if (session) {
        dispatch(
          setCredentials({
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
          })
        );
      } else {
        dispatch(clearCredentials());
      }
    };

    void supabase.auth
      .getSession()
      .then(({ data }) => syncSession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session);
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return null;
}
